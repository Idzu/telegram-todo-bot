import { Context } from 'grammy';
import { taskState } from '../state/taskState';
import { editCategoryState } from '../state/editCategoryState';
import { handleTodayTaskInput, handleTomorrowTaskInput, handleFutureTaskInput, addFutureTask, handleRecurringTaskInput } from '../commands/task/addTask';
import { handleTextInputForEdit } from '../commands/category/editCategory';
import logger from '../utils/logger';
import { notificationState } from '../state/notificationState';

export const handleMessage = async (ctx: Context) => {
  const userId = ctx.from?.id;
  if (!userId) return;

  // Проверяем состояния
  const taskStatus = taskState.get(userId);
  const categoryStatus = editCategoryState.has(userId);
  const notificationStatus = notificationState.get(userId);

  // Если идет процесс изменения уведомлений, пропускаем обработку
  if (notificationStatus) return;

  try {
    if (!ctx.message?.text) return;

    // Обработка задачи на сегодня
    if (taskStatus === 'waitingTodayTask') {
      await handleTodayTaskInput(ctx);
      return;
    }
    // Обработка задачи на завтра
    if (taskStatus === 'waitingTomorrowTask') {
      await handleTomorrowTaskInput(ctx);
      return;
    }
    // Обработка задачи на определенное время
    if (taskStatus === 'waitingFutureTaskDate') {
      await addFutureTask(ctx, 'text');
      return;
    }
    if (taskStatus === 'waitingFutureTaskText') {
      await handleFutureTaskInput(ctx);
      return;
    }

    // Добавляем обработчик для повторяющихся задач
    if (taskStatus === 'waitingRecurringTask') {
      await handleRecurringTaskInput(ctx);
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
