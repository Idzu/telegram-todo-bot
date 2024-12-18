import { Context } from 'grammy';
import { addTask } from '../../services/taskService';

/**
 * Добавление задачи, в формате text, date, userID
 * @param ctx
 * @returns
 */
export const addTaskCommand = async (ctx: Context) => {
  if (!ctx.from) {
    return ctx.reply('Unable to identify the user.');
  }

  if (typeof ctx.match === 'string') {
    // Вырезать текст и дату из строки
    const [text, date] = ctx.match.split(',').map((s) => s.trim()) || [];
    // Проверка на существование переменных
    if (!text || !date) {
      return ctx.reply('Usage: /addtask <text>, <YYYY-MM-DD>');
    }

    // Добавление задачи в БД
    await addTask(ctx.from.id, text, date);
    ctx.reply('Task added!');
  } else {
    return ctx.reply('Invalid command format. Please use: /addtask <text>, <YYYY-MM-DD>');
  }
};
