const { Router } = require('express');
const User = require('../models/User');

module.exports = Router()
  .get('/:id', async (req, res) => {
    const user = await User.getUser(req.params.id);
    res.send(user);
  });
