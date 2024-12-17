# Telegram TODO Bot

A simple Telegram bot for managing daily tasks using the GrammyJS framework.

## Features
- Add tasks for the next day.
- Receive daily task reminders (default at 9:00 UTC+4).
- Mark tasks as completed directly via Telegram.
- Customizable notification times.

## Project Structure
- **src/**: Source code.
  - `bot.ts`: Main bot entry point.
  - `commands/`: Command logic (e.g., `/start`, task management).
  - `middlewares/`: Middlewares for session and logging.
  - `services/`: Core services for tasks and reminders.
  - `utils/`: Utility functions and configuration.
  - `keyboards/`: Inline and reply keyboards for user interaction.
- **tests/**: Unit tests for services and bot logic.
- **.env**: Environment variables for bot configuration.

## Setup
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure `.env` with your Telegram Bot API token:
   ```env
   BOT_TOKEN=your-telegram-bot-token
   ```
4. Start the bot:
   ```bash
   npm run start
   ```

## Development
- Run the bot in development mode:
  ```bash
  npm run dev
  ```
- Run tests:
  ```bash
  npm test
  ```