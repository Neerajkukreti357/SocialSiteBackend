const express = require('express');
const mainRoutes = require('./src/routes/index.js');
const ROUTES_CONSTANTS = require('./src/constants/routesConstants');
const morgan = require('morgan');
const logger = require('./src/utils/logger');

const app = express();

// Middleware (later you can add body-parser, cors, etc.)
app.use(express.json());


// Morgan for HTTP requests
app.use(morgan('dev', {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}));

// Routes
app.use(ROUTES_CONSTANTS.main, mainRoutes);

module.exports = app;
