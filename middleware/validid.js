const { isValidObjectId } = require('mongoose');

const AppError = require('../utils/appError');

module.exports = function (req, res, next) {
    const id = req.params.id;
    if (!isValidObjectId(id))
        return next(new AppError('Invalid ID', 400));
    next();
};
