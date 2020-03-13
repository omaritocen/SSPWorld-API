const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');
const config = require('config');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const Course = require('../../models/course');

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

const courses = [{
    _id: new ObjectID(),
    name: 'Course1',
    creditHours: 3,
    courseType: 'Core',
    term: 'First'
}, {
    _id: new ObjectID(),
    name: 'Course2',
    creditHours: 2,
    courseType: 'Humanity',
    term: 'Second'
}];

const populateCourses = function(done) {
    //this.timeout(3000);
    Course.deleteMany({}).then(() => {
        return Course.insertMany(courses);
    }).then(() => done());
};

module.exports = {
    courses,
    users,
    populateCourses
}