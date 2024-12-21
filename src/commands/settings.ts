import { Context } from 'grammy';

/**
 * Вывод при вызове настроек
 * @param ctx
 * @returns
 */
export const outputSettingsText = async (ctx: Context) => {
  return ctx.reply('Your settings');
};
