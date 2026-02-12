# elevenelevenbot

Send a WhatsApp message at 11:11 AM and 11:11 PM using the Baileys protocol.

## Setup

1. Install dependencies:
   - `npm install`
2. Create your `.env` file:
   - `cp .env.example .env`
3. Set `TARGET_NUMBER` to the recipient's number (digits only, include country code).
4. (Optional) Set `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` to receive delivery notifications in Telegram.

## Run

- `npm start`
- Scan the QR code in your terminal the first time.

## Notes

- Auth data is stored in `auth_info/` (ignored by git).
- Schedules use your local timezone.
- Telegram notifications are sent only when both `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` are configured.
