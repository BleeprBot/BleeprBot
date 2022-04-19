const app = require('./lib/app');
const pool = require('./lib/utils/pool');
const bot = require('./lib/bot');

const API_URL = process.env.API_URL || 'http://localhost';
const PORT = process.env.PORT || 7890;

app.listen(PORT, () => {
  console.log(`🚀  Server started on ${API_URL}:${PORT}`);
});

(async () => {
  await bot.start(process.env.PORT || 3000);
  console.log('⚡️ Bolt app is running!');
})();

process.on('exit', () => {
  console.log('👋  Goodbye!');
  pool.end();
});
