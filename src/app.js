import '@babel/polyfill';
import restify from 'restify';
import restifyPlugins from 'restify-plugins';
import corsMiddleware from 'restify-cors-middleware';
import config from './config';
import Logger from './utils/logger';


const Bot = require('./lib/bot')(config);

const cors = corsMiddleware({
  preflightMaxAge: 5,
  origins: ['*'],
  allowHeaders: ['GET', 'POST'],
});

const server = restify.createServer({
  name: config.name,
  version: config.version,
  acceptable: ['application/json', 'image/png'],
});

server.logger = Logger;
server.pre(cors.preflight);
server.use(cors.actual);
server.use(restifyPlugins.bodyParser({ mapParams: true }));
server.use(restifyPlugins.acceptParser(server.acceptable));
server.use(restifyPlugins.queryParser({ mapParams: true }));
server.use(restifyPlugins.fullResponse());

module.exports = server.listen(config.port, () => {
  Bot.run(server);
  server.logger.log('info', 'Server %s is listening on port %s', server.name, config.port);
});
