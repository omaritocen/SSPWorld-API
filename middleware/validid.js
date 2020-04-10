const { isValidObjectId } = require('mongoose');

module.exports = function (req, res, next) {
    const id = req.params.id;
    if (!isValidObjectId(id))
        return res.status(400).send({ error: 'Invalid ID' });
    next();
};
