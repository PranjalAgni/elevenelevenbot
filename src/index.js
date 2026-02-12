const dotenv = require("dotenv");
const pino = require("pino");
const { buildConfig, validateConfig } = require("./config/env");
const { createNotifier } = require("./notifications/createNotifier");
const { MessageTemplateService } = require("./services/messageTemplateService");
const { SchedulerService } = require("./services/schedulerService");
const { WhatsAppMessageService } = require("./services/whatsAppMessageService");
const { WhatsAppSocketClient } = require("./whatsapp/socketClient");

dotenv.config();

const run = async () => {
  const config = buildConfig(process.env);
  validateConfig(config);

  const logger = pino({ level: config.logLevel });
  const notifier = createNotifier({ telegram: config.telegram, logger });
  const scheduler = new SchedulerService({
    timezone: config.scheduleTimezone,
    logger,
  });
  const messageTemplateService = new MessageTemplateService(config.messageTemplate);

  const targetJid = `${config.targetNumber}@s.whatsapp.net`;

  const socketClient = new WhatsAppSocketClient({
    authDir: config.authDir,
    logger,
    onReady: (sock) => {
      const messageService = new WhatsAppMessageService({
        sock,
        targetJid,
        targetNumber: config.targetNumber,
        logger,
        notifier,
        messageTemplateService,
      });

      scheduler.schedule(() => messageService.send());
    },
  });

  await socketClient.start();
};

run().catch((error) => {
  // pino isn't available if config bootstrapping fails.
  console.error("Failed to start bot", error);
  process.exit(1);
});
