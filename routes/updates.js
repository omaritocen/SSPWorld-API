const express = require('express');
const _ = require('lodash');

const router = express.Router();

const Update = require('../models/update');
const updateService = require('../services/updateService');
const courseService = require('../services/courseService');
const studentService = require('../services/studentService');
const enrollmentService = require('../services/enrollmentService');
const auth = require('../middleware/auth');
const announcer = require('../middleware/announcer');
const {isValidObjectId} = require('mongoose');

// TODO: WHOLE PROJECT DOUBLE CALLS TO DATABASE, RETHINK ABOUT BUSSNIESS LOGIC HIREACHY

router.get('/getStudentUpdates', auth, async (req, res) => {
    const userId = req.user._id;

    const studentProfile = await studentService.alreadyHasProfile(userId);
    if (!studentProfile) return res.status(400).send('User does not have a student profile.');

    const enrollments = await enrollmentService.getEnrollmentsByStudentId(studentProfile._id);
    if (!enrollments) return res.status(404).send('User is not enrolled in any course');

    const coursesIds = enrollments.map(a => a._courseId);
    const updates = await updateService.getUpdatesByCoursesIds(coursesIds);

    if (!updates) return res.status(404).send('No updates found for this student');

    res.send(updates);
    
});

router.get('/:id', auth, async (req, res) => {
    const id = req.params.id;

    if (!isValidObjectId(id))
        return res.status(400).send('Invalid ID');
    
    let update = await updateService.getUpdate(id);
    if (!update)
        return res.status(404).send('No update with this ID is found');

    res.send(update);
});

// TODO: CHANGE THE ROUTE
router.get('/getUpdatesByCourseId/:id', auth, async (req, res) => {
    const courseId = req.params.id;

    if (!isValidObjectId(courseId))
        return res.status(400).send('Invalid ID');
    
    const course = await courseService.getCourse(courseId);
    if (!course)
        return res.status(404).send('No course with this id is found.');

    const updates = await updateService.getUpdatesByCourseId(courseId);
    if (!updates)
        return res.status(404).send('No updates is found for this course.');
    
    res.send(updates);
});

router.post('/', [auth, announcer], async (req, res) => {
    const userId = req.user._id;
    const {error} = Update.validateUpdate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let update = new Update(_.pick(req.body, ['_courseId', 'body', 'title', 'startDate', 'deadline']));
    update._userId = userId;
    update = await updateService.saveUpdate(update);

    res.send(update);
});

router.put('/:id', [auth, announcer], async (req, res) => {
    const id = req.params.id;
    const userId = req.user._id;

    if (!isValidObjectId(id))
        return res.status(400).send('Invalid ID');

    const {error} = Update.validateUpdate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let update = await updateService.getUpdate(id);

    if (!update)
        return res.status(404).send('No update with this ID is found');

    if (update._userId.toString() !== userId)
        return res.status(403).send('Access denied');

    req.body = _.pick(req.body, ['_courseId', 'title','body', 'startDate', 'deadline']);
    req.body._userId = userId;

    update = await updateService.updateUpdate(id, req.body);
    res.send(update);
});

router.delete('/:id', [auth, announcer], async (req, res) => {
    const id = req.params.id;
    if (!isValidObjectId(id))
        return res.status(400).send('Invalid ID');
    
    let update = await updateService.getUpdate(id);
    if (!update)
        return res.status(404).send('No update with this ID is found');
    if (update._userId.toString() !== req.user._id)
        return res.status(403).send('Access denied');
    
    update = await updateService.deleteUpdate(id);
    res.send(update);
});

module.exports = router;