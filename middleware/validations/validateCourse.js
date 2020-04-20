const Course = require('../../models/course');

module.exports = function(req, res ,next) {
    const { error } = Course.validate(req.body);
    if (error) return res.status(400).send({ error: error.details[0].message });

    next();
}