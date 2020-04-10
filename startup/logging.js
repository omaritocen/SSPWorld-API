const winston = require('winston');
const morgan = require('morgan');
require('express-async-errors');

const logger = require('../logger/logger');

module.exports = function(app) {

    app.use(morgan('dev'));

    process.on('unhandledRejection', (ex) => {
        throw ex;
    });
// TODO: CHECK IF EXCEPTIONS ARE LOGGED
}