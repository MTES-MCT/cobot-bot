import Promise from 'bluebird';
import Logger from '../../../utils/logger';

class Play {
  constructor(Payload, API, Slack) {
    this.Payload = Payload;
    this.API = API;
    this.Slack = Slack;
  }

  async index() {
    const { value } = this.Payload.actions[0];
    Logger.log('debug', 'Action was called with value "%s"', value);
    if (value === 'yes') {
      // WARNING: Duplicate code from commands/play
      const data = await this.API.dataset.fetch('streetco2');
      if (data) {
        const actions = [];
        await Promise.map(data.availableAnswers, (answer) => {
          actions.push({
            name: 'datasetBtn',
            text: answer.text,
            type: 'button',
            value: `${data._id}|${answer.text}`,
          });
        });
        const attachments = [{
          text: [{ text: data.question }],
          image: `${process.env.API_URL}/img/${data.file}`,
          callback: 'dataset_answers',
          color: '#FF0000',
          actions,
        }];
        this.Slack.post('', attachments);
      }
    } else {
      const message = await this.API.messages.fetch('sobad');
      this.Slack.post(message.text[0].text, message.attachments);
    }
  }
}

module.exports = Play;
