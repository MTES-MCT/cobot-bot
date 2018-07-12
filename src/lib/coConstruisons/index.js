import { GraphQLClient } from 'graphql-request';
import config from '../../config';
import Auth from './auth';
import DataSet from './dataset';
import Users from './users';
import Messages from './messages';

const client = new GraphQLClient(`${config.api.url}/graphql`, {
  headers: {
    authorization: 'Bearer ',
  },
});

module.exports = token => ({
  auth: new Auth(client),
  dataset: new DataSet(client, token),
  messages: new Messages(client, token),
  users: new Users(client, token),
});
