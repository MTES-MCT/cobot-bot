import * as bot from 'bbot';
import Promise from 'bluebird';
import axios from 'axios';
import Logger from '../../utils/logger';

const parseAttachments = async (attachments) => {
  const parsedAttachements = [];
  if (attachments) {
    await Promise.map(attachments, async (attachment) => {
      parsedAttachements.push({
        button_alignment: 'horizontal',
        image_url: (attachment.image_url) ? attachment.image_url : null,
        text: (attachment.text) ? attachment.text[0].text : '',
        color: attachment.color,
        attachment_type: 'default',
        actions: [],
      });
      await Promise.map(attachment.actions, (action) => {
        parsedAttachements[parsedAttachements.length - 1].actions.push({
          type: action.type,
          text: action.text,
          msg: action.text,
          msg_in_chat_window: true,
        });
      });
    });
  }
  return parsedAttachements;
};

class RocketChat {
  constructor(authToken, userID) { // API, channelId, UserSlackToken
    this.rocketChat = bot;
    this.authToken = authToken;
    this.userID = userID;
  }
  async run() {
    try {
      const rocketChat = await this.rocketChat.start();
      return rocketChat;
    } catch (error) {
      return error;
    }
  }
  // eslint-disable-next-line class-methods-use-this
  async post(channel, text, attachments) {
    const parsedAttachements = await parseAttachments(attachments);
    console.log(parsedAttachements);
    try {
      await axios.post('http://localhost:3000/api/v1/chat.postMessage', {
        text,
        attachments: parsedAttachements,
        channel: `@${channel}`,
      }, {
        headers: {
          'X-Auth-Token': this.authToken,
          'X-User-Id': this.userID,
        },
      });
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = RocketChat;
