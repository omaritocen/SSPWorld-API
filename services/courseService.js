const mongoose = require('mongoose');

const Course = require('../models/course');

const getCourses = async () => {
    const courses = await Course.find();
    return courses;
};

const saveCourse = async (course) => {
    course = await course.save();
    return course;
};

module.exports = {
    getCourses,
    saveCourse
}