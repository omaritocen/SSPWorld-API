const _ = require('lodash');

const AppError = require('../utils/appError');
const courseService = require('../services/courseService');
const updateService = require('../services/updateService');
const studentService = require('../services/studentService');
const enrollmentService = require('../services/enrollmentService');
const Update = require('../models/update');

//TODO: Implement tests for this route
module.exports.getStudentUpdates = async (req, res, next) => {
    const userId = req.user._id;

    const studentProfile = await studentService.alreadyHasProfile(userId);
    if (!studentProfile) return next(new AppError('User does not have a student profile.', 400));

    const enrollments = await enrollmentService.getEnrollmentsByStudentId(studentProfile._id);
    if (!enrollments) return next(new AppError('User is not enrolled in any course', 404));

    const coursesIds = enrollments.map(a => a._courseId);
    const updates = await updateService.getUpdatesByCoursesIds(coursesIds);

    if (!updates) return next(new AppError('No updates found for this student', 404));

    res.send(updates);
};

module.exports.getUpdatesByCourseId = async (req, res, next) => {
    const courseId = req.params.id;
    
    const course = await courseService.getCourse(courseId);
    if (!course)
        return next(new AppError('No course with this id is found.', 404));

    const updates = await updateService.getUpdatesByCourseId(courseId);
    
    res.send(updates);
    
};

module.exports.getUpdateById = async (req, res, next) => {
    const id = req.params.id;
    
    let update = await updateService.getUpdate(id);
    if (!update)
        return next(new AppError('No update with this ID is found', 404));

    res.send(update);
}

module.exports.postUpdate = async (req, res, next) => {
    const userId = req.user._id;

    const course = await courseService.getCourse(req.body._courseId);
    if (!course) next(new AppError('There is no course with this id is found', 400));

    let update = new Update(_.pick(req.body, ['_courseId', 'body', 'title', 'startDate', 'deadline']));
    update._userId = userId;
    update = await updateService.saveUpdate(update);

    res.status(201).send(update);
};

module.exports.updateUpdate = async (req, res, next) => {
    const id = req.params.id;
    const userId = req.user._id;

    let update = await updateService.getUpdate(id);

    if (!update)
        return next(new AppError('No update with this ID is found', 404));

    if (update._userId.toString() !== userId)
        return next(new AppError('Access denied', 403));

    req.body = _.pick(req.body, ['_courseId', 'title','body', 'startDate', 'deadline']);
    req.body._userId = userId;

    update = await updateService.updateUpdate(id, req.body);
    res.send(update);
};

module.exports.deleteUpdate = async (req, res, next) => {
    const id = req.params.id;
    const userId = req.user._id
    
    let update = await updateService.getUpdate(id);

    if (!update)
        return next('No update with this ID is found', 404);

    if (update._userId.toString() !== userId)
        return next(new AppError('Access denied', 403));;
    
    update = await updateService.deleteUpdate(id);
    res.send(update);
};
