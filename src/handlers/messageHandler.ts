import { Context } from 'grammy';
import { taskState } from '../state/taskState';
import { editCategoryState } from '../state/editCategoryState';
import { handleTodayTaskInput, handleTomorrowTaskInput, handleFutureTaskInput, addFutureTask } from '../commands/task/addTask';
import { handleTextInputForEdit } from '../commands/category/editCategory';
import logger from '../utils/logger';

export const handleMessage = async (ctx: Context) => {
  const userId = ctx.from?.id;
  if (!userId) return;

  // Проверяем состояния
  const taskStatus = taskState.get(userId);
  const categoryStatus = editCategoryState.has(userId);

  try {
    // Обработка задачи на сегодня
    if (taskStatus === 'waitingTodayTask' && ctx.message?.text) {
      await handleTodayTaskInput(ctx);
      return;
    }
    // Обработка задачи на завтра
    if (taskStatus === 'waitingTomorrowTask' && ctx.message?.text) {
      await handleTomorrowTaskInput(ctx);
      return;
    }
    // Обработка задачи на определенное время
    if (taskStatus === 'waitingFutureTaskDate' && ctx.message?.text) {
      await addFutureTask(ctx, 'text');
      return;
    }
    if (taskStatus === 'waitingFutureTaskText' && ctx.message?.text) {
      await handleFutureTaskInput(ctx);
      return;
    }

    // Обработка состояния категории
    if (categoryStatus) {
      await handleTextInputForEdit(ctx);
      return;
    }
  } catch (error) {
    logger.error('Error in message handler:', error);
  }
};
