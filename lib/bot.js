require('dotenv').config();
const { App } = require('@slack/bolt');
const { toxicityResponse } = require('../lib/utils/toxicity');
const { WebClient } = require('@slack/web-api');
const Violation = require('./models/Violation');
const User = require('./models/User');
const Insult = require('./models/Insult');
const token = process.env.BOT_TOKEN;
const client = new WebClient(token);
const PROMOTE_REGEX = /^!promote <@[UW][A-Z0-9]{10}>$/g;
const VIOLATION_REGEX = /^!violations <@[UW][A-Z0-9]{10}>$/g;
const DELETE_VIOLATION_REGEX =
  /^!deleteViolation [0-9223372036854775807]{1,19}$/g;

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

  if (message.text === '!roastMe') {
    const insult = await Insult.getInsult();
    await say(
      `Feast thy eyes upon this ${insult.adjective_1}, ${insult.adjective_2} ${insult.noun}! <@${message.user}>`
    );
  }

  if (message.text === '!leaderboard') {
    const leaderboard = await Violation.getLeaderboard();
    const text = leaderboard
      .map((item) => {
        return `\n<@${item.slack_id}> with \`${item.violations_count}\` toxicity violations`;
      })
      .join(' ');
    await say(`The foulest mouths are: ${text}`);
    return;
  }

  // if a message.text matches regex pattern
  if (message.text.match(PROMOTE_REGEX)) {
    console.log('message in if statement', message.text.match(PROMOTE_REGEX));
    // if the user making the !promote request is an admin
    if (user.is_admin) {
      //get the user slack_id off the end of the !promote message
      const userToPromote_slack_id = message.text.substring(11, 22);
      //check if the user being promoted is in our users table
      const userToPromote = await User.getUser(userToPromote_slack_id);
      // if they are not a user in our table
      if (!userToPromote) {
        //say "this user is not in the channel"
        await say(
          `That user has not interacted with this channel! <@${userToPromote_slack_id}>, say hello!`
        );
      }
      //otherwise, update is_admin to true
      else {
        const promotedUser = await User.promoteAdmin(userToPromote_slack_id);
        console.log('promotedUser!!!!!!!', promotedUser);
        await say('User has been promoted!');
      }
    } else {
      // deny the request with a shakespearean insult
      const insult = await Insult.getInsult();
      await say(
        `You don't have the right. Be gone thou ${insult.adjective_1}, ${insult.adjective_2} ${insult.noun}!`
      );
    }
  }

  if (message.text.match(VIOLATION_REGEX)) {
    if (user.is_admin) {
      const violatorSlackId = message.text.substring(
        14,
        message.text.length - 1
      );
      const violations = await Violation.getByUserId(violatorSlackId);
      console.log('violations!!!!!!', violations);

      if (!violations) {
        await client.chat.postMessage({
          channel: user.slack_id,
          text: 'This user has no violations.',
        });
      } else {
        await client.chat.postMessage({
          channel: user.slack_id,
          text: `Here are the violations for <@${violatorSlackId}>: \n
          ${violations
            .map((violation) => {
              return `\n\`\`\`${violation.id} | "${violation.comment}" | Identity Attack: ${violation.identity_attack} | Insult: ${violation.insult} | Obscene: ${violation.obscene} | Severe Toxicity: ${violation.severe_toxicity} | Sexually Explicit: ${violation.sexually_explicit} | Threat: ${violation.threat} | Toxicity: ${violation.toxicity}\`\`\``;
            })
            .join(' ')}`,
        });
      }
    } else {
      const insult = await Insult.getInsult();
      await client.chat.postMessage({
        channel: user.slack_id,
        text: `You don't have the right. Be gone thou ${insult.adjective_1}, ${insult.adjective_2} ${insult.noun}!`,
      });
    }
  }

  if (message.text.match(DELETE_VIOLATION_REGEX)) {
    console.log('message!!!!', message.text);
    if (user.is_admin) {
      const violationToDelete = message.text.substring(17, message.text.length);
      await Violation.deleteById(violationToDelete);
      await client.chat.postMessage({
        channel: user.slack_id,
        text: 'The violation has been deleted!',
      });
    } else {
      const insult = await Insult.getInsult();
      await client.chat.postMessage({
        channel: user.slack_id,
        text: `You don't have the right. Be gone thou ${insult.adjective_1}, ${insult.adjective_2} ${insult.noun}!`,
      });
    }
  }

  const sentences = [message.text];
  const toxicityPredictions = await toxicityResponse(sentences);

  if (toxicityPredictions.length) {
    const insult = await Insult.getInsult();
    await say(`Watch thy language <@${message.user}>, thou ${insult.adjective_1}, ${insult.adjective_2} ${insult.noun}!
      `);

    const violationObj = {
      user_id: user.id,
      comment: message.text,
      identity_attack: !!toxicityPredictions.find(
        (item) => item.label === 'identity_attack'
      ),
      insult: !!toxicityPredictions.find((item) => item.label === 'insult'),
      obscene: !!toxicityPredictions.find((item) => item.label === 'obscene'),
      severe_toxicity: !!toxicityPredictions.find(
        (item) => item.label === 'severe_toxicity'
      ),
      sexually_explicit: !!toxicityPredictions.find(
        (item) => item.label === 'sexually_explicit'
      ),
      threat: !!toxicityPredictions.find((item) => item.label === 'threat'),
      toxicity: !!toxicityPredictions.find((item) => item.label === 'toxicity'),
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
