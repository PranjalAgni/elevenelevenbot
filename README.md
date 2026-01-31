# elevenelevenbot

Send a WhatsApp message at 11:11 AM and 11:11 PM using the Baileys protocol.

## Setup

1. Install dependencies:
   - `npm install`
2. Create your `.env` file:
   - `cp .env.example .env`
3. Set `TARGET_NUMBER` to the recipient's number (digits only, include country code).

## Run

- `npm start`
- Scan the QR code in your terminal the first time.

## Notes

- Auth data is stored in `auth_info/` (ignored by git).
- Schedules use your local timezone.
