const Update = require('../../models/update');

module.exports = function(req, res ,next) {
    const {error} = Update.validate(req.body);
    if (error) return res.status(400).send({error: error.details[0].message});

    next();
}