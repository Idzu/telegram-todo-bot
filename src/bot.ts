import { Bot, Context } from 'grammy';
import 'dotenv/config';
import logger from './utils/logger';
import db from './utils/db';
import { setupNotifications } from './services/notificationService';
import { notificationState } from './state/notificationState';

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
import { handleNotificationTimeUpdate } from './commands/settings';

// Settings bot
const bot = new Bot(process.env.BOT_TOKEN!);

// Настраиваем уведомления
setupNotifications(bot);

// Register commands
bot.command('start', outputStartText);
bot.hears(keyboardCommands.settings, outputSettingsText);

// Обработка callback-запросов для настроек
bot.callbackQuery('change_notifications', async (ctx) => {
  if (!ctx.from) return;

  notificationState.set(ctx.from.id, true);
  await ctx.reply('Введите время для уведомлений в формате HH:MM через запятую\nНапример: 09:00, 12:00, 15:00, 17:00');
  await ctx.answerCallbackQuery();
});

// Tasks commands
bot.hears(keyboardCommands.addTask, addTaskCommand);
bot.hears(taskKeyboardsComands.addTodayTask, addTodayTask);
bot.hears(taskKeyboardsComands.addTomorrowTask, addTomorrowTask);
bot.hears(taskKeyboardsComands.addFutureTask, (ctx) => addFutureTask(ctx, ''));
bot.hears(taskKeyboardsComands.addRecurringTask, addRecurringTask);
bot.hears(taskKeyboardsComands.back, handleBackButton);
bot.hears(keyboardCommands.tasks, tasksCommand);

// Category commands
bot.command('addcategory', addCategoryCommand);
bot.command('listcategory', listCategories);
bot.callbackQuery(/delete_\d+/, deleteUserCategory);
bot.callbackQuery(/edit_\d+/, editUserCategory);

// Общий обработчик сообщений (должен быть последним)
bot.on('message', async (ctx) => {
  handleMessage(ctx);

  if (ctx.message.text && notificationState.get(ctx.from.id) && ctx.message.text.includes(':')) {
    try {
      await handleNotificationTimeUpdate(ctx, bot);
      notificationState.delete(ctx.from.id);
      logger.info(`Successfully updated notifications for user ${ctx.from.id}`);
    } catch (error) {
      logger.error('Error in notification update:', error);
      await ctx.reply('Произошла ошибка при обновлении времени уведомлений');
    }
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
