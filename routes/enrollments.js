const express = require('express');
const _ = require('lodash');

const router = express.Router();

const Enrollment = require('../models/enrollment');
const enrollmentService = require('../services/enrollmentService');
const studentService = require('../services/studentService');
const auth = require('../middleware/auth');
const {isValidObjectId} = require('mongoose');

router.post('/', auth, async (req, res) => {
    const userId = req.user._id;

    const {error} = Enrollment.validateEnrollment(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const studentProfile = await studentService.alreadyHasProfile(userId);
    if (!studentProfile) return res.status(400).send('User does not have a student profile.');

    if (studentProfile._id.toString() !== req.body._studentId)
        return res.status(401).send('Access Denied');
    
    let enrollment = new Enrollment(_.pick(req.body, ['_studentId', '_courseId']));
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