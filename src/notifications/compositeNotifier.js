const { Notifier } = require("./notifier");

class CompositeNotifier extends Notifier {
  constructor(notifiers, logger) {
    super();
    this.notifiers = notifiers;
    this.logger = logger;
  }

  async notify(event) {
    const settledResults = await Promise.allSettled(
      this.notifiers.map((notifier) => notifier.notify(event))
    );

    settledResults.forEach((result) => {
      if (result.status === "rejected") {
        this.logger.warn(
          { error: result.reason },
          "A notification provider failed"
        );
      }
    });
  }
}

module.exports = {
  CompositeNotifier,
};
