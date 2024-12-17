import { Context } from 'grammy';
import { addTask } from '../services/taskService';

export const addTaskCommand = async (ctx: Context) => {
  if (!ctx.from) {
    return ctx.reply('Unable to identify the user.');
  }

  if (typeof ctx.match === 'string') {
    const [text, date] = ctx.match.split(',').map((s) => s.trim()) || [];
    if (!text || !date) {
      return ctx.reply('Usage: /addtask <text>, <YYYY-MM-DD>');
    }
    await addTask(ctx.from.id, text, date);
    ctx.reply('Task added!');
  } else {
    return ctx.reply('Invalid command format. Please use: /addtask <text>, <YYYY-MM-DD>');
  }
};
