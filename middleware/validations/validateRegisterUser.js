const User = require('../../models/user');
const AppError = require('../../utils/appError');

module.exports = function (req, res, next) {
    const { error } = User.validateRegisteration(req.body);
    if (error) return next(new AppError(error.details[0].message, 400));

    next();
}