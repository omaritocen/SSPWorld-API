const express = require('express');

const error = require('../middleware/error');
const nonExistingRoute = require('../middleware/nonExistingRoute');

const apiv1 = require('../routes/APIV1');

module.exports = function(app) {

    app.use(express.json());

    app.use('/api/v1', apiv1);

    app.all('*', nonExistingRoute);

    app.use(error);
}
