import axios from 'axios';
import API from '../../lib/coConstruisons';
import config from '../../config';
import RocketChat from '../../lib/rocketChat';

module.exports = (server) => {
  server.post('/rocketchat/user/create', async (req, res) => {
    try {
      const response = await axios.post('http://localhost:3000/api/v1/login', {
        user: config.rocket_chat.bot_name,
        password: config.rocket_chat.bot_password,
      });
      if (response && response.data.data.authToken) {
        try {
          const account = await axios.get(
            `http://localhost:3000/api/v1/users.info?userId=${req.body.user_id}`,
            {
              headers: {
                'X-Auth-Token': response.data.data.authToken,
                'X-User-Id': response.data.data.userId,
              },
            },
          );

          try {
            const user = {
              email: account.data.user.emails[0].address,
              name: account.data.user.username,
              role: 1,
              bots: {
                channel: 'Ariane',
                channelUid: account.data.user._id,
              },
            };
            // subscribe user in project database
            await API(null).users.subscribe('RocketChat', user);

            // Log user
            const tokens = await API(null).auth.bybot('Ariane', account.data.user._id);
            const message = await API(tokens.userToken).messages.fetch('onboarding');

            const rocketChat = new RocketChat();
            rocketChat.post(account.data.user.username, message.text[0].text, message.attachments);

            res.send(200);
          } catch (error) {
            server.logger.log('error', error);
            res.send(400);
          }
        } catch (error) {
          server.logger.log('error', 'UserInfo Error: %d', error);
        }
      }
    } catch (error) {
      server.logger.log('error', 'UserInfo Error: %d', error);
    }
  });
};
