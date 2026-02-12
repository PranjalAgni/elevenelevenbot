# elevenelevenbot

Send scheduled WhatsApp messages with Baileys and optionally get Telegram delivery notifications.

## Setup

1. Install dependencies:
   - `npm install`
2. Create your `.env` file:
   - `cp .env.example .env`
3. Required config:
   - `TARGET_NUMBER` (digits only, include country code)
4. Optional Telegram config:
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_CHAT_ID`

## Run

- `npm start`
- Scan the QR code in your terminal the first time.

## Notes

- Auth data is stored in `auth_info/` (ignored by git).
- Default schedule timezone is `Asia/Kolkata` and can be overridden via `SCHEDULE_TIMEZONE`.
- Telegram notifications are sent only when both `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` are configured.

## Architecture

The code is structured for extensibility:

- `src/config` handles environment parsing/validation.
- `src/whatsapp` owns WhatsApp socket lifecycle.
- `src/services` contains message templating, sending orchestration, and scheduling.
- `src/notifications` uses a notifier strategy/composition model so additional channels (email, Slack, webhooks) can be added with minimal changes.
