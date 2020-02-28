const express = require('express');

const home = require('../routes/home');
const courses = require('../routes/courses');

module.exports = function(app) {

    app.use(express.json());
    app.use('/', home);
    app.use('/api/courses', courses);
}
