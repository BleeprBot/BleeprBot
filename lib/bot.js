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
  console.log(user);
  console.log(message.text);
  // if a message.text ==== !promote @slack-username
  // and the user making the !promote request is an admin
    // check if @user is a user in our table
      // if so - check if they are an admin
      // if not an admin - update to an admin <---- 
    // if they are not a user in our table
      // add them or simply say "this user is not in the channel"
  // if the user making the !promote request is not an admin
    // deny the request with a shakespearean insult


  const sentences = [message.text];
  const toxicityPredictions = await toxicityResponse(sentences);
  
  if (toxicityPredictions.length) {
    const insult = await Insult.getInsult();
    await say(`Watch thy language <@${message.user}>, thou ${insult.adjective_1}, ${insult.adjective_2} ${insult.noun}!
      `);
  
    const violationObj = {
      user_id: user.id,
      comment: message.text,
      identity_attack: !!toxicityPredictions.find(item => item.label === 'identity_attack'),
      insult: !!toxicityPredictions.find(item => item.label === 'insult'),
      obscene: !!toxicityPredictions.find(item => item.label === 'obscene'),
      severe_toxicity: !!toxicityPredictions.find(item => item.label === 'severe_toxicity'),
      sexually_explicit: !!toxicityPredictions.find(item => item.label === 'sexually_explicit'),
      threat: !!toxicityPredictions.find(item => item.label === 'threat'),
      toxicity: !!toxicityPredictions.find(item => item.label === 'toxicity')
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
