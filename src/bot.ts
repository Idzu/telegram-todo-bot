import { Bot, Context } from 'grammy';
import 'dotenv/config';
import logger from './utils/logger';
import db from './utils/db';

// Tasks
import { addFutureTask, addTaskCommand, addTodayTask, addTomorrowTask, addRecurringTask } from './commands/task/addTask';
import { tasksCommand } from './commands/task/tasks';

// Category
import { addCategoryCommand } from './commands/category/addCategory';
import { listCategories } from './commands/category/categories';
import { deleteUserCategory } from './commands/category/deleteCategory';
import { editUserCategory } from './commands/category/editCategory';

// Output text
import { outputStartText } from './commands/start';
import { outputSettingsText } from './commands/settings';
import { keyboardCommands } from './keyboards/mainKeyboard';
import { taskKeyboardsComands } from './keyboards/taskKeyboard';
import { handleMessage } from './handlers/messageHandler';
import { handleBackButton } from './handlers/backHandler';

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
bot.hears(taskKeyboardsComands.addFutureTask, (ctx) => addFutureTask(ctx, ''));
bot.hears(taskKeyboardsComands.addRecurringTask, addRecurringTask);
bot.hears(taskKeyboardsComands.back, handleBackButton);
bot.hears(keyboardCommands.tasks, tasksCommand);
// Category
bot.command('addcategory', addCategoryCommand);
bot.command('listcategory', listCategories);
bot.callbackQuery(/delete_\d+/, deleteUserCategory);
bot.callbackQuery(/edit_\d+/, editUserCategory);

// Обработка текстового ввода
bot.on('message', handleMessage);

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
