class Notifier {
  async notify(_event) {
    throw new Error("notify(event) must be implemented");
  }
}

module.exports = {
  Notifier,
};
