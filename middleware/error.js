
const logger = require('../logger/logger');

module.exports = function(err, req, res, next) {

    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'Something failed.';

    // TODO: NOT SURE IF THIS IT A CORRECT APPROACH
    if (err instanceof SyntaxError)
        return res.status(400).send({error: 'Invalid input: ' + err.message});


    //TODO: TO BE CHANGED 
    if (err.statusCode === 500)
        logger.error(err.message);

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    });
}