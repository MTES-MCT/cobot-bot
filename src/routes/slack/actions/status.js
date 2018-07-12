import Logger from '../../../utils/logger';

class Status {
  constructor(Payload, API, Slack) {
    this.Payload = Payload;
    this.API = API;
    this.Slack = Slack;
  }

  async mignon() {
    const { value } = this.Payload.actions[0];
    Logger.log('debug', 'Action was called with value "%s"', value);
    if (value === 'yes') {
      try {
        await this.Slack.status('CoBot "Mignon" contributeur', ':champagne:');
        const message = await this.API.messages.fetch('setStatusMignonDone');
        this.Slack.post(message.text[0].text, message.attachments);
      } catch (error) {
        Logger.log('error', error);
      }
    } else {
      const message = await this.API.messages.fetch('doNotChangeStatus');
      this.Slack.post(message.text[0].text, message.attachments);
    }
  }
}

module.exports = Status;
