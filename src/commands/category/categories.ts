import { Context } from 'grammy';
import { getCategoriesForUser } from '../../services/categoryService';
import logger from '../../utils/logger';
import { renderCategoriesWithKeyboard } from '../../keyboards/categoryKeyboard';

/**
 * Вывод всех категорий с кнопками удаления
 * @param ctx
 */
export const listCategories = async (ctx: Context) => {
  try {
    if (!ctx.from) {
      return ctx.reply('Unable to identify the user.');
    }

    // Получение категорий и вызов функции для вывода
    const categories = await getCategoriesForUser(ctx.from.id);
    await renderCategoriesWithKeyboard(ctx, categories);
  } catch (err) {
    logger.error(`Error occurred: ${(err as Error).message}`);
    ctx.reply('An error occurred while fetching categories.');
  }
};
