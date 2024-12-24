import { formatDate } from './dateFormatter';
import Task from '../models/task';

/**
 * Вывод всех задач в отформатированном ввиде
 * @param tasks
 * @returns
 */
export const formatTaskList = (tasks: Task[]) => {
  // Получаем начало и конец текущего дня
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  const todayTasks = tasks.filter((task) => {
    const taskDate = new Date(task.createdAt);
    return (taskDate >= startOfDay && taskDate <= endOfDay) || task.isRecurring;
  });

  const futureTasks = tasks.filter((task) => {
    const taskDate = new Date(task.createdAt);
    return taskDate > endOfDay;
  });

  const overdueTasks = tasks.filter((task) => {
    const taskDate = new Date(task.createdAt);
    return taskDate < startOfDay && !task.completed && !task.isRecurring;
  });

  const taskListToday = todayTasks.length ? todayTasks.map((t, i) => `${i + 1}. ${t.text} [${t.completed ? '✅' : '❌'}]`).join('\n') : 'No tasks for today.';

  const taskListFuture = futureTasks.length
    ? futureTasks.map((t, i) => `${i + 1}. ${formatDate(t.createdAt)} ${t.text} [${t.completed ? '✅' : '❌'}]`).join('\n')
    : 'No future tasks.';

  const taskListOverdue = overdueTasks.length
    ? overdueTasks.map((t, i) => `${i + 1}. ${formatDate(t.createdAt)} ${t.text} [${t.completed ? '✅' : '❌'}]`).join('\n')
    : 'No overdue tasks.';

  return `Your tasks:

Задачи на сегодня:
${taskListToday}

Задачи на будущее:
${taskListFuture}

Просроченные задачи:
${taskListOverdue}`;
};
