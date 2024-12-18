import { Context, InlineKeyboard } from 'grammy';
import { getCategoriesForUser } from '../../services/categoryService';
import logger from '../../utils/logger';

/**
 * Формирует список категорий с кнопками
 * @param ctx
 * @param categories
 */
export const renderCategoriesWithKeyboard = async (ctx: Context, categories: { id: number; name: string }[]) => {
  if (categories.length === 0) {
    return ctx.reply('You have no categories.');
  }

  // Вывод категорий в формате название, кнопка удаления
  const keyboard = new InlineKeyboard();
  categories.forEach((category) => {
    keyboard.text(category.name, `noop`).text('❌', `delete_${category.id}`).row();
  });

  if (ctx.callbackQuery) {
    return ctx.editMessageText('Your categories:', { reply_markup: keyboard });
  } else {
    return ctx.reply('Your categories:', { reply_markup: keyboard });
  }
};

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
