
module.exports = function(req, res, next) {
    if (req.user.role !== 'repre' && req.user.role !== 'ta') {
        return res.status(403).send('Access Denied');
    }

    next();
}