import { Context } from 'grammy';
import { addTask } from '../../services/taskService';
import { renderTaskKeyboard } from '../../keyboards/taskKeyboard';
import logger from '../../utils/logger';
import { taskState } from '../../state/taskState';

/**
 * Добавление задачи, в формате text, date, userID
 * @param ctx
 * @returns
 */
export const addTaskCommand = async (ctx: Context) => {
  try {
    const keyboard = await renderTaskKeyboard();
    await ctx.reply('Выберите когда выполнить задачу:', {
      reply_markup: keyboard,
    });
  } catch (error) {
    logger.error('Error in addTaskCommand:', error);
    await ctx.reply('Произошла ошибка при добавлении задачи');
  }
};

export const addTodayTask = async (ctx: Context) => {
  try {
    if (!ctx.from) {
      return ctx.reply('Unable to identify the user.');
    }
    await ctx.reply('Введите текст задачи на сегодня:');
    taskState.set(ctx.from.id, 'waitingTodayTask');
  } catch (error) {
    logger.error('Error in addTodayTask:', error);
    await ctx.reply('Произошла ошибка при добавлении задачи');
  }
};

export const handleTodayTaskInput = async (ctx: Context) => {
  try {
    if (!ctx.from?.id || !ctx.message?.text) return;

    const todayDate = new Date();
    await addTask(ctx.from.id, ctx.message.text, todayDate);
    await ctx.reply('Задача добавлена!');
    taskState.delete(ctx.from.id);
  } catch (error) {
    logger.error('Error handling today task input:', error);
    await ctx.reply('Произошла ошибка при добавлении задачи');
  }
};
