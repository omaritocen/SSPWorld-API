const mongoose = require('mongoose');
const config = require('config');

const logger = require('../logger/logger');

const url = config.get('mongoDB.url');
const opts = config.get('mongoDB.options');

mongoose.connect(url, opts)
    .then(() => logger.info('Connected successfully to MongoDB'))
    .catch((ex) => logger.error('Failed to connected to MongoDB' + ex));
    