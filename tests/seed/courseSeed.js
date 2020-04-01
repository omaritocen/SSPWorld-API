const {ObjectID} = require('mongodb');

const Course = require('../../models/course');

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
    populateCourses
}