import _ from 'lodash';

class Auth {
  constructor(client) {
    this.client = client;
  }

  async login(email, password) {
    const credentials = { email, password };
    const mutation = `
      mutation login($email: String!, $password: String!) {
        authorization(email: $email, password: $password)
      }
    `;
    try {
      const response = await this.client.request(mutation, credentials);
      return response.authorization;
    } catch (error) {
      if (error.response && error.response.errors) {
        throw new Error(JSON.stringify(error.response.errors[0]));
      } else {
        throw new Error(JSON.stringify(error));
      }
    }
  }

  async bybot(channel, channelUid) {
    const credentials = {
      channel,
      channelUid,
    };
    const mutation = `
      mutation login($channel: String!, $channelUid: String!) {
        loginByBot(
          channel: $channel, 
          channelUid: $channelUid,
        ) {
          name
          token
          bots {
            id
            channel
            channelUid
            token
          }
        }
      }
    `;
    try {
      const response = await this.client.request(mutation, credentials);
      const user = response.loginByBot;
      const bot = _.find(user.bots, { channel, channelUid });
      if (bot) {
        return {
          userToken: user.token,
          botToken: bot.token,
        };
      }
      return { error: 'No bot for user' };
    } catch (error) {
      if (error.response && error.response.errors) {
        throw new Error(JSON.stringify(error.response.errors[0]));
      } else {
        throw new Error(JSON.stringify(error));
      }
    }
  }
}

module.exports = Auth;
