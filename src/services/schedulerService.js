const cron = require("node-cron");

class SchedulerService {
  constructor({ timezone, logger }) {
    this.timezone = timezone;
    this.logger = logger;
  }

  schedule(job) {
    cron.schedule("11 11 * * *", job, { timezone: this.timezone });
    cron.schedule("11 23 * * *", job, { timezone: this.timezone });
    cron.schedule("11 13 * * *", job, { timezone: this.timezone });
    cron.schedule("11 01 * * *", job, { timezone: this.timezone });

    this.logger.info(
      { timezone: this.timezone },
      "Scheduled messages for 11:11 AM, 11:11 PM, 1:11 PM, and 1:11 AM"
    );
  }
}

module.exports = {
  SchedulerService,
};
