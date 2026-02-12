const path = require("path");

const buildConfig = (env) => ({
  logLevel: env.LOG_LEVEL || "info",
  authDir: env.AUTH_DIR || path.join(__dirname, "..", "..", "auth_info"),
  targetNumber: (env.TARGET_NUMBER || "").replace(/\D/g, ""),
  messageTemplate: env.MESSAGE_TEXT || "11:11 time!",
  scheduleTimezone: env.SCHEDULE_TIMEZONE || "Asia/Kolkata",
  telegram: {
    botToken: env.TELEGRAM_BOT_TOKEN || "",
    chatId: env.TELEGRAM_CHAT_ID || "",
  },
});

const validateConfig = (config) => {
  if (!config.targetNumber) {
    throw new Error("Missing TARGET_NUMBER in .env (digits only).");
  }
};

module.exports = {
  buildConfig,
  validateConfig,
};
