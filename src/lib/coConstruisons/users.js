import moment from 'moment';
import PasswordGenerator from '../../utils/passwordGenerator';

class Users {
  constructor(client, token) {
    this.client = client;
    this.client.options.headers.authorization = token;
  }

  async subscribe(channel, account, profile) {
    const user = {
      email: (profile.email) ? profile.email : '',
      password: PasswordGenerator(12),
      name: (profile.real_name) ? profile.real_name : '',
      role: 1,
      bots: {
        channel,
        channelUid: account.user_id,
        token: account.access_token,
      },
    };
    const mutation = `
      mutation subscribe($email: String, $password: String!, $name: String, $role: Int!, $bots: BotInput) {
        createUser(
          email: $email, 
          password: $password,
          name: $name,
          role: $role,
          bots: $bots
        ) {
          id
        }
      }
    `;
    try {
      const response = await this.client.request(mutation, user);
      return response;
    } catch (error) {
      if (error.response.errors) {
        return { error: error.response.errors[0] };
      }
      return error;
    }
  }

  async wakeup() {
    const twoDaysAgo = moment().add(-1, 'hours').toISOString();
    const query = `query WakeUpUsers($lastAnswers: String) {
      WakeUpUsers(lastAnswers: $lastAnswers) {
        id
        name
        email
        activity {
          lastAnswersAt
          numAnswers
          wakeUpLogs {
            at
            channel
          }
        }
        bots {
          channel
          channelUid
          token
        }
      }
    }`;
    try {
      const response = await this.client.request(query, { lastAnswers: twoDaysAgo });
      return response.WakeUpUsers;
    } catch (error) {
      if (error.response && error.response.errors) {
        throw new Error(JSON.stringify(error.response.errors[0]));
      } else {
        throw new Error(JSON.stringify(error));
      }
    }
  }

  async updateReminder(date) {
    const query = `mutation updateUserReminder($reminder: String!) {
      updateUserReminder(reminder: $reminder) {
        name
        reminder
      }
    }`;
    try {
      const response = await this.client.request(query, { reminder: date });
      return response.updateUserReminder;
    } catch (error) {
      if (error.response && error.response.errors) {
        throw new Error(JSON.stringify(error.response.errors[0]));
      } else {
        throw new Error(JSON.stringify(error));
      }
    }
  }

  async updateUserActivity(id, activity) {
    const query = `mutation updateUserActivity($id: ID!, $activity: UserActivityInput!) {
      updateUserActivity(id: $id, activity: $activity) {
        id
      }
    }`;
    try {
      const response = await this.client.request(query, { id, activity });
      return response.updateUserActivity;
    } catch (error) {
      if (error.response && error.response.errors) {
        throw new Error(JSON.stringify(error.response.errors[0]));
      } else {
        throw new Error(JSON.stringify(error));
      }
    }
  }
}

module.exports = Users;
