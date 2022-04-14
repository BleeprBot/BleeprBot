const { App } = require('@slack/bolt');

require('dotenv').config();

const app = new App({
  token: process.env.BOT_TOKEN,
  signingSecret: process.env.SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.APP_TOKEN,
});

app.message('hello', async ({ message, say }) => {
  await say(`Hey there <@${message.user}>!`);
});

(async () => {
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
})();
