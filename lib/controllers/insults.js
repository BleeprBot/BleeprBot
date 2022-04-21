const { Router } = require('express');
const Insult = require('../models/Insult');

module.exports = Router().get('/', async (req, res) => {
  const insult = await Insult.getInsult();
  res.send(insult);
});
