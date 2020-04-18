const mongoose = require('mongoose');

const Course = require('../models/course');

const getCourses = async (query) => {
    const courses = await Course.find(query);
    return courses;
};

const getCourse = async (id) => {
    const course = await Course.findById(id);
    return course;
}

const getCourseByCourseName = async (name) => {
    const course = await Course.findOne({name: name});
    return course;
}

const getMultipleCourses = async (ids) => {
    const courses = await Course.find({_id: {$in: ids}});
    return courses;
}

const saveCourse = async (course) => {
    course = await course.save();
    return course;
};

const updateCourse = async (id, body) => {
    const course = Course.findByIdAndUpdate(id, body, {new: true});
    return course;
}

const deleteCourse = async (id) => {
    const course = await Course.findByIdAndRemove(id);
    return course;
}

module.exports = {
    getCourses,
    getCourse,
    getCourseByCourseName,
    getMultipleCourses,
    saveCourse,
    updateCourse,
    deleteCourse
}