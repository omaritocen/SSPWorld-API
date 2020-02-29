

module.exports = function(err, req, res, next) {
    // LOGGER TO LOG THE ERRORS
    console.log('THIS RAN',err);
    res.status(500).send('Something failed.');
}