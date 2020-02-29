const express = require('express');

const home = require('../routes/home');
const courses = require('../routes/courses');
const error = require('../middleware/error');

module.exports = function(app) {

    app.use(express.json());
    app.use('/', home);
    app.use('/api/courses', courses);
    app.use(error);
}
