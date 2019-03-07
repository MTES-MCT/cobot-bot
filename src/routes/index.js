import config from '../config';
import SlackActions from './slack/actions';
import SlackCommands from './slack/commands';
import SlackOauth from './slack/oauth';

import RocketChatOauth from './rocketChat/oauth';
import RocketChatActions from './rocketChat/actions';

module.exports = (server) => {
  SlackActions(server);
  SlackCommands(server, config.slack.commands);
  SlackOauth(server);

  RocketChatOauth(server);
  RocketChatActions(server);
};
