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

// Settings bot
const bot = new Bot(process.env.BOT_TOKEN!);

// Register commands
// Tasks
bot.command('addtask', addTaskCommand);
bot.command('tasks', tasksCommand);
// Category
bot.command('addcategory', addCategoryCommand);
bot.command('listcategory', listCategories);
bot.callbackQuery(/delete_\d+/, deleteUserCategory);

// Basic command start
bot.command('start', (ctx) => {
  logger.info(`User ${ctx.from?.id} started the bot`);
  ctx.reply('Welcome!');
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
