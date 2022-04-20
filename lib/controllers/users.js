const { Router } = require('express');
const User = require('../models/User');

module.exports = Router()
  .get('/:id', async (req, res) => {
    const user = await User.getUser(req.params.id);
    res.send(user);
  })

  .post('/', async (req, res) => {
    const user = await User.insert(req.body);
    res.send(user);
  })
  
  .patch('/:id', async (req, res) => {
    res.send(await User.promoteAdmin(req.params.id));
  });
