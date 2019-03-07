import Promise from 'bluebird';
import axios from 'axios';
import config from '../../config';
import RocketChat from '../../lib/rocketChat';
import _API from '../../lib/coConstruisons';

const botToken = async () => {
  try {
    const response = await axios.post('http://localhost:3000/api/v1/login', {
      user: config.rocket_chat.bot_name,
      password: config.rocket_chat.bot_password,
    });
    if (response && response.data.data.authToken) {
      return {
        token: response.data.data.authToken,
        userId: response.data.data.userId,
      };
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = (server) => {
  server.post('/rocket/actions/play', async (req, res) => {
    // const uuid = Payload.user.id;
    // server.logger.log('debug', 'Action "%s" has been called by user %s', Payload.callback_id, uuid);
    const Payload = req.body;
    const bot = await botToken();
    const tokens = await _API(null).auth.bybot('Ariane', Payload.user_id);
    const data = await _API(tokens.userToken).dataset.fetch('5c6aa20dcf5834b8cb5f4b4d');
    if (data) {
      // const afile = data.file.split('.');
      const file = `5c6aa20dcf5834b8cb5f4b4d/${data.file}`;
      // const file = `${afile[0]}_x480.${afile[1]}`;
      const actions = [];
      await Promise.map(data.availableAnswers, (answer) => {
        actions.push({
          name: 'datasetBtn',
          text: answer.text,
          type: 'button',
          value: `${data._id}|${answer.text}|${data.file}`,
        });
      });
      const attachments = [{
        text: [{ text: data.question }],
        image_url: `${process.env.API_URL}/img/${file}`,
        callback: 'dataset_answers',
        color: '#FF0000',
        actions,
      }];
      const rocketChat = new RocketChat(bot.token, bot.userId);
      rocketChat.post(Payload.user_name, '', attachments);
    }
    res.send(200);
  });
  server.post('/rocket/actions/thanks', async (req, res) => {
    const Payload = req.body;
    const bot = await botToken();
    // const tokens = await _API(null).auth.bybot('Ariane', Payload.user_id);
    const rocketChat = new RocketChat(bot.token, bot.userId);
    const attachments = [{
      text: [{ text: 'On continue ?' }],
      button_alignment: 'horizontal',
      actions: [
        {
          type: 'button',
          text: 'Oui',
        },
        {
          type: 'button',
          text: 'Non',
        },
      ],
    }];
    rocketChat.post(Payload.user_name, 'Merci !', attachments);
    res.send(200);
  });
  server.post('/rocket/actions/stop', async (req, res) => {
    const Payload = req.body;
    const bot = await botToken();
    // const tokens = await _API(null).auth.bybot('Ariane', Payload.user_id);
    const rocketChat = new RocketChat(bot.token, bot.userId);
    rocketChat.post(Payload.user_name, 'Très bien, merci d\'avoir participer :pray:. A très vite !');
    res.send(200);
  });
};
