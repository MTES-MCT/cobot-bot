import Promise from 'bluebird';
import _ from 'lodash';
import Logger from '../../../utils/logger';

class DataSet {
  constructor(Payload, API, Slack) {
    this.Payload = Payload;
    this.API = API;
    this.Slack = Slack;
  }

  async answers() {
    const value = this.Payload.actions[0].value.split('|');
    const dataSetId = value[0];
    const userAnswer = value[1];
    Logger.log('debug', 'Action was called with value "%s"', value);
    try {
      const userActivity = await this.API.dataset.create(dataSetId, userAnswer);
      switch (userActivity.activity.numAnswers) {
        case 1: {
          const message = await this.API.messages.fetch('firstcontribution');
          this.Slack.post(message.text[0].text, message.attachments);
          break;
        }
        case 5: {
          const message = await this.API.messages.fetch('mignoncontribution');
          this.Slack.post(message.text[0].text, message.attachments);
          break;
        }
        default: {
          if (userActivity.activity.slotNumAnswers > 500) {
            const message = await this.API.messages.fetch('slotLimitReach');
            this.Slack.post(message.text[0].text, message.attachments);
            userActivity.activity.slotNumAnswers = 0;
            await this.API.users.updateUserActivity(userActivity.id, userActivity.activity);
          } else {
            // WARNING: Duplicate code from commands/play
            const data = await this.API.dataset.fetch('streetco2');
            if (userAnswer === 'aucun' && data) {
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
                color: '#4598E6',
                actions,
              }];
              this.Slack.post('', attachments);
            } else if (data) {
              const message = await this.API.messages.fetch('labelbot');
              const yesAnswers = _.find(
                message.attachments[0].actions,
                action => action.value === 'yes',
              );
              yesAnswers.value = `${data._id}/${userAnswer}`;
              this.Slack.post(message.text[0].text, message.attachments);
            }
          }
        }
      }
    } catch (error) {
      Logger.log('error', error);
    }
  }
}

module.exports = DataSet;
