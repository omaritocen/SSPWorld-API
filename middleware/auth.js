const config = require('config');
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const token = req.header('x-auth-token');
    const secret = config.get('jwtPrivateKey');
    try {
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        next();
    }
    catch (ex) {
        return res.status(401).send({error: 'Invalid Token'});
    }

}