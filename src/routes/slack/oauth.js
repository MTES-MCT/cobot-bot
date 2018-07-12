import axios from 'axios';
import API from '../../lib/coConstruisons';
import Slack from '../../lib/slack';
import config from '../../config';

module.exports = (server) => {
  server.get('/slack/oauth', async (req, res, next) => {
    const { code } = req.query;
    const params = `client_id=${config.slack.client_id}&client_secret=${config.slack.client_secret}&code=${code}&redirect_uri=${config.slack.redirect_uri}`;
    try {
      const response = await axios.get(`${config.slack.oauth_url}?${params}`);
      if (response.data.ok) {
        const account = response.data;
        const userToken = account.access_token;
        try {
          const userInfo = await axios.get(`https://slack.com/api/users.profile.get?token=${userToken}&user=${account.user_id}`);
          if (userInfo.data.ok) {
            const { profile } = userInfo.data;
            server.logger.log('verbose', 'New Slack Bot User named %s', profile.real_name);
            try {
              // subscribe user in project database
              await API(null).users.subscribe('Slack', account, profile);

              // Log user
              const tokens = await API(null).auth.bybot('Slack', account.user_id);

              // send onboarding message to user
              const slack = new Slack(API, account.user_id, account.access_token);
              const message = await API(tokens.userToken).messages.fetch('onboarding');
              slack.post(message.text[0].text, message.attachments);

              // redirect user to project website
              res.redirect(config.website_url, next);
            } catch (error) {
              server.logger.log('error', error);
              res.send(400);
            }
          }
        } catch (error) {
          server.logger.log('error', 'UserInfo Error: %d', error);
          res.send(400);
        }
      } else {
        res.send(400);
      }
    } catch (error) {
      server.logger.log('error', error);
      res.send(400);
    }
  });
};
