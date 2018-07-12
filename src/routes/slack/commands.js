import Slack from '../../lib/slack';
import _API from '../../lib/coConstruisons';
import Commands from './commands/index';

module.exports = (server, authorizedCommands) => {
  server.post('/slack/commands/:command', async (req, res) => {
    const uuid = req.body.user_id;
    const tokens = await _API(null).auth.bybot('Slack', uuid);
    if (tokens && tokens.userToken && tokens.botToken) {
      const API = _API(tokens.userToken);
      const slack = new Slack(API, uuid, tokens.botToken);
      if (slack && !slack.error) {
        const commands = Commands(API, slack, server.logger);
        if (req.params.command && authorizedCommands.indexOf(req.params.command) > -1) {
          server.logger.log('verbose', `User "${uuid}" call command "${req.params.command}"`);
          commands[req.params.command].index();
        } else {
          server.logger.log('error', 'Command "%s" not yet implemented', req.params.command);
        }
      }
    } else {
      server.logger.log('error', 'Unable to get UserSlackToken for user %s', uuid);
    }
    res.send(200);
  });
};
