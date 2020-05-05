const _ = require('lodash');

const AppError = require('../utils/appError');

const Student = require('./../models/student');
const studentService = require('../services/studentService');

module.exports.getStudentById = async (req, res, next) => {
    const id = req.params.id;
    const student = await studentService.getStudent(id);
    if (!student)
        return next(new AppError('No student with this id is found', 404));

    res.send(student);
};

module.exports.getStudent = async (req, res, next) => {
    const userId = req.user._id;
    const studentProfile = await studentService.alreadyHasProfile(userId);
    if (!studentProfile)
        return next(new AppError('No student profile is found for this user id', 404));
    res.send(studentProfile);
};

module.exports.postStudent = async (req, res, next) => {
    const userId = req.user._id;
    req.body._userId = userId;
    
    let student = await studentService.alreadyHasProfile(userId);
    if (student)
        return next(new AppError('User already has a student profile.', 400));

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

module.exports.updateStudent = async (req, res, next) => {
    const userId = req.user._id;
    req.body._userId = userId;

    let student = await studentService.alreadyHasProfile(userId);
    if (!student)
        return next(new AppError('No student profile is found for this user id', 404));

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
