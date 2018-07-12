import { WebClient } from '@slack/client';
import Promise from 'bluebird';
import Logger from '../../utils/logger';

const parseAttachments = async (attachments) => {
  const parsedAttachements = [];
  if (attachments) {
    await Promise.map(attachments, (attachment) => {
      parsedAttachements.push({
        text: (attachment.text) ? attachment.text[0].text : '',
        callback_id: attachment.callback,
        color: attachment.color,
        attachment_type: 'default',
        image_url: (attachment.image) ? attachment.image : null,
        actions: attachment.actions,
      });
    });
  }
  return parsedAttachements;
};

class Slack {
  constructor(API, channelId, UserSlackToken) {
    this.slack = new WebClient(UserSlackToken);
    this.channelId = channelId;
    this.token = UserSlackToken;
    this.API = API;
  }

  async post(text, attachments) {
    const parsedAttachements = await parseAttachments(attachments);
    try {
      Logger.log('verbose', 'PostMessage to ChannelId %s', this.channelId);
      const response = await this.slack.chat.postMessage(
        this.channelId,
        text,
        { attachments: parsedAttachements },
      );
      return response;
    } catch (error) {
      Logger.log('error', 'Unable to PostMessage to user identified by ChannelId %s : %s', this.channelId, JSON.stringify(error));
      return error;
    }
  }

  async dialog(triggerId, dialog) {
    try {
      const response = await this.slack.dialog.open(dialog, triggerId);
      return response;
    } catch (error) {
      return error;
    }
  }

  async status(status, emoji) {
    try {
      const response = await this.slack['users.profile'].set({
        profile: {
          status_text: status,
          status_emoji: emoji,
        },
      });
      return response;
    } catch (error) {
      return error;
    }
  }
}

module.exports = Slack;
