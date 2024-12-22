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

export const addTomorrowTask = async (ctx: Context) => {
  try {
    if (!ctx.from) {
      return ctx.reply('Unable to identify the user.');
    }
    await ctx.reply('Введите текст задачи на завтра:');
    taskState.set(ctx.from.id, 'waitingTomorrowTask');
  } catch (error) {
    logger.error('Error in addTomorrowTask:', error);
    await ctx.reply('Произошла ошибка при добавлении задачи');
  }
};

export const handleTomorrowTaskInput = async (ctx: Context) => {
  try {
    if (!ctx.from?.id || !ctx.message?.text) return;

    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    await addTask(ctx.from.id, ctx.message.text, tomorrow);
    await ctx.reply('Задача добавлена!');
    taskState.delete(ctx.from.id);
  } catch (error) {
    logger.error('Error handling today task input:', error);
    await ctx.reply('Произошла ошибка при добавлении задачи');
  }
};
