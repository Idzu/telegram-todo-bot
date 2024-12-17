import { Bot } from 'grammy';
import 'dotenv/config';
import logger from './utils/logger';
import db from './utils/db';

import { addTaskCommand } from './commands/addTask';
import { tasksCommand } from './commands/tasks';

// Settings bot
const bot = new Bot(process.env.BOT_TOKEN!);

// Register commands
bot.command('addtask', addTaskCommand);
bot.command('tasks', tasksCommand);

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
