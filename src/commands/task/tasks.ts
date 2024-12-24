import { Context } from 'grammy';
import { getTasksForUser } from '../../services/taskService';
import { formatTaskList } from '../../utils/taskFormatter';

export const tasksCommand = async (ctx: Context) => {
  if (!ctx.from) {
    return ctx.reply('Unable to identify the user.');
  }

  const tasks = await getTasksForUser(ctx.from.id);
  if (tasks.length === 0) {
    return ctx.reply('You have no tasks!');
  }

  return ctx.reply(formatTaskList(tasks));
};
