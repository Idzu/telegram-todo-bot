import { Context } from 'grammy';
import logger from '../../utils/logger';
import { editCategory, getCategoriesForUser } from '../../services/categoryService';
import { editCategoryState } from '../../utils/editCategoryState';
import { renderCategoriesWithKeyboard } from '../../keyboards/categoryKeyboard';

/**
 * Обработка команды редактирования категории
 * @param ctx
 */
export const editUserCategory = async (ctx: Context) => {
  try {
    if (!ctx.callbackQuery?.data) {
      return ctx.answerCallbackQuery('Invalid action.');
    }

    const [action, categoryId] = ctx.callbackQuery.data.split('_');
    if (action !== 'edit' || !categoryId) {
      return ctx.answerCallbackQuery('Invalid category.');
    }

    const userId = ctx.from?.id;
    if (!userId) {
      return ctx.answerCallbackQuery('Unable to identify the user.');
    }

    // Сохраняем ID категории, которую пользователь хочет редактировать
    editCategoryState.set(userId, Number(categoryId));

    // Уведомляем пользователя о необходимости ввода нового имени
    ctx.answerCallbackQuery();
    ctx.reply('Please enter the new name for the category.');
  } catch (err) {
    logger.error(`Error occurred: ${(err as Error).message}`);
    ctx.reply('An error occurred while initiating category edit.');
  }
};

/**
 * Обработка текстового ввода для редактирования категории
 * @param ctx
 */
export const handleTextInputForEdit = async (ctx: Context) => {
  try {
    const userId = ctx.from?.id;
    if (!userId) {
      return ctx.reply('Unable to identify the user.');
    }

    // Проверяем, есть ли ожидаемая категория для редактирования
    const categoryId = editCategoryState.get(userId);
    if (!categoryId) {
      return ctx.reply('No category is being edited currently.');
    }

    const newName = ctx.message?.text?.trim();
    if (!newName) {
      return ctx.reply('The new name cannot be empty.');
    }

    // Обновляем категорию в базе данных
    await editCategory(categoryId, newName);

    // Удаляем состояние редактирования
    editCategoryState.delete(userId);

    // Обновляем список категорий
    const categories = await getCategoriesForUser(userId);
    await renderCategoriesWithKeyboard(ctx, categories);
  } catch (err) {
    logger.error(`Error occurred: ${(err as Error).message}`);
    ctx.reply('An error occurred while editing the category.');
  }
};
