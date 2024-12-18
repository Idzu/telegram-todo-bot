import { Context, InlineKeyboard } from 'grammy';

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
    keyboard.text(category.name, `noop`).text('✏️', `edit_${category.id}`).text('❌', `delete_${category.id}`).row();
  });

  if (ctx.callbackQuery) {
    return ctx.editMessageText('Your categories:', { reply_markup: keyboard });
  } else {
    return ctx.reply('Your categories:', { reply_markup: keyboard });
  }
};
