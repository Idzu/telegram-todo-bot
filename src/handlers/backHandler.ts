import { Context } from 'grammy';
import { renderMainKeyboard } from '../keyboards/mainKeyboard';

export const handleBackButton = async (ctx: Context) => {
  const keyboard = await renderMainKeyboard();
  return ctx.reply('Выберите команды:', { reply_markup: keyboard });
};
