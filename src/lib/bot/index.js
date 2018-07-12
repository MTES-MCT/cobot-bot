import WakeUpUsers from './scheduledJobs';
import Routes from '../../routes';

module.exports = () => ({
  run: async (server) => {
    Routes(server);
    WakeUpUsers();
    server.logger.log('verbose', 'Co-Bot is now up and running');
  },
});
