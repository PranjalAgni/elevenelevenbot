const { Notifier } = require("./notifier");

class TelegramNotifier extends Notifier {
  constructor({ botToken, chatId, logger }) {
    super();
    this.botToken = botToken;
    this.chatId = chatId;
    this.logger = logger;
  }

  isConfigured() {
    return Boolean(this.botToken && this.chatId);
  }

  buildNotificationText(event) {
    if (event.status === "success") {
      return `✅ WhatsApp message sent to ${event.targetNumber}:\n${event.messageText}`;
    }

    return `❌ WhatsApp message failed for ${event.targetNumber}:\n${event.errorMessage || "Unknown error"}`;
  }

  async notify(event) {
    if (!this.isConfigured()) {
      return;
    }

    const response = await fetch(
      `https://api.telegram.org/bot${this.botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: this.chatId,
          text: this.buildNotificationText(event),
        }),
      }
    );

    if (!response.ok) {
      const responseText = await response.text();
      this.logger.warn(
        { status: response.status, responseText },
        "Failed to send Telegram notification"
      );
    }
  }
}

module.exports = {
  TelegramNotifier,
};
