const express = require('express');
const _ = require('lodash');

const router = express.Router();

const Course = require('../models/course');
const courseService = require('../services/courseService');
const studentService = require('../services/studentService');
const enrollmentService = require('../services/enrollmentService');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const {isValidObjectId} = require('mongoose');

router.get('/', auth, async (req, res) => {
    const courses = await courseService.getCourses();
    res.send(courses);
});

router.get('/getEnrolledCourses', auth, async (req, res) => {
    const userId = req.user._id;

    const student = await studentService.alreadyHasProfile(userId);
    if (!student) return res.status(400).send({error: 'User does not have a student profile'});

    const enrollments = await enrollmentService.getEnrollmentsByStudentId(student._id);
    if (!enrollments) return res.send([]); // Debatable if an empty array or a bad request should be sent;

    const coursesIds = enrollments.map(e => e._courseId);
    const courses = await courseService.getMultipleCourses(coursesIds);

    res.send(courses);
});

router.get('/:id', auth, async (req, res) => {
    const id = req.params.id;
    if (!isValidObjectId(id)) return res.status(400).send({error: 'Invalid ID'});

    const course = await courseService.getCourse(id);
    if (!course) return res.status(404).send({error: 'No course with this ID is found.'});

    res.send(course);
});

router.post('/', [auth, admin], async (req, res) => {
    const {error} = Course.validate(req.body);
    if (error) return res.status(400).send({error: error.details[0].message});
    let course = new Course(_.pick(req.body, ['name', 'creditHours', 'courseType', 'term']));
    course = await courseService.saveCourse(course);
    res.status(201).send(course);
});

router.put('/:id',[auth, admin], async (req, res) => {
    const id = req.params.id;
    if (!isValidObjectId(id)) return res.status(400).send({error: 'Invalid ID'});

    const {error} = Course.validate(req.body);
    if (error) return res.status(400).send({error: error.details[0].message});  


    // TODO: CHECK IF THERE IS A WAY TO SEE IF THE ERROR IS NOT ID ONLY INVOLVED
    const body = _.pick(req.body, ['name', 'creditHours', 'courseType', 'term']);
    const course = await courseService.updateCourse(id, body);
    if (!course) return res.status(404).send({error: 'No course with this ID is found.'});

    res.send(course);
});

router.delete('/:id', [auth, admin], async (req, res) => {
    const id = req.params.id;
    if (!isValidObjectId(id)) return res.status(400).send({error: 'Invalid ID'});

    const course = await courseService.deleteCourse(id);
    if (!course) return res.status(404).send({error: 'No course with this ID is found.'});

    res.send(course);
});

module.exports = router;