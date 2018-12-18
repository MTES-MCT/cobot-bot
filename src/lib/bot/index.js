import WakeUpUsers from './scheduledJobs';
import RocketChat from '../../lib/rocketChat';
import Routes from '../../routes';

module.exports = () => ({
  run: async (server) => {
    new RocketChat().run();
    Routes(server);
    WakeUpUsers();
    server.logger.log('verbose', 'Co-Bot is now up and running');
  },
});
