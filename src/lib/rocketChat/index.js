import * as bot from 'bbot';
import Promise from 'bluebird';
import axios from 'axios';
import Logger from '../../utils/logger';

const parseAttachments = async (attachments) => {
  const parsedAttachements = [];
  if (attachments) {
    await Promise.map(attachments, async (attachment) => {
      parsedAttachements.push({
        image: (attachment.image) ? attachment.image : null,
        text: (attachment.text) ? attachment.text[0].text : '',
      });
      console.log(parsedAttachements);
      // await Promise.map(attachment.actions, (action) => {
      //   parsedAttachements[parsedAttachements.length - 1].actions.push({
      //     type: action.type,
      //     text: action.text,
      //   });
      // });
    });
  }
  return parsedAttachements;
};

class RocketChat {
  constructor() { // API, channelId, UserSlackToken
    this.rocketChat = bot;
    // bot.global.text(/\/play/i, (b) => {
    //   const message = {
    //     image: 'http://www.trbimg.com/img-5b04c449/turbine/ct-spt-bulls-lauri-markkanen-all-rookie-team-20180522',
    //     title: 'Lauri M(title field)',
    //     text: 'Should have been rookie of the year (text field)',
    //     description: 'What a great player! (description field)',
    //     actions: [
    //       {
    //         type: 'button',
    //         border_color: '#ff0000',
    //         text: 'Book flights',
    //         url: 'https://www.kayak.com',
    //         is_webview: true,
    //         webview_height_ratio: 'compact',
    //       },
    //     ],
    //   };

    //   return b.respond(message);
    // }, { id: 'play' });
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
    // try {
    //   const message = await axios.post('http://localhost:3000/api/v1/chat.postMessage', {
    //     text: 'Hello world!',
    //     channel: `@${channel}`,
    //   }, {
    //     headers: {
    //       'X-Auth-Token': response.data.data.authToken,
    //       'X-User-Id': response.data.data.userId,
    //     },
    //   });
    // } catch (e) {
    //   console.log(e.data);
    // }
  }
}

module.exports = RocketChat;
