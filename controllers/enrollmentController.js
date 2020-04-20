const _ = require('lodash');

const Enrollment = require('../models/enrollment');
const studentService = require('../services/studentService');
const enrollmentService = require('../services/enrollmentService');
const courseService = require('../services/courseService');
const { isValidObjectId } = require('mongoose');

module.exports.postEnrollment = async (req, res) => {
    const userId = req.user._id;
    const courseId = req.body._courseId;

    const studentProfile = await studentService.alreadyHasProfile(userId);
    if (!studentProfile)
        return res
            .status(400)
            .send({ error: 'User does not have a student profile.' });

    const course = await courseService.getCourse(courseId);
    if (!course)
        return res
            .status(400)
            .send({ error: 'No course with this ID is found' });

    //TODO: CHECK IF THE ENROLLMENT ALREADY EXISTS AND ADD TEST CASES FOR IT

    let enrollment = new Enrollment(_.pick(req.body, ['_courseId']));
    enrollment._studentId = studentProfile._id;

    enrollment = await enrollmentService.saveEnrollment(enrollment);
    res.status(201).send(enrollment);
}

module.exports.deleteEnrollment = async (req, res) => {
    const id = req.params.id;
    const userId = req.user._id;

    let enrollment = await enrollmentService.getEnrollment(id);
    if (!enrollment) return res.status(404).send({error: 'No enrollment with this id is found'});

    const student = await studentService.alreadyHasProfile(userId);

    if (enrollment._studentId.toString() !== student._id.toString())
        return res.status(401).send({error: 'Access Denied'});
    
    enrollment = await enrollmentService.deleteEnrollment(id);

    res.send(enrollment);
}

module.exports.getEnrollmentsByStudentId = async (req, res) => {
    const userId = req.user._id;

    const studentProfile = await studentService.alreadyHasProfile(userId);
    if (!studentProfile) return res.status(404).send({error: 'User does not have a student profile'});

    const studentId = studentProfile._id;

    const enrollments = await enrollmentService.getEnrollmentsByStudentId(studentId);
    if (!enrollments) return res.status(200).send([]);

    res.send(enrollments);
}

module.exports.getEnrollmentsByCourseId = async (req, res) => {
    const courseId = req.params.courseId;
    const userId = req.user._id;

    const course = await courseService.getCourse(courseId);
    if (!course) return res.status(404).send({error: 'No course with this id is found'});

    const studentProfile = await studentService.alreadyHasProfile(userId);
    if (!studentProfile) return res.status(400).send({error: 'User does not have a student profile'});

    const enrollment = await enrollmentService.isEnrolled(studentProfile._id, courseId);
    if (!enrollment) return res.status(404).send({error: 'No enrollment for this student with this course id'});

    res.send(enrollment);
};

module.exports.deleteEnrollmentByCourseId = async (req, res) => {
    const courseId = req.params.courseId;
    const userId = req.user._id;

    const course = await courseService.getCourse(courseId);
    if (!course) return res.status(404).send({error: 'No course with this id is found'});

    const studentProfile = await studentService.alreadyHasProfile(userId);
    if (!studentProfile) return res.status(400).send({error: 'User does not have a student profile'});

    const enrollment = await enrollmentService.deleteEnrollmentByCourseId(studentProfile._id, courseId);
    if (!enrollment) return res.status(404).send({error: 'No enrollment for this student with this course id'});

    res.send(enrollment);
}


