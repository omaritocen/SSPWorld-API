const Enrollment = require('../../models/enrollment');
const AppError = require('../../utils/appError');

module.exports = function(req, res, next) { 
    const { error } = Enrollment.validate(req.body);
    if (error) return next(new AppError(error.details[0].message, 400));

    next();
}