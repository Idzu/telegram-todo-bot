import { Context, NextFunction } from 'grammy';
import { renderMainKeyboard } from '../keyboards/mainKeyboard';

/**
 * Middleware для рендера клавиатуры, при вводе лююого текста
 * @param ctx
 * @param next
 */
export const mainKeyboardMiddleware = async (ctx: Context, next: NextFunction) => {
  if (ctx.chat) {
    const mainKeyboard = await renderMainKeyboard();
    await ctx.reply('Выберите действие:', { reply_markup: mainKeyboard });
  }
  await next();
};
