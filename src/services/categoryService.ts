import Category from '../models/category';

/**
 * Добавить категорию
 * @param userId
 * @param name
 * @returns
 */
export const addCategory = async (userId: number, name: string) => {
  return await Category.create({ name, userId });
};

/**
 * Получить категории пользователя
 * @param userId
 * @returns
 */
export const getCategoriesForUser = async (userId: number) => {
  return await Category.findAll({ where: { userId } });
};

/**
 * Удалить категорию
 * @param userId
 * @param name
 * @returns
 */
export const deleteCategory = async (id: number) => {
  return await Category.destroy({ where: { id } });
};

/**
 * Редактировать категорию
 * @param userId
 * @param name
 * @returns
 */
export const editCategory = async (id: number, name: string) => {
  return await Category.update({ name }, { where: { id } });
};
