import { Bot } from 'grammy';
import 'dotenv/config';
import logger from './utils/logger';
import db from './utils/db';

// Tasks
import { addTaskCommand, addTodayTask, addTomorrowTask, handleTodayTaskInput, handleTomorrowTaskInput } from './commands/task/addTask';
import { tasksCommand } from './commands/task/tasks';

// Category
import { addCategoryCommand } from './commands/category/addCategory';
import { listCategories } from './commands/category/categories';
import { deleteUserCategory } from './commands/category/deleteCategory';
import { editUserCategory, handleTextInputForEdit } from './commands/category/editCategory';
import { editCategoryState } from './state/editCategoryState';

// Output text
import { outputStartText } from './commands/start';
import { outputSettingsText } from './commands/settings';
import { keyboardCommands } from './keyboards/mainKeyboard';
import { taskKeyboardsComands } from './keyboards/taskKeyboard';
import { taskState } from './state/taskState';

// Settings bot
const bot = new Bot(process.env.BOT_TOKEN!);

// Register commands
// Basic command start
bot.command('start', outputStartText);
bot.hears(keyboardCommands.settings, outputSettingsText);
// Tasks
bot.hears(keyboardCommands.addTask, addTaskCommand);
bot.hears(taskKeyboardsComands.addTodayTask, addTodayTask);
bot.hears(taskKeyboardsComands.addTomorrowTask, addTomorrowTask);
bot.hears(keyboardCommands.tasks, tasksCommand);
// Category
bot.command('addcategory', addCategoryCommand);
bot.command('listcategory', listCategories);
bot.callbackQuery(/delete_\d+/, deleteUserCategory);
bot.callbackQuery(/edit_\d+/, editUserCategory);

// Обработка текстового ввода
bot.on('message', async (ctx) => {
  const userId = ctx.from?.id;
  if (!userId) return;

  // Проверяем состояния
  const taskStatus = taskState.get(userId);
  const categoryStatus = editCategoryState.has(userId);

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

  // Обработка состояния категории
  if (categoryStatus) {
    await handleTextInputForEdit(ctx);
    return;
  }
});

// Bot error message
bot.catch((err) => {
  logger.error(`Error occurred: ${err.message}`);
});

await db.sync({ alter: true }).then(async () => {
  logger.info(`DATABASE loaded`);
});

// Start bot
bot.start();
logger.info('Bot is running...');
