import { Bot } from 'grammy';
import 'dotenv/config';
import logger from './utils/logger';

// Settings bot
const bot = new Bot(process.env.BOT_TOKEN!);

// Basic command start
bot.command('start', (ctx) => {
  logger.info(`User ${ctx.from?.id} started the bot`);
  ctx.reply('Welcome!');
});

// Bot error message
bot.catch((err) => {
  logger.error(`Error occurred: ${err.message}`);
});

// Start bot
bot.start();
logger.info('Bot is running...');
