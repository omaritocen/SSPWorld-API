const { ObjectID } = require('mongodb');

const Student = require('../../models/student');
const { users } = require('./mockedUsersSeed');

const students = [
    {
        _id: new ObjectID(),
        _userId: users[0]._id,
        firstName: 'Omar',
        lastName: 'Alaa',
        year: 'First',
        department: 'CCE',
        image: ''
    },
    {
        _id: new ObjectID(),
        _userId: users[3]._id,
        firstName: 'Fares',
        lastName: 'Ahmed',
        year: 'Second',
        department: 'EME',
        image: ''
    }
];

const populateStudents = (done) => {
    Student.deleteMany({})
        .then(() => {
            return Student.insertMany(students);
        })
        .then(() => done());
};

module.exports = {
    students,
    populateStudents,
};
