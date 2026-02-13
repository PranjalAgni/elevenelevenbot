# elevenelevenbot

Send scheduled WhatsApp messages with Baileys and optionally receive Telegram notifications for delivery success/failure.

## Prerequisites

Before running the app, make sure you have:

- Node.js 18+ (recommended: latest LTS)
- npm
- A WhatsApp account available for QR login
- (Optional) A Telegram account if you want notifications

## Installation

1. Clone the repository.
2. Install dependencies:

```bash
npm install
```

## Environment Setup

1. Copy the sample environment file:

```bash
cp .env.example .env
```

2. Open `.env` and configure values.

### Required environment variables

- `TARGET_NUMBER`  
  Recipient WhatsApp number in **digits only** format, including country code.  
  Example: `919876543210`

### Optional environment variables

- `MESSAGE_TEXT`  
  Message template. Supports `{time}` token.  
  Example: `11:11 time! ({time})`

- `LOG_LEVEL`  
  Logger level (`info`, `debug`, etc.). Default: `info`

- `AUTH_DIR`  
  Location where WhatsApp auth session files are stored. Default: `./auth_info`

- `SCHEDULE_TIMEZONE`  
  Timezone used for cron schedules. Default: `Asia/Kolkata`

- `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`  
  Configure both to enable Telegram notifications.

## WhatsApp Integration Setup

This app uses Baileys QR-based authentication.

1. Start the app once:

```bash
npm start
```

2. A QR code will be printed in the terminal.
3. Open WhatsApp on your phone:
   - **Settings** → **Linked Devices** → **Link a Device**
4. Scan the QR code from terminal.
5. After successful login, session data is saved under `AUTH_DIR` so you don't need to scan every restart (unless session expires or files are removed).

## Telegram Setup (Optional Notifications)

Telegram notifications are sent after every WhatsApp send attempt:
- ✅ sent successfully
- ❌ failed to send

### 1) Create a Telegram bot

1. Open Telegram and start chat with `@BotFather`
2. Run `/newbot`
3. Choose bot name and username
4. Copy the bot token and set it as `TELEGRAM_BOT_TOKEN`

### 2) Get your chat ID

You can use either a personal chat ID or group chat ID.

#### Personal chat ID

1. Start a chat with your bot and send any message (e.g. "hi")
2. Open in browser:

```text
https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates
```

3. In the JSON response, find `message.chat.id` and set it as `TELEGRAM_CHAT_ID`

#### Group chat ID (optional)

1. Add the bot to your group
2. Send a message in the group
3. Call `getUpdates` URL above
4. Use the group's `chat.id` (often starts with `-100...`) as `TELEGRAM_CHAT_ID`

## Default Message Schedule

The app schedules message sending at:

- 11:11 AM
- 11:11 PM
- 1:11 PM
- 1:11 AM

All times use `SCHEDULE_TIMEZONE`.

## Running Locally

```bash
npm start
```

## Running in Production with PM2

### 1) Install PM2 globally

```bash
npm install -g pm2
```

### 2) Start the app with PM2

```bash
pm2 start src/index.js --name elevenelevenbot
```

### 3) Verify process and logs

```bash
pm2 status
pm2 logs elevenelevenbot
```

### 4) Auto-start on server reboot

```bash
pm2 startup
pm2 save
```

Run the command printed by `pm2 startup` (it usually needs sudo), then run `pm2 save`.

### 5) Useful PM2 commands

```bash
pm2 restart elevenelevenbot
pm2 stop elevenelevenbot
pm2 delete elevenelevenbot
```

## Recommended Production Notes

- Keep `.env` and `auth_info` persistent and backed up.
- Do not commit `.env` or auth files to git.
- If WhatsApp gets logged out, clear auth folder and re-link via QR.
- Keep server timezone and `SCHEDULE_TIMEZONE` aligned with your expected send times.

## Project Structure

- `src/config` → environment parsing and validation
- `src/whatsapp` → WhatsApp socket lifecycle
- `src/services` → scheduling, message templating, orchestration
- `src/notifications` → pluggable notifier architecture (Telegram + future channels)
