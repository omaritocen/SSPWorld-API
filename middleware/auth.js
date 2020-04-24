const config = require('config');
const jwt = require('jsonwebtoken');

const AppError = require('../utils/appError');

module.exports = function (req, res, next) {
    const token = req.header('x-auth-token');
    const secret = config.get('jwtPrivateKey');
    try {
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        next();
    }
    catch (ex) {
        // return res.status(401).send({error: 'Invalid Token'});
        return next(new AppError('Invalid Token', 401));
    }

}