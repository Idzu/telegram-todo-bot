import { Keyboard } from 'grammy';

// Клавиатура
export const keyboardCommands = {
  tasks: '📋 Tasks',
  addTask: '➕ Add Task',
  settings: '⚙️ Settings',
} as const;

/**
 * Показ основной клавиатуры
 * @returns Клавиатура
 */
export const renderMainKeyboard = async () => {
  const mainKeyboard = new Keyboard().text(keyboardCommands.tasks).row().text(keyboardCommands.addTask).row().text(keyboardCommands.settings);

  return mainKeyboard;
};
