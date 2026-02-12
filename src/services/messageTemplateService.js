const { formatTime12h } = require("../utils/time");

class MessageTemplateService {
  constructor(template) {
    this.template = template;
  }

  buildNow() {
    const timeStr = formatTime12h(new Date());
    return this.template.replace(/\{time\}/g, timeStr);
  }
}

module.exports = {
  MessageTemplateService,
};
