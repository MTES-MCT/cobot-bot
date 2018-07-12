import moment from 'moment';
import Logger from '../../../utils/logger';

const getRandomInt = (min, max) =>
  Math.floor(Math.random() * ((max - min) + 1)) + min;

class Reminder {
  constructor(Payload, API, Slack) {
    this.Payload = Payload;
    this.API = API;
    this.Slack = Slack;
  }

  async index() {
    const { value } = this.Payload.actions[0];
    let reminderAt;
    let message;
    Logger.log('debug', 'Action was called with value "%s"', value);
    if (value === 'tomorrow') {
      reminderAt = moment(moment().add(1, 'days').format('YYYY-MM-DD 09:00:00')).toISOString();
      message = await this.API.messages.fetch('reminderTomorrowSet');
    } else {
      reminderAt = moment(moment().add(getRandomInt(2, 7), 'days').format('YYYY-MM-DD 09:00:00')).toISOString();
      message = await this.API.messages.fetch('reminderSet', { date: moment(reminderAt).locale('fr').format('DD MMMM') });
    }
    try {
      await this.API.users.updateReminder(reminderAt);
      this.Slack.post(message.text[0].text, message.attachments);
    } catch (error) {
      Logger.log('error', error);
    }
  }
}

module.exports = Reminder;
