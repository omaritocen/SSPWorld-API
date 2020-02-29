const express = require('express');

const home = require('../routes/home');
const courses = require('../routes/courses');
const users = require('../routes/users');
const auth = require('../routes/auth');
const error = require('../middleware/error');

module.exports = function(app) {

    app.use(express.json());
    app.use('/', home);
    app.use('/api/courses', courses);
    app.use('/api/users', users);
    app.use('/api/auth', auth);
    app.use(error);
}
