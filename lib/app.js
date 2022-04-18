const express = require('express');
const { App } = require('@slack/bolt');
require('dotenv').config();
const { WebClient } = require('@slack/web-api');
const { toxicityResponse } = require('../lib/utils/toxicity');

const token = process.env.BOT_TOKEN;
const client = new WebClient(token);

const app = express();

// Built in middleware
app.use(express.json());

// App routes

// Error handling & 404 middleware for when
// a request doesn't match any app routes
app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

//refactor
const bot = new App({
  token: process.env.BOT_TOKEN,
  signingSecret: process.env.SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.APP_TOKEN,
});

bot.message(async ({ message, say }) => {
  console.log('message', message);
  const sentences = [message.text];
  const toxicityPredictions = await toxicityResponse(sentences);
  if (toxicityPredictions.length) {
    try {
      await say(`shame shame I know your name <@${message.user}>`);
      return await deleteMessage(message);
    } catch (error) {
      console.log(error);
    }
    
  } else {
    await say('What you said was not bad.');
  }
  
});

async function deleteMessage(message) {
  const messageId = message.ts;
  const channelId = message.channel;

  try {
    return await client.chat.delete({
      channel: channelId,
      ts: messageId,
      token: process.env.ADMIN_TOKEN,
      as_user: true,
    });
  } catch (error) {
    console.error(error);
  }
}

(async () => {
  await bot.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
})();

module.exports = app;
