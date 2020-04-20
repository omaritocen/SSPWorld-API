const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');

const rateLimit = require('../middleware/rateLimit')


module.exports = function(app) {
    app.use(helmet());
    app.use(mongoSanitize());
    app.use(rateLimit);
}