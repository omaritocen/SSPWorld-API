
const logger = require('../logger/logger');

module.exports = function(err, req, res, next) {
    logger.error(err);
    res.status(500).send('Something failed.');
}