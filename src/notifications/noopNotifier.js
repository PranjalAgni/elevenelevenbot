const { Notifier } = require("./notifier");

class NoopNotifier extends Notifier {
  async notify(_event) {
    // Intentionally no-op.
  }
}

module.exports = {
  NoopNotifier,
};
