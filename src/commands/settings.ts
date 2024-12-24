import { Bot, Context, InlineKeyboard } from 'grammy';
import UserSettings from '../models/userSettings';
import { updateUserNotifications } from '../services/notificationService';
import logger from '../utils/logger';

/**
 * Вывод при вызове настроек
 * @param ctx
 * @returns
 */
export const outputSettingsText = async (ctx: Context) => {
  try {
    if (!ctx.from) return;

    const settings = await UserSettings.findOne({
      where: { userId: ctx.from.id },
    });

    if (!settings) {
      return ctx.reply('Настройки не найдены');
    }

    const times = JSON.parse(settings.notificationTimes);
    const keyboard = new InlineKeyboard().text('Изменить время уведомлений', 'change_notifications').row().text('Изменить часовой пояс', 'change_timezone');

    const message = `Ваши настройки:\n\nЧасовой пояс: ${settings.timezone}\nВремя уведомлений: ${times.join(', ')}`;

    return ctx.reply(message, { reply_markup: keyboard });
  } catch (error) {
    logger.error('Error in settings:', error);
    return ctx.reply('Произошла ошибка при получении настроек');
  }
};

export const handleNotificationTimeUpdate = async (ctx: Context, bot: Bot<Context>) => {
  try {
    if (!ctx.from || !ctx.message?.text) {
      logger.warn('Missing user or message text');
      return;
    }

    const times = ctx.message.text.split(',').map((t) => t.trim());

    const validTimes = times.every((time) => /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time));
    if (!validTimes) {
      logger.warn(`Invalid time format: ${ctx.message.text}`);
      await ctx.reply('Неверный формат времени. Используйте формат HH:MM, например: 09:00, 15:30');
      return;
    }

    const settings = await UserSettings.findOne({
      where: { userId: ctx.from.id },
    });

    if (!settings) {
      logger.warn(`Settings not found for user ${ctx.from.id}`);
      await ctx.reply('Настройки не найдены');
      return;
    }

    // Обновляем настройки в БД
    settings.notificationTimes = JSON.stringify(times);
    await settings.save();
    logger.info(`Saved new notification times for user ${ctx.from.id}`);

    // Обновляем расписание уведомлений
    await updateUserNotifications(bot, ctx.from.id);
    logger.info(`Updated notification schedule for user ${ctx.from.id}`);

    await ctx.reply(`Время уведомлений обновлено: ${times.join(', ')}`);
  } catch (error) {
    logger.error('Error updating notification times:', error);
    await ctx.reply('Произошла ошибка при обновлении времени уведомлений');
    throw error; // Пробрасываем ошибку для обработки выше
  }
};
