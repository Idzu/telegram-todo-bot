import { Bot, Context } from 'grammy';
import schedule from 'node-schedule';
import User from '../models/user';
import { getTasksForUser } from './taskService';
import { formatTaskList } from '../utils/taskFormatter';
import logger from '../utils/logger';
import UserSettings from '../models/userSettings';

// Хранилище активных задач планировщика
const activeJobs = new Map<string, schedule.Job>();

// Статичное время для уведомлений (UTC+4)
const notificationTimes = ['09:00', '12:00', '15:00', '17:00'];

// Функция для отправки уведомления
const sendNotification = async (bot: Bot<Context>, userId: number, time: string): Promise<void> => {
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

// Функция для создания задачи в планировщике
const createScheduleJob = (bot: Bot<Context>, userId: number, time: string): void => {
  const [hours, minutes] = time.split(':').map(Number);
  const rule = new schedule.RecurrenceRule();
  rule.hour = hours;
  rule.minute = minutes;

  const jobKey = `${userId}_${time}`;

  // Отменяем существующую задачу, если она есть
  if (activeJobs.has(jobKey)) {
    activeJobs.get(jobKey)?.cancel();
    activeJobs.delete(jobKey);
  }

  // Создаём новую задачу
  const job = schedule.scheduleJob(rule, () => sendNotification(bot, userId, time));
  activeJobs.set(jobKey, job);
};

// Планировщик уведомлений
export const setupNotifications = async (bot: Bot<Context>): Promise<void> => {
  try {
    // Получаем всех пользователей из базы
    const users = await User.findAll();

    if (users.length === 0) {
      logger.info('No users found for notifications.');
      return;
    }

    // Очищаем предыдущие задачи
    activeJobs.forEach((job) => job.cancel());
    activeJobs.clear();

    // Планируем уведомления для каждого пользователя
    users.forEach((user) => {
      notificationTimes.forEach((time) => {
        createScheduleJob(bot, user.id, time);
      });
    });

    logger.info('All notifications have been scheduled.');
  } catch (error) {
    logger.error('Error setting up notifications:', error);
  }
};

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

    // Logic to update user notifications...
  } catch (error) {
    logger.error(`Error updating notifications for user ${userId}:`, error);
  }
};
