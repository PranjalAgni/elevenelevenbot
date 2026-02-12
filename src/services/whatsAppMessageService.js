class WhatsAppMessageService {
  constructor({ sock, targetJid, targetNumber, logger, notifier, messageTemplateService }) {
    this.sock = sock;
    this.targetJid = targetJid;
    this.targetNumber = targetNumber;
    this.logger = logger;
    this.notifier = notifier;
    this.messageTemplateService = messageTemplateService;
  }

  async send() {
    const messageText = this.messageTemplateService.buildNow();

    try {
      await this.sock.sendMessage(this.targetJid, { text: messageText });
      this.logger.info({ to: this.targetJid }, "Message sent");

      await this.notifier.notify({
        channel: "whatsapp",
        status: "success",
        targetNumber: this.targetNumber,
        messageText,
      });
    } catch (error) {
      this.logger.error({ error }, "Failed to send message");

      await this.notifier.notify({
        channel: "whatsapp",
        status: "failed",
        targetNumber: this.targetNumber,
        messageText,
        errorMessage: error?.message,
      });
    }
  }
}

module.exports = {
  WhatsAppMessageService,
};
