const qrcode = require("qrcode-terminal");
const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason,
} = require("baileys");

class WhatsAppSocketClient {
  constructor({ authDir, logger, onReady }) {
    this.authDir = authDir;
    this.logger = logger;
    this.onReady = onReady;
    this.hasInitializedSchedules = false;
  }

  async start() {
    const { state, saveCreds } = await useMultiFileAuthState(this.authDir);
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
      version,
      auth: state,
      logger: this.logger,
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", (update) => {
      const { connection, lastDisconnect } = update;

      if (update.qr) {
        this.logger.info("Scan the QR below to authenticate.");
        qrcode.generate(update.qr, { small: true });
      }

      if (connection === "close") {
        const statusCode = lastDisconnect?.error?.output?.statusCode;
        const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

        this.logger.warn(
          { statusCode, shouldReconnect },
          "Connection closed, reconnecting"
        );

        if (shouldReconnect) {
          this.start();
          return;
        }

        this.logger.error("Logged out. Delete auth_info and re-run to re-auth.");
      }

      if (connection === "open") {
        this.logger.info("WhatsApp connection opened");

        if (!this.hasInitializedSchedules) {
          this.onReady(sock);
          this.hasInitializedSchedules = true;
        }
      }
    });
  }
}

module.exports = {
  WhatsAppSocketClient,
};
