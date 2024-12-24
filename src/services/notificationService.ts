import { Bot, Context } from 'grammy';
import schedule from 'node-schedule';
import User from '../models/user';
import UserSettings from '../models/userSettings';
import { getTasksForUser } from './taskService';
import { formatTaskList } from '../utils/taskFormatter';
import logger from '../utils/logger';

// Хранилище для активных задач планировщика
const activeJobs = new Map<string, schedule.Job>();

export const setupNotifications = (bot: Bot<Context>) => {
  // Функция для отправки уведомления
  const sendNotification = async (userId: number, time: string) => {
    try {
      const tasks = await getTasksForUser(userId);
      if (tasks.length === 0) return;

      const message = `🕒 ${time}\n\n${formatTaskList(tasks)}`;
      await bot.api.sendMessage(userId, message);
      logger.info(`Notification sent to user ${userId} at ${time}`);
    } catch (error) {
      logger.error(`Error sending notification to user ${userId}:`, error);
    }
  };

  // Функция для создания задачи планировщика
  const createScheduleJob = (userId: number, time: string, timezone: string) => {
    const [hours, minutes] = time.split(':');
    const rule = new schedule.RecurrenceRule();
    rule.hour = parseInt(hours);
    rule.minute = parseInt(minutes);
    rule.tz = timezone;

    const jobKey = `${userId}_${time}`;

    // Отменяем существующую задачу, если она есть
    if (activeJobs.has(jobKey)) {
      activeJobs.get(jobKey)?.cancel();
    }

    // Создаем новую задачу
    const job = schedule.scheduleJob(rule, () => sendNotification(userId, time));
    activeJobs.set(jobKey, job);

    logger.info(`Scheduled notification for user ${userId} at ${time} (${timezone})`);
  };

  // Планировщик уведомлений
  const scheduleUserNotifications = async () => {
    // Отменяем все активные задачи
    activeJobs.forEach((job) => job.cancel());
    activeJobs.clear();

    const users = await User.findAll({
      include: [UserSettings],
    });

    users.forEach((user) => {
      const settings = user.UserSettings;
      if (!settings) return;

      try {
        const times = JSON.parse(settings.notificationTimes);
        times.forEach((time: string) => {
          createScheduleJob(user.id, time, settings.timezone);
        });
      } catch (error) {
        logger.error(`Error parsing notification times for user ${user.id}:`, error);
      }
    });
  };

  // Запускаем планировщик при старте
  scheduleUserNotifications().catch((error) => {
    logger.error('Error setting up notifications:', error);
  });

  // Перезапускаем планировщик каждый час для учета изменений в БД
  schedule.scheduleJob('0 * * * *', () => {
    logger.info('Refreshing notification schedules');
    scheduleUserNotifications().catch((error) => {
      logger.error('Error refreshing notifications:', error);
    });
  });
};

// Добавляем экспорт функции обновления расписания для конкретного пользователя
export const updateUserNotifications = async (bot: Bot<Context>, userId: number) => {
  try {
    const user = await User.findOne({
      where: { id: userId },
      include: [UserSettings],
    });

    if (!user?.UserSettings) {
      logger.warn(`No settings found for user ${userId}`);
      return;
    }

    // Удаляем старые задачи пользователя
    activeJobs.forEach((job, key) => {
      if (key.startsWith(`${userId}_`)) {
        job.cancel();
        activeJobs.delete(key);
      }
    });

    // Создаем новые задачи
    const times = JSON.parse(user.UserSettings.notificationTimes);
    times.forEach((time: string) => {
      const [hours, minutes] = time.split(':');
      const rule = new schedule.RecurrenceRule();
      rule.hour = parseInt(hours);
      rule.minute = parseInt(minutes);
      rule.tz = user.UserSettings.timezone;

      const jobKey = `${userId}_${time}`;
      const job = schedule.scheduleJob(rule, () => sendNotification(userId, time));
      activeJobs.set(jobKey, job);
    });

    logger.info(`Updated notification schedule for user ${userId}`);
  } catch (error) {
    logger.error(`Error updating notifications for user ${userId}:`, error);
  }
};
