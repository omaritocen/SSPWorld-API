const User = require('../../models/user');
const AppError = require('../../utils/appError');

module.exports = async function (req, res, next) {
    const { error } = await User.validateLogin(req.body);
    if (error) return next(new AppError(error.details[0].message, 400));

    next();
}