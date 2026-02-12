const path = require("path");
const cron = require("node-cron");
const dotenv = require("dotenv");
const pino = require("pino");
const qrcode = require("qrcode-terminal");
const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason,
} = require("baileys");

dotenv.config();

const logger = pino({ level: process.env.LOG_LEVEL || "info" });
const AUTH_DIR = process.env.AUTH_DIR || path.join(__dirname, "..", "auth_info");
const TARGET_NUMBER = (process.env.TARGET_NUMBER || "").replace(/\D/g, "");
const MESSAGE_TEXT = process.env.MESSAGE_TEXT || "11:11 time!";
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "";

if (!TARGET_NUMBER) {
  logger.error("Missing TARGET_NUMBER in .env (digits only).");
  process.exit(1);
}

const targetJid = `${TARGET_NUMBER}@s.whatsapp.net`;

const formatTime12h = (date) => {
  const hours24 = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const hours12 = ((hours24 + 11) % 12) + 1;
  return `${hours12}:${minutes}`;
};

const buildMessageText = () => {
  const timeStr = formatTime12h(new Date());
  return MESSAGE_TEXT.replace(/\{time\}/g, timeStr);
};

const sendTelegramNotification = async (text) => {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    return;
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text,
        }),
      }
    );

    if (!response.ok) {
      const responseText = await response.text();
      logger.warn(
        { status: response.status, responseText },
        "Failed to send Telegram notification"
      );
    }
  } catch (error) {
    logger.warn({ error }, "Failed to send Telegram notification");
  }
};

const sendMessage = async (sock) => {
  const text = buildMessageText();
  try {
    await sock.sendMessage(targetJid, { text });
    logger.info({ to: targetJid }, "Message sent");
    await sendTelegramNotification(
      `✅ WhatsApp message sent to ${TARGET_NUMBER}:\n${text}`
    );
  } catch (error) {
    logger.error({ error }, "Failed to send message");
    await sendTelegramNotification(
      `❌ WhatsApp message failed for ${TARGET_NUMBER}:\n${error?.message || "Unknown error"}`
    );
  }
};

let isScheduled = false;

const startSocket = async () => {
  const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state,
    logger,
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;
    if (update.qr) {
      logger.info("Scan the QR below to authenticate.");
      qrcode.generate(update.qr, { small: true });
    }
    if (connection === "close") {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
      logger.warn(
        { statusCode, shouldReconnect },
        "Connection closed, reconnecting"
      );
      if (shouldReconnect) {
        startSocket();
      } else {
        logger.error("Logged out. Delete auth_info and re-run to re-auth.");
      }
    } else if (connection === "open") {
      logger.info("WhatsApp connection opened");
      // Ensure schedules start only once after successful login.
      if (!isScheduled) {
        scheduleMessages(sock);
        isScheduled = true;
      }
    }
  });
};

const scheduleMessages = (sock) => {
  const tz = "Asia/Kolkata";
  // 11:11 AM local time
  cron.schedule("11 11 * * *", () => sendMessage(sock), { timezone: tz });
  // 11:11 PM local time (23:11)
  cron.schedule("11 23 * * *", () => sendMessage(sock), { timezone: tz });
  // 1:11 PM local time (13:11)
  cron.schedule("11 13 * * *", () => sendMessage(sock), { timezone: tz });
  // 1:11 AM local time (01:11)
  cron.schedule("11 01 * * *", () => sendMessage(sock), { timezone: tz });
  logger.info({ timezone: tz }, "Scheduled messages for 11:11 AM, 11:11 PM, 1:11 PM, and 1:11 AM");
};

startSocket().catch((error) => {
  logger.error({ error }, "Failed to start Baileys socket");
  process.exit(1);
});
