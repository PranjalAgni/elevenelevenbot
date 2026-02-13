const { CompositeNotifier } = require("./compositeNotifier");
const { NoopNotifier } = require("./noopNotifier");
const { TelegramNotifier } = require("./telegramNotifier");

const createNotifier = ({ telegram, logger }) => {
  const telegramNotifier = new TelegramNotifier({
    botToken: telegram.botToken,
    chatId: telegram.chatId,
    logger,
  });

  const providers = [telegramNotifier].filter((provider) => provider.isConfigured());

  if (!providers.length) {
    return new NoopNotifier();
  }

  return new CompositeNotifier(providers, logger);
};

module.exports = {
  createNotifier,
};
