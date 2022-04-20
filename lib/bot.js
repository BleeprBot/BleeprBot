require('dotenv').config();
const { App } = require('@slack/bolt');
const { toxicityResponse } = require('../lib/utils/toxicity');
const { WebClient } = require('@slack/web-api');
const Violation = require('./models/Violation');
const User = require('./models/User');
const Insult = require('./models/Insult');
const token = process.env.BOT_TOKEN;
const client = new WebClient(token);

const bot = new App({
  token: process.env.BOT_TOKEN,
  signingSecret: process.env.SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.APP_TOKEN,
});
  
bot.message(async ({ message, say }) => {
  if (!message.text) return;

  let user = await User.getUser(message.user);
  if (!user) {
    // if there isn't a user, insert one (and then get the inserted user)
    user = await User.insert(message); 
  }

  if (message.text === '!leaderboard') {
    const leaderboard = await Violation.getLeaderboard();
    const text = leaderboard.map(item => {
      return `\n<@${item.slack_id}> with \`${item.violations_count}\` toxicity violations`;
    }).join(' ');
    await say(`The foulest mouths are: ${text}`);
    return;
  }

  // first, bot checks if there's a user in usertable matching message.user
  // if there is a user, go get user

  
  // now that we have user, check to see if the message was toxic
  const sentences = [message.text];
  const toxicityPredictions = await toxicityResponse(sentences);
  
  if (toxicityPredictions.length) {
    // if it was, insert to violations table
    const insult = await Insult.getInsult();
    await say(`Watch thy language <@${message.user}>, thou ${insult.adjective_1}, ${insult.adjective_2} ${insult.noun}!
      `);
  
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
  
    await Violation.insert(violationObj);
    await deleteMessage(message);
  }
});


  
async function deleteMessage(message) {
  const messageId = message.ts;
  const channelId = message.channel;
  
  try {
    await client.chat.delete({
      channel: channelId,
      ts: messageId,
      token: process.env.ADMIN_TOKEN,
    });
    
  } catch (error) {
    console.error(error);
  }
}

module.exports = bot; 
