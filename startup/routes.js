const express = require('express');

const error = require('../middleware/error');

const apiv1 = require('../routes/APIV1');

module.exports = function(app) {

    app.use(express.json());

    app.use('/api/v1', apiv1);

    app.use(error);
}
