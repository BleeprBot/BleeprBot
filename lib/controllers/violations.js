const { Router } = require('express');
const Violation = require('../models/Violation');

module.exports = Router()
  .post('/', async (req, res) => {
    res.send(await Violation.insert(req.body));
  })
  
  .get('/leaderboard', async (req, res) => {
    res.send(await Violation.getLeaderboard());
  });
