import { Context } from 'grammy';
import { getTasksForUser } from '../../services/taskService';
import { formatDate } from '../../utils/dateFormatter';
import Tasks from '../../models/task';

export const tasksCommand = async (ctx: Context) => {
  if (!ctx.from) {
    return ctx.reply('Unable to identify the user.');
  }

  const tasks: Tasks[] = await getTasksForUser(ctx.from.id);
  if (tasks.length === 0) {
    return ctx.reply('You have no tasks!');
  }

  // Получаем начало и конец текущего дня
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  const todayTasks = tasks.filter((task) => {
    const taskDate = new Date(task.createdAt);
    return taskDate >= startOfDay && taskDate <= endOfDay;
  });

  const futureTasks = tasks.filter((task) => {
    const taskDate = new Date(task.createdAt);
    return taskDate > endOfDay;
  });

  const overdueTasks = tasks.filter((task) => {
    const taskDate = new Date(task.createdAt);
    return taskDate < startOfDay && !task.completed;
  });

  const taskListToday = todayTasks.length ? todayTasks.map((t, i) => `${i + 1}. ${t.text} [${t.completed ? '✅' : '❌'}]`).join('\n') : 'No tasks for today.';

  const taskListFuture = futureTasks.length
    ? futureTasks.map((t, i) => `${i + 1}. ${formatDate(t.createdAt)} ${t.text} [${t.completed ? '✅' : '❌'}]`).join('\n')
    : 'No future tasks.';

  const taskListOverdue = overdueTasks.length
    ? overdueTasks.map((t, i) => `${i + 1}. ${formatDate(t.createdAt)} ${t.text} [${t.completed ? '✅' : '❌'}]`).join('\n')
    : 'No overdue tasks.';

  const message = `
Your tasks:

Задачи на сегодня:
${taskListToday}

Задачи на будущее:
${taskListFuture}

Просроченные задачи:
${taskListOverdue}
`;

  return ctx.reply(message);
};
