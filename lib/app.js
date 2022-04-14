const express = require('express');
const { App } = require('@slack/bolt');
require('dotenv').config();

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

bot.message('hello', async ({ message, say }) => {
  await say(`Hey there from Clare's server <@${message.user}>!`);
});

(async () => {
  await bot.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
})();

module.exports = app;
