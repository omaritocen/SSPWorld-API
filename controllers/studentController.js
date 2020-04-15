const _ = require('lodash');

const Student = require('./../models/student');
const studentService = require('../services/studentService');
const { isValidObjectId } = require('mongoose');

module.exports.getStudentById = async (req, res) => {
    const id = req.params.id;
    const student = await studentService.getStudent(id);
    if (!student)
        return res
            .status(404)
            .send({ error: 'No student with this id is found' });

    res.send(student);
};

module.exports.getStudent = async (req, res) => {
    const userId = req.user._id;
    const studentProfile = await studentService.alreadyHasProfile(userId);
    if (!studentProfile)
        return res
            .status(404)
            .send({ error: 'No student profile is found for this user id' });
    res.send(studentProfile);
};

module.exports.postStudent = async (req, res) => {
    const userId = req.user._id;
    req.body._userId = userId;

    const { error } = Student.validateStudent(req.body);
    if (error) return res.status(400).send({ error: error.details[0].message });

    let student = await studentService.alreadyHasProfile(userId);
    if (student)
        return res
            .status(400)
            .send({ error: 'User already has a student profile.' });

    student = new Student(
        _.pick(req.body, [
            'firstName',
            'lastName',
            'image',
            'year',
            'department',
        ])
    );
    student._userId = userId;
    student = await studentService.saveStudent(student);

    res.status(201).send(student);
}

module.exports.updateStudent = async (req, res) => {
    const userId = req.user._id;
    req.body._userId = userId;

    const { error } = Student.validateStudent(req.body);
    if (error) return res.status(400).send({error: error.details[0].message});

    let student = await studentService.alreadyHasProfile(userId);
    if (!student)
        return res
            .status(404)
            .send({ error: 'No student profile is found for this user id' });

    student = await studentService.updateStudent(student._id, req.body, [
        'firstName',
        'lastName',
        'image',
        'year',
        'department',
        '_userId'
    ]);

    res.send(student);
}
