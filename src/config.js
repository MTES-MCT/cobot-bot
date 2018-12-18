module.exports = {
  name: 'CO-BOT',
  version: '0.1.0',
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3022,
  website_url: process.env.WEBSITE,
  labelbot: process.env.LABELBOT,
  bot: {
    email: process.env.BOT_EMAIL,
    password: process.env.BOT_PASSWORD,
  },
  api: {
    url: process.env.API_URL,
    media_url: `${process.env.API_URL}/media`,
  },
  slack: {
    oauth_url: 'https://slack.com/api/oauth.access',
    client_id: process.env.SLACK_CLIENT_ID,
    client_secret: process.env.SLACK_CLIENT_SECRET,
    redirect_uri: process.env.SLACK_REDIRECT_URI,
    commands: ['onboarding', 'play'],
  },
  rocket_chat: {
    bot_name: process.env.ROCKETCHAT_USER,
    bot_password: process.env.ROCKETCHAT_PASSWORD,
  },
};
