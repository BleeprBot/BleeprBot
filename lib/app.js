const express = require('express');
const { App } = require('@slack/bolt');
require('dotenv').config();
const { WebClient } = require('@slack/web-api');
const { toxicityResponse } = require('../lib/utils/toxicity');

const token = process.env.BOT_TOKEN;
const web = new WebClient(token);

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
  const sentences = [message.text];
  const toxicityPredictions = await toxicityResponse(sentences);
  const json = JSON.stringify(toxicityPredictions);

  await say(json);
});

(async () => {
  await bot.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
})();

module.exports = app;
