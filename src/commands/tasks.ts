import { Context } from 'grammy';
import { getTasksForUser } from '../services/taskService';

export const tasksCommand = async (ctx: Context) => {
  if (!ctx.from) {
    return ctx.reply('Unable to identify the user.');
  }

  const today = new Date().toISOString().split('T')[0];
  const tasks = await getTasksForUser(ctx.from.id, today);

  if (tasks.length === 0) {
    return ctx.reply('You have no tasks for today!');
  }

  const taskList = tasks.map((t, i) => `${i + 1}. ${t.text} [${t.completed ? '✅' : '❌'}]`).join('\n');
  ctx.reply(`Your tasks for today:\n${taskList}`);
};
