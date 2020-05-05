const { isValidObjectId } = require('mongoose');

const AppError = require('../utils/appError');

module.exports = function (req, res, next, val) {
    if (!isValidObjectId(val)) return next(new AppError('Invalid ID', 400));
    next();
};
