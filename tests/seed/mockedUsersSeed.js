const jwt = require('jsonwebtoken');
const config = require('config');
const {ObjectID} = require('mongodb');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
    _id: userOneId,
    email: 'fares@example.com',
    password: 'userOnePass',
    token: jwt.sign({_id: userOneId, role: 'student'}, config.get('jwtPrivateKey'))
}, {
    _id: userTwoId,
    email: 'jen@example.com',
    password: 'userTwoPass',
    token: jwt.sign({_id: userOneId, role: 'admin'}, config.get('jwtPrivateKey'))
}];

module.exports = {
    users
}