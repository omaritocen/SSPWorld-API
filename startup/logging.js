const winston = require('winston');
require('express-async-errors');

const logger = require('../logger/logger');

module.exports = function() {
    process.on('unhandledRejection', (ex) => {
        throw ex;
    });

}