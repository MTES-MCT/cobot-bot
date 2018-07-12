class OnBoarding {
  constructor(API, Slack, Logger) {
    this.API = API;
    this.Slack = Slack;
    this.Logger = Logger;
  }

  async index() {
    try {
      const message = await this.API.messages.fetch('onboarding');
      this.Slack.post(message.text[0].text, message.attachments);
    } catch (error) {
      this.Logger.log('error', error);
    }
  }
}

module.exports = OnBoarding;
