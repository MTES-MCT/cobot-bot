import Cron from 'cron';
import Promise from 'bluebird';
import Logger from '../../utils/logger';
import Slack from '../../lib/slack';
import config from '../../config';
import _API from '../../lib/coConstruisons';

const WakeUpUsers = () => {
  const cron = new Cron.CronJob(
    '00 05 12 * * 1-5', async () => {
      try {
        Logger.log('verbose', 'Execute "WakeUpUsers" scheduled job');
        const token = await _API(null).auth.login(config.bot.email, config.bot.password);
        const API = _API(token);
        const users = await API.users.wakeup();
        Promise.map(users, async (user) => {
          if (user.email !== config.bot.email) {
            if (user.bots[0]) { // Should randomize bot channel in the futur
              const message = await API.messages.fetch('wakeup', { name: user.name });
              const uuid = user.bots[0].channelUid;
              const { channel } = user.bots[0];
              const botToken = user.bots[0].token;
              const slack = new Slack(null, uuid, botToken);
              slack.post(message.text[0].text, message.attachments);

              const { activity } = user;
              activity.wakeUpLogs = {
                at: new Date(),
                channel,
              };
              await API.users.updateUserActivity(user.id, activity);
            }
          }
        });
      } catch (error) {
        Logger.log('error', error);
      }
    }, () => {
      Logger.log('info', 'CronJob stopped');
    },
    true,
  );
};


module.exports = WakeUpUsers;
