
const logger = require('../logger/logger');

module.exports = function(err, req, res, next) {

    // NOT SURE IF THIS IT A CORRECT APPROACH
    if (err instanceof SyntaxError)
        return res.status(400).send('Invalid input' + err.message);

    logger.error(err.message);
    res.status(500).send('Something failed.');
}