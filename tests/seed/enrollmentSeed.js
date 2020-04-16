const {ObjectID} = require('mongodb');

const Enrollment = require('../../models/enrollment');
const {courses} = require('./courseSeed');
const {students} = require('./studentSeed');

const enrollments = [{
    _id: new ObjectID,
    _courseId: courses[0]._id,
    _studentId: students[0]._id
}, {
    _courseId: courses[0]._id,
    _studentId: students[1]._id
}, {
    _courseId: courses[0]._id,
    _studentId: students[1]._id
}];

const populateEnrollments = function (done) {
    Enrollment.deleteMany({}).then(() => {
        Enrollment.insertMany(enrollments).then(() => done());
    });
}

module.exports = {
    enrollments,
    populateEnrollments
}