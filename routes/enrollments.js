const express = require('express');
const _ = require('lodash');

const router = express.Router();

const Enrollment = require('../models/enrollment');
const enrollmentService = require('../services/enrollmentService');
const studentService = require('../services/studentService');
const courseService = require('../services/courseService');
const auth = require('../middleware/auth');
const {isValidObjectId} = require('mongoose');

router.post('/', auth, async (req, res) => {
    const userId = req.user._id;

    const {error} = Enrollment.validateEnrollment(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const studentProfile = await studentService.alreadyHasProfile(userId);
    if (!studentProfile) return res.status(400).send('User does not have a student profile.');

    let enrollment = new Enrollment(_.pick(req.body, ['_courseId']));
    enrollment._studentId = studentProfile._id;
    
    enrollment = await enrollmentService.saveEnrollment(enrollment);
    res.status(201).send(enrollment);
});

router.get('/getEnrollmentsByStudentId/:id',auth, async (req, res) => {
    const studentId = req.params.id;
    const userId = req.user._id;

    const studentProfile = await studentService.alreadyHasProfile(userId);
    if (!studentProfile) return res.status(400).send('User does not have a student profile.');

    if (studentProfile._id.toString() !== studentId)
        return res.status(401).send('Access Denied');

    const enrollments = await enrollmentService.getEnrollmentsByStudentId(studentId);
    if (!enrollments) return res.status(404).send('No enrollments found for this student');

    res.send(enrollments);
});

router.get('/isEnrolled/:courseId', auth, async (req, res) => {
    const courseId = req.params.courseId;
    const userId = req.user._id;

    const course = await courseService.getCourse(courseId);
    if (!course) return res.status(400).send('No course with this id is found');

    const studentProfile = await studentService.alreadyHasProfile(userId);
    if (!studentProfile) return res.status(400).send('User does not have a student profile.');

    const enrollment = await enrollmentService.isEnrolled(studentProfile._id, courseId);
    if (!enrollment) return res.status(404).send('No enrollment for this student with this course id');

    res.send(enrollment);
});

router.delete('/deleteByCourseId/:courseId', auth, async (req, res) => {
    const courseId = req.params.courseId;
    const userId = req.user._id;

    const course = await courseService.getCourse(courseId);
    if (!course) return res.status(400).send('No course with this id is found');

    const studentProfile = await studentService.alreadyHasProfile(userId);
    if (!studentProfile) return res.status(400).send('User does not have a student profile.');

    const enrollment = await enrollmentService.deleteEnrollmentByCourseId(studentProfile._id, courseId);
    if (!enrollment) return res.status(404).send('No enrollment for this student with this course id');

    res.send(enrollment);
});

router.delete('/:id', auth, async (req, res) => {
    const id = req.params.id;
    const userId = req.user._id;

    if (!isValidObjectId(id))
        return res.status(400).send('Invalid ID');

    let enrollment = await enrollmentService.getEnrollment(id);
    if (!enrollment) return res.status(404).send('No enrollment with this id is found');

    const student = await studentService.alreadyHasProfile(userId);

    if (enrollment._studentId.toString() !== student._id.toString())
        return res.status(401).send('Access Denied');
    
    enrollment = await enrollmentService.deleteEnrollment(id);

    res.send(enrollment);
});


module.exports = router;