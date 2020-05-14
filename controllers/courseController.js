const _ = require('lodash');

const AppError = require('../utils/appError');
const QueryUtils = require('../utils/queryUtils');
const express = require('express');
const Course = require('../models/course');
const courseService = require('../services/courseService');
const studentService = require('../services/studentService');
const enrollmentService = require('../services/enrollmentService');

module.exports.getAllCourses = async (req, res, next) => {
    
    const queryUtils = new QueryUtils(Course.find(), req.query).filter().sort();
    const courses = await queryUtils.query;

    res.send(courses);
};

module.exports.getCourseById = async (req, res, next) => {
    const id = req.params.id;

    const course = await courseService.getCourse(id);
    if (!course)
        return next(new AppError('No course with this ID is found.', 404));

    res.send(course);
};

module.exports.createCourse = async (req, res, next) => {
    let course = new Course(
        _.pick(req.body, ['name', 'creditHours', 'courseType', 'term'])
    );
    course = await courseService.saveCourse(course);
    res.status(201).send(course);
};

module.exports.getCourseByCourseName = async (req, res, next) => {
    const courseName = req.query.courseName;

    const course = await courseService.getCourseByCourseName(courseName);
    if (!course)
        return next(new AppError('No course with this name is found', 404));

    res.send(course);
};

module.exports.getEnrolledCourses = async (req, res, next) => {
    const userId = req.user._id;

    const student = await studentService.alreadyHasProfile(userId);
    if (!student)
        return next(new AppError('User does not have a student profile', 400));

    const enrollments = await enrollmentService.getEnrollmentsByStudentId(
        student._id
    );

    if (!enrollments) return res.send([]); // Debatable if an empty array or a bad request should be sent;

    const coursesIds = enrollments.map((e) => e._courseId);
    const courses = await courseService.getMultipleCourses(coursesIds);

    res.send(courses);
};

module.exports.updateCourse = async (req, res, next) => {
    const id = req.params.id;

    // TODO: CHECK IF THERE IS A WAY TO SEE IF THE ERROR IS NOT ID ONLY INVOLVED
    const body = _.pick(req.body, [
        'name',
        'creditHours',
        'courseType',
        'term',
    ]);
    const course = await courseService.updateCourse(id, body);
    if (!course)
        return next(new AppError('No course with this ID is found.', 404));

    res.send(course);
};

module.exports.deleteCourse = async (req, res, next) => {
    const id = req.params.id;

    const course = await courseService.deleteCourse(id);
    if (!course)
        return next(new AppError('No course with this ID is found.', 404));

    res.send(course);
};
