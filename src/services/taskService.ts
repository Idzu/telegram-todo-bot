import Task from '../models/task';

export const addTask = async (userId: number, text: string, date: string) => {
  return await Task.create({ userId, text, date });
};

export const getTasksForUser = async (userId: number, date: string) => {
  return await Task.findAll({ where: { userId, date } });
};

export const markTaskAsCompleted = async (taskId: number) => {
  const task = await Task.findByPk(taskId);
  if (task) {
    task.completed = true;
    await task.save();
  }
};
