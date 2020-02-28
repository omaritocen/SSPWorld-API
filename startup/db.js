const mongoose = require('mongoose');
const config = require('config');

const url = config.get('mongoDB.url');
const opts = config.get('mongoDB.options');

mongoose.connect(url, opts);