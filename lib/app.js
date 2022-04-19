const express = require('express');
const { App } = require('@slack/bolt');
require('dotenv').config();
const { WebClient } = require('@slack/web-api');
const { toxicityResponse } = require('../lib/utils/toxicity');
const Violation = require('./models/Violation');
const fetch = require('cross-fetch');
const User = require('./models/User');
const Insult = require('./models/Insult');
const token = process.env.BOT_TOKEN;
const client = new WebClient(token);

const app = express();

// Built in middleware
app.use(express.json());

// App routes
app.use('/api/v1/violations', require('./controllers/violations'));
app.use('/api/v1/users', require('./controllers/users'));
app.use('/api/v1/insults', require('./controllers/insults'));
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
  if (!message.text) return;
  // first, bot checks if there's a user in usertable matching message.user
  // if there is a user, go get user
  let user = await User.getUser(message.user);
  if (!user) {
    // if there isn't a user, insert one (and then get the inserted user)
    user = await User.insert(message); 
    console.log('User!!', user);
  }
  console.log('USER!!!!!!', user);
  // now that we have user, check to see if the message was toxic
  const sentences = [message.text];
  const toxicityPredictions = await toxicityResponse(sentences);
  console.log(toxicityPredictions);
  if (toxicityPredictions.length) {
    // if it was, insert to violations table
    const insult = await Insult.getInsult();
    await say(`Watch thy language <@${message.user}>, thou ${insult.adjective_1}, ${insult.adjective_2} ${insult.noun}!
    `);
    console.log('MESSSAGE!!!!', message);

    const violationObj = {
      user_id: user.id,
      comment: message.text,
      identity_attack: toxicityPredictions.find(item => item.label === 'identity_attack') ? true : false,
      insult: toxicityPredictions.find(item => item.label === 'insult')  ? true : false,
      obscene: toxicityPredictions.find(item => item.label === 'obscene')  ? true : false,
      severe_toxicity: toxicityPredictions.find(item => item.label === 'severe_toxicity')  ? true : false,
      sexually_explicit: toxicityPredictions.find(item => item.label === 'sexually_explicit')  ? true : false,
      threat: toxicityPredictions.find(item => item.label === 'threat')  ? true : false,
      toxicity: toxicityPredictions.find(item => item.label === 'toxicity')  ? true : false,
    };

    console.log(violationObj);
    await Violation.insert(violationObj);
    await deleteMessage(message);
  } else {  // if it wasn't, do nothing/return
    await say('What you said was not bad.');
  }
    
});


async function deleteMessage(message) {
  const messageId = message.ts;
  const channelId = message.channel;

  try {
    const response = await client.chat.delete({
      channel: channelId,
      ts: messageId,
      token: process.env.ADMIN_TOKEN,
    });
    console.log('RESPONSE!!!!!!!!:', response);
  } catch (error) {
    console.error(error);
  }
}

(async () => {
  await bot.start(process.env.PORT || 3000);
  console.log('⚡️ Bolt app is running!');
})();

module.exports = app;
