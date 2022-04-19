const express = require('express');

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

module.exports = app;
