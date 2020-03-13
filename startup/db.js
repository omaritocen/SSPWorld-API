const mongoose = require('mongoose');
const config = require('config');

const logger = require('../logger/logger');

let url;

if (process.env.NODE_ENV !== 'test')
    url = config.get('mongoDB.url');
else
    url = config.get('mongoDB.testUrl');

const opts = config.get('mongoDB.options');

mongoose.connect(url, opts)
    .then(() => logger.info('Connected successfully to MongoDB'))
    .catch((ex) => logger.error('Failed to connected to MongoDB' + ex));
    