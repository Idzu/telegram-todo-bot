import { Context } from 'grammy';
import { deleteCategory, getCategoriesForUser } from '../../services/categoryService';
import { renderCategoriesWithKeyboard } from './categories';

/**
 * Удаление категории и обновление списка
 * @param ctx
 */
export const deleteUserCategory = async (ctx: Context) => {
  if (!ctx.callbackQuery?.data) {
    return ctx.answerCallbackQuery('Invalid action.');
  }

  // Извлекаем ID категории из callback-запроса
  const [action, categoryId] = ctx.callbackQuery.data.split('_');
  if (action !== 'delete' || !categoryId) {
    return ctx.answerCallbackQuery('Invalid category.');
  }

  // Удаляем категорию
  await deleteCategory(Number(categoryId));
  ctx.answerCallbackQuery('Category deleted.');

  // Обновляем список категорий в текущем сообщении
  const userId = ctx.from?.id;
  if (!userId) {
    return ctx.editMessageText('Unable to identify the user.');
  }
  const categories = await getCategoriesForUser(userId);
  await renderCategoriesWithKeyboard(ctx, categories);
};
