import Task from '../models/task';

/**
 * Добавление задачи
 * @param userId
 * @param text
 * @param date
 * @returns
 */
export const addTask = async (userId: number, text: string, date: string) => {
  return await Task.create({ userId, text, date });
};

/**
 * Получить все задачи пользователя
 * @param userId
 * @param date
 * @returns
 */
export const getTasksForUser = async (userId: number, date: string) => {
  return await Task.findAll({ where: { userId, date } });
};

/**
 * Пометить задачу как выполненную
 * @param taskId
 * @returns
 */
export const markTaskAsCompleted = async (taskId: number) => {
  const task = await Task.findByPk(taskId);
  if (task) {
    task.completed = true;
    await task.save();
  }
};
