import { Context } from 'grammy';
import { renderMainKeyboard } from '../keyboards/mainKeyboard';

/**
 * Вывод при вызове команды старт
 * @param ctx
 * @returns
 */
export const outputStartText = async (ctx: Context) => {
  const keyboard = await renderMainKeyboard();

  return ctx.reply('👋 Welcome to the Task Manager Bot!\n\nUse /help to see available commands.', { reply_markup: keyboard });
};
