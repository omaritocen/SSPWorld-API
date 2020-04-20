const Student = require('../../models/student');

module.exports = function(req, res ,next) {
    const { error } = Student.validate(req.body);
    if (error) return res.status(400).send({error: error.details[0].message});

    next();
}