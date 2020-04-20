const Enrollment = require('../../models/enrollment');

module.exports = function(req, res, next) { 
    const { error } = Enrollment.validate(req.body);
    if (error) return res.status(400).send({ error: error.details[0].message });

    next();
}