const _ = require('lodash');

const courseService = require('../services/courseService');
const updateService = require('../services/updateService');
const studentService = require('../services/studentService');
const enrollmentService = require('../services/enrollmentService');
const Update = require('../models/update');
const {isValidObjectId} = require('mongoose');

module.exports.getStudentUpdates = async (req, res) => {
    const userId = req.user._id;

    const studentProfile = await studentService.alreadyHasProfile(userId);
    if (!studentProfile) return res.status(400).send('User does not have a student profile.');

    const enrollments = await enrollmentService.getEnrollmentsByStudentId(studentProfile._id);
    if (!enrollments) return res.status(404).send('User is not enrolled in any course');

    const coursesIds = enrollments.map(a => a._courseId);
    const updates = await updateService.getUpdatesByCoursesIds(coursesIds);

    if (!updates) return res.status(404).send('No updates found for this student');

    res.send(updates);
};

module.exports.getUpdatesByCourseId = async (req, res) => {
    const courseId = req.params.id;
    
    const course = await courseService.getCourse(courseId);
    if (!course)
        return res.status(404).send({error: 'No course with this id is found.'});

    const updates = await updateService.getUpdatesByCourseId(courseId);
    
    res.send(updates);
    
};

module.exports.getUpdateById = async (req, res) => {
    const id = req.params.id;
    
    let update = await updateService.getUpdate(id);
    if (!update)
        return res.status(404).send({error: 'No update with this ID is found'});

    res.send(update);
}

module.exports.postUpdate = async (req, res) => {
    const userId = req.user._id;

    const {error} = Update.validateUpdate(req.body);
    if (error) return res.status(400).send({error: error.details[0].message});

    const course = await courseService.getCourse(req.body._courseId);
    if (!course) return res.status(400).send({error: 'There is no course with this id is found'});

    let update = new Update(_.pick(req.body, ['_courseId', 'body', 'title', 'startDate', 'deadline']));
    update._userId = userId;
    update = await updateService.saveUpdate(update);

    res.status(201).send(update);
};

module.exports.updateUpdate = async (req, res) => {
    const id = req.params.id;
    const userId = req.user._id;

    const {error} = Update.validateUpdate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let update = await updateService.getUpdate(id);

    if (!update)
        return res.status(404).send({error: 'No update with this ID is found'});

    if (update._userId.toString() !== userId)
        return res.status(403).send({error: 'Access denied'});

    req.body = _.pick(req.body, ['_courseId', 'title','body', 'startDate', 'deadline']);
    req.body._userId = userId;

    update = await updateService.updateUpdate(id, req.body);
    res.send(update);
};

module.exports.deleteUpdate = async (req, res) => {
    const id = req.params.id;
    const userId = req.user._id
    
    let update = await updateService.getUpdate(id);

    if (!update)
        return res.status(404).send({error: 'No update with this ID is found'});

    if (update._userId.toString() !== userId)
        return res.status(403).send({error: 'Access denied'});
    
    update = await updateService.deleteUpdate(id);
    res.send(update);
};
