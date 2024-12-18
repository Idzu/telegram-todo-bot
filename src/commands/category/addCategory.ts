import { Context } from 'grammy';
import { addCategory } from '../../services/categoryService';

/**
 * Добавление категории, в формате text, userID
 * @param ctx
 * @returns
 */
export const addCategoryCommand = async (ctx: Context) => {
  if (!ctx.from) {
    return ctx.reply('Unable to identify the user');
  }

  if (typeof ctx.match === 'string') {
    if (!ctx.match) return ctx.reply('Usage: /addcategory <text>');

    await addCategory(ctx.from.id, ctx.match);
    ctx.reply('Added category');
  } else {
    return ctx.reply('Invalid command format. Please use: /addcategory');
  }
};
