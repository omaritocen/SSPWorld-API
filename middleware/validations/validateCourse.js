const Course = require('../../models/course');
const AppError = require('../../utils/appError');

module.exports = function(req, res ,next) {
    const { error } = Course.validate(req.body);
    if (error) return next(new AppError(error.details[0].message, 400));

    next();
}