import { Bot } from 'grammy';
import 'dotenv/config';
import logger from './utils/logger';
import db from './utils/db';

// Tasks
import { addTaskCommand } from './commands/task/addTask';
import { tasksCommand } from './commands/task/tasks';

// Category
import { addCategoryCommand } from './commands/category/addCategory';
import { listCategories } from './commands/category/categories';
import { deleteUserCategory } from './commands/category/deleteCategory';
import { editUserCategory, handleTextInputForEdit } from './commands/category/editCategory';
import { editCategoryState } from './utils/editCategoryState';

// Output text
import { outputStartText } from './commands/start';
import { outputSettingsText } from './commands/settings';
import { keyboardCommands } from './keyboards/mainKeyboard';
import { mainKeyboardMiddleware } from './middlewares/mainKeyobard';

// Settings bot
const bot = new Bot(process.env.BOT_TOKEN!);

// Middlewares
bot.use(mainKeyboardMiddleware);

// Register commands
// Basic command start
bot.command('start', outputStartText);
bot.hears(keyboardCommands.settings, outputSettingsText);
// Tasks
bot.hears(keyboardCommands.addTask, addTaskCommand);
bot.hears(keyboardCommands.tasks, tasksCommand);
// Category
bot.command('addcategory', addCategoryCommand);
bot.command('listcategory', listCategories);
bot.callbackQuery(/delete_\d+/, deleteUserCategory);
bot.callbackQuery(/edit_\d+/, editUserCategory);

// Обработка текстового ввода для редактирования категорий
bot.on('message', async (ctx) => {
  const userId = ctx.from?.id;
  // Если пользователь не в процессе редактирования, игнорируем его ввод
  if (!userId || !editCategoryState.has(userId)) {
    return;
  }

  // Если пользователь в процессе редактирования, обрабатываем ввод
  await handleTextInputForEdit(ctx);
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
