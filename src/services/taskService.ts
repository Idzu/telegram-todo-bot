import Task from '../models/task';

export interface Tasks {
  id: number;
  userId: number;
  text: string;
  completed: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

/**
 * Добавление задачи
 * @param userId
 * @param text
 * @param date
 * @returns
 */
export const addTask = async (userId: number, text: string, date: Date | string, isRecurring: boolean = false) => {
  return await Task.create({
    userId,
    text,
    createdAt: date,
    isRecurring,
  });
};

/**
 * Получить все задачи пользователя
 * @param userId
 * @param date
 * @returns
 */
export const getTasksForUser = async (userId: number) => {
  return await Task.findAll({ where: { userId } });
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
