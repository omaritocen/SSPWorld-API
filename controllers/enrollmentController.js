const _ = require('lodash');

const AppError = require('../utils/appError');
const Enrollment = require('../models/enrollment');
const studentService = require('../services/studentService');
const enrollmentService = require('../services/enrollmentService');
const courseService = require('../services/courseService');

module.exports.postEnrollment = async (req, res, next) => {
    const userId = req.user._id;
    const courseId = req.body._courseId;

    const studentProfile = await studentService.alreadyHasProfile(userId);
    if (!studentProfile)
        return next(new AppError('User does not have a student profile.', 400));

    const course = await courseService.getCourse(courseId);
    if (!course)
        return next(new AppError('No course with this ID is found.', 404))

    const isEnrolled = await enrollmentService.isEnrolled(
        studentProfile._id,
        course._id
    );

    if (isEnrolled)
        return next(new AppError('User is already enrolled in this course', 400));

    let enrollment = new Enrollment(_.pick(req.body, ['_courseId']));
    enrollment._studentId = studentProfile._id;

    enrollment = await enrollmentService.saveEnrollment(enrollment);
    res.status(201).send(enrollment);
};

module.exports.deleteEnrollment = async (req, res, next) => {
    const id = req.params.id;
    const userId = req.user._id;

    let enrollment = await enrollmentService.getEnrollment(id);
    if (!enrollment)
        return next(new AppError('No enrollment with this id is found', 404));

    const student = await studentService.alreadyHasProfile(userId);

    if (enrollment._studentId.toString() !== student._id.toString())
        return next(new AppError('Access Denied', 401));

    enrollment = await enrollmentService.deleteEnrollment(id);

    res.send(enrollment);
};

module.exports.getEnrollmentsByStudentId = async (req, res, next) => {
    const userId = req.user._id;

    const studentProfile = await studentService.alreadyHasProfile(userId);
    if (!studentProfile)
        return next(new AppError('User does not have a student profile', 404));

    const studentId = studentProfile._id;

    const enrollments = await enrollmentService.getEnrollmentsByStudentId(
        studentId
    );
    if (!enrollments) return res.status(200).send([]);

    res.send(enrollments);
};

module.exports.getEnrollmentsByCourseId = async (req, res, next) => {
    const courseId = req.params.courseId;
    const userId = req.user._id;

    const course = await courseService.getCourse(courseId);
    if (!course)
        return next(new AppError('No course with this id is found', 404));

    const studentProfile = await studentService.alreadyHasProfile(userId);
    if (!studentProfile)
        return next (new AppError('User does not have a student profile', 400));

    const enrollment = await enrollmentService.isEnrolled(
        studentProfile._id,
        courseId
    );
    if (!enrollment)
        return next(new AppError('No enrollment for this student with this course id', 404));

    res.send(enrollment);
};

module.exports.deleteEnrollmentByCourseId = async (req, res, next) => {
    const courseId = req.params.courseId;
    const userId = req.user._id;

    const course = await courseService.getCourse(courseId);
    if (!course)
        return next(new AppError('No course with this id is found', 404));

    const studentProfile = await studentService.alreadyHasProfile(userId);
    if (!studentProfile)
        return next(new AppError('User does not have a student profile', 400));

    const enrollment = await enrollmentService.deleteEnrollmentByCourseId(
        studentProfile._id,
        courseId
    );
    if (!enrollment)
        return next(new AppError('No enrollment for this student with this course id', 404));

    res.send(enrollment);
};
