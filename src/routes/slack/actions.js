import Slack from '../../lib/slack';
import _API from '../../lib/coConstruisons';
import Actions from './actions/index';

module.exports = (server) => {
  server.post('/slack/actions', async (req, res) => {
    const Payload = JSON.parse(req.body.payload);
    if (Payload.callback_id) {
      const uuid = Payload.user.id;
      server.logger.log('debug', 'Action "%s" has been called by user %s', Payload.callback_id, uuid);
      const tokens = await _API(null).auth.bybot('Slack', uuid);
      if (tokens && tokens.userToken && tokens.botToken) {
        const API = _API(tokens.userToken);
        const slack = new Slack(API, uuid, tokens.botToken);
        const actions = Actions(Payload, API, slack);
        const methods = Payload.callback_id.split('_');
        if (actions[methods[0]]) {
          if (methods[1]) {
            actions[methods[0]][methods[1]]();
          } else {
            actions[methods[0]].index();
          }
        } else {
          server.logger.log('debug', 'Action %s not yet implemented', Payload.callback_id);
        }
      }
    } else {
      server.logger.log('error', 'Unable to get UserSlackToken for user %s', req.body.user_id);
    }
    res.send(200);
  });
};
