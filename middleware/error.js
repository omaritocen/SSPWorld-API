
const logger = require('../logger/logger');

module.exports = function(err, req, res, next) {

    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'Something failed.';

    // NOT SURE IF THIS IT A CORRECT APPROACH
    if (err instanceof SyntaxError)
        return res.status(400).send({error: 'Invalid input: ' + err.message});

    logger.error(err.message);
    res.status(err.statusCode).json({
        message: err.message
    });
}