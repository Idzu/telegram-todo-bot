import { Context, InlineKeyboard } from 'grammy';
import { addTask } from '../../services/taskService';
import { renderTaskKeyboard } from '../../keyboards/taskKeyboard';
import logger from '../../utils/logger';
import { taskDateState, taskState } from '../../state/taskState';
import { isValidDateFormat } from '../../utils/isValidDateFormat';
import { getCategoriesForUser } from '../../services/categoryService';

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

    const categories = await getCategoriesForUser(ctx.from.id);

    const inlineKeyboard = new InlineKeyboard();
    categories.forEach((category) => {
      inlineKeyboard.text(category.name, `noop`);
    });

    await ctx.reply('Введите текст задачи на сегодня и выберите категорию:', { reply_markup: inlineKeyboard });
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
    logger.error('Error handling tomorrow task input:', error);
    await ctx.reply('Произошла ошибка при добавлении задачи');
  }
};

export const addFutureTask = async (ctx: Context, status: string) => {
  try {
    if (!ctx.from) {
      return ctx.reply('Unable to identify the user.');
    }

    if (status != 'text') {
      await ctx.reply('Введите дату задачи в формате <YYYY-MM-DD>:');
      taskState.set(ctx.from.id, 'waitingFutureTaskDate');
    } else if (ctx.message?.text) {
      if (isValidDateFormat(ctx.message.text)) {
        taskDateState.set(ctx.from.id, ctx.message.text);

        await ctx.reply('Введите текст задачи:');
        taskState.set(ctx.from.id, 'waitingFutureTaskText');
      } else {
        await ctx.reply('Введите верный формат даты (YYYY-MM-DD)');
      }
    }
  } catch (error) {
    logger.error('Error in addFutureTask:', error);
    await ctx.reply('Произошла ошибка при добавлении задачи');
  }
};

export const handleFutureTaskInput = async (ctx: Context) => {
  try {
    if (!ctx.from?.id || !ctx.message?.text) return;

    const date = taskDateState.get(ctx.from.id);

    await addTask(ctx.from.id, ctx.message.text, date!);
    await ctx.reply('Задача добавлена!');

    taskState.delete(ctx.from.id);
    taskDateState.delete(ctx.from.id);
  } catch (error) {
    logger.error('Error handling future task input:', error);
    await ctx.reply('Произошла ошибка при добавлении задачи');
  }
};

export const addRecurringTask = async (ctx: Context) => {
  try {
    if (!ctx.from) {
      return ctx.reply('Unable to identify the user.');
    }

    await ctx.reply('Введите текст ежедневной задачи');
    taskState.set(ctx.from.id, 'waitingRecurringTask');
  } catch (error) {
    logger.error('Error in addRecurringTask:', error);
    await ctx.reply('Произошла ошибка при добавлении задачи');
  }
};

export const handleRecurringTaskInput = async (ctx: Context) => {
  try {
    if (!ctx.from?.id || !ctx.message?.text) return;

    await addTask(ctx.from.id, ctx.message.text, new Date(), true);
    await ctx.reply('Ежедневная задача добавлена!');
    taskState.delete(ctx.from.id);
  } catch (error) {
    logger.error('Error handling recurring task input:', error);
    await ctx.reply('Произошла ошибка при добавлении задачи');
  }
};
