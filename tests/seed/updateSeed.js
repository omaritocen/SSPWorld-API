const {ObjectID} = require('mongodb');

const Update = require('../../models/update');
const {courses} = require('../seed/courseSeed');
const {users} = require('../seed/mockedUsersSeed');

const updates = [{
    _id: new ObjectID(),
    _courseId: courses[0]._id,
    _userId: users[0]._id,
    title: 'first update course 1',
    body: 'the body of first update to first course',
    startDate: Date.now(),
    deadline: Date.now()
}, {
    _id: new ObjectID(),
    _courseId: courses[0]._id,
    _userId: users[1]._id,
    title: 'second update course 1',
    body: 'the body of second update to first course',
    startDate: Date.now(),
    deadline: Date.now()
}, {
    _id: new ObjectID(),
    _courseId: courses[0]._id,
    _userId: users[2]._id,
    title: 'first update course 2',
    body: 'the body of first update to second course',
    startDate: Date.now(),
    deadline: Date.now()  
}];

const populateUpdates = function (done) {
    Update.deleteMany({}).then(() => {
        Update.insertMany(updates).then(() => done());
    });
}

module.exports = {
    updates,
    populateUpdates
}