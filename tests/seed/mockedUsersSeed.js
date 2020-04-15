const jwt = require('jsonwebtoken');
const config = require('config');
const {ObjectID} = require('mongodb');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const userThreeId = new ObjectID();
const userFourId = new ObjectID();
const userFiveId = new ObjectID();

const users = [{
    _id: userOneId,
    email: 'fares@example.com',
    password: 'userOnePass',
    token: jwt.sign({_id: userOneId, role: 'student'}, config.get('jwtPrivateKey'))
}, {
    _id: userTwoId,
    email: 'jen@example.com',
    password: 'userTwoPass',
    token: jwt.sign({_id: userTwoId, role: 'admin'}, config.get('jwtPrivateKey'))
}, {
    _id: userThreeId,
    email: 'mandoob@example.com',
    password: 'userThreePass',
    token: jwt.sign({_id: userThreeId, role: 'repre'}, config.get('jwtPrivateKey'))
}, {
    _id: userFourId,
    email: 'nobody@example.com',
    password: 'userFourPass',
    token: jwt.sign({_id: userFourId, role: 'student'}, config.get('jwtPrivateKey'))
}, {
    _id: userFiveId,
    email: 'nobody22@example.com',
    password: 'userFivePass',
    token: jwt.sign({_id: userFiveId, role: 'student'}, config.get('jwtPrivateKey'))
}];

module.exports = {
    users
}