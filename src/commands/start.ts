import { Context } from 'grammy';
import { renderMainKeyboard } from '../keyboards/mainKeyboard';
import User from '../models/user';
import UserSettings from '../models/userSettings';
import logger from '../utils/logger';

/**
 * Вывод при вызове команды старт
 * @param ctx
 * @returns
 */
export const outputStartText = async (ctx: Context) => {
  try {
    if (!ctx.from) {
      return ctx.reply('Unable to identify the user.');
    }

    // Создать пользоваетеля или проверить еслть ли он
    const [user] = await User.findOrCreate({
      where: { id: ctx.from.id },
      defaults: {
        name: ctx.from.first_name || 'Unknown',
      },
    });

    const [userSettings] = await UserSettings.findOrCreate({
      where: { userId: user.id },
      defaults: {
        timezone: 'UTC+4',
        notificationTimes: JSON.stringify(['09:00', '12:00', '15:00', '17:00']),
      },
    });

    logger.info(`User ${ctx.from.first_name} (${user.id}) started the bot`);
    const keyboard = await renderMainKeyboard();

    return ctx.reply('👋 Welcome to the Task Manager Bot!\n\nUse /help to see available commands.', {
      reply_markup: keyboard,
    });
  } catch (error) {
    logger.error('Error in start command:', error);
    return ctx.reply('Error occurred while starting the bot');
  }
};
