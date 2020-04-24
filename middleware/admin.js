const AppError = require('../utils/appError');

module.exports = function(req, res, next) {
    if (req.user.role != 'admin') {
        return next(new AppError('Access Denied', 403));
    }

    next();
}