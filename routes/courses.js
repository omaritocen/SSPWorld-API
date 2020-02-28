const express = require('express');
const _ = require('lodash');
const Joi = require('@hapi/joi');

const router = express.Router();

const Course = require('../models/course');
const courseService = require('../services/courseService');

router.get('/', async (req, res) => {
    const courses = await courseService.getCourses();
    res.send(courses);
});

router.post('/', async (req, res) => {
    const {error} = Course.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const course = new Course(_.pick(req.body, ['name', 'creditHours', 'courseType', 'term']));
    course = await courseService.saveCourse(course);
    res.send(course);
});

module.exports = router;