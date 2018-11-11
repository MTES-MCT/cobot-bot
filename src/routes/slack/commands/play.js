import Promise from 'bluebird';

class Play {
  constructor(API, Slack, Logger) {
    this.API = API;
    this.Slack = Slack;
    this.Logger = Logger;
  }

  async index() {
    try {
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
    } catch (error) {
      console.log('errror');
      this.Logger.log('error', error);
    }
  }
}

module.exports = Play;
