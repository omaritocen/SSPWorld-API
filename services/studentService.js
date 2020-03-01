const mongoose = require('mongoose');

const Student = require('../models/student');

const getStudent = async (id) => {
    const student = await Student.findById(id);
    return student;
}

const saveStudent = async (student) => {
    student = await student.save();
    return student;
}

const updateStudent = async (id, body) => {
    const student = await Student.findByIdAndUpdate(id, body, {new: true});
    return student;
}

const alreadyHasProfile = async (id) => {
    const student = await Student.findOne({ _userId: id});
    return student;
}

module.exports = {
    getStudent,
    saveStudent,
    updateStudent,
    alreadyHasProfile
}