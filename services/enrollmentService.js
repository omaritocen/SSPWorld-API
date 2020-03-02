const mongoose = require('mongoose');

const Enrollment = require('../models/enrollment');

const getEnrollment = async (id) => {
    const enrollment = await Enrollment.findById(id);
    return enrollment;
}

const getEnrollmentsByStudentId = async (studentId) => {
    const enrollments = await Enrollment.find({_studentId: studentId});
    return enrollments;
}


const saveEnrollment = async (enrollment) => {
    enrollment = await enrollment.save();
    return enrollment;
}

const deleteEnrollment = async (id) => {
    const enrollment = await Enrollment.findByIdAndDelete(id);
    return enrollment;
}

module.exports = {
    getEnrollment,
    getEnrollmentsByStudentId,
    saveEnrollment,
    deleteEnrollment
}