import { Keyboard } from 'grammy';

export const taskKeyboardsComands = {
  addTodayTask: 'Add a task for today',
  addTomorrowTask: 'Add a task for tomorrow',
  addFutureTask: 'Add a task for the future',
  addRecurringTask: 'Add daily recurring task',
} as const;

/**
 * Клавиатуры для задач
 * @returns
 */
export const renderTaskKeyboard = async () => {
  const taskKeyboard = new Keyboard()
    .text(taskKeyboardsComands.addTodayTask)
    .row()
    .text(taskKeyboardsComands.addTomorrowTask)
    .row()
    .text(taskKeyboardsComands.addFutureTask)
    .row()
    .text(taskKeyboardsComands.back);

  return taskKeyboard;
};
