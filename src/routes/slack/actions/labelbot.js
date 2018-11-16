import { Base64 } from 'js-base64';
import Logger from '../../../utils/logger';
import config from '../../../config';

class Labelbot {
  constructor(Payload, API, Slack) {
    this.Payload = Payload;
    this.API = API;
    this.Slack = Slack;
  }

  async open() {
    const { value } = this.Payload.actions[0];
    const { user } = this.Payload;
    Logger.log('debug', 'Action was called with value "%s"', value);
    if (value === 'no') {
      console.log('do not open labelbot');
    } else {
      const message = await this.API.messages.fetch('labelbotopen');
      const base64 = Base64.encodeURI(`${value}/Slack/${user.id}/`);
      message.text[0].text += ` ${config.labelbot}/#/home/${base64}`;
      this.Slack.post(message.text[0].text, message.attachments);
    }
  }
}

module.exports = Labelbot;
