const express = require('express');
const _ = require('lodash');

const router = express.Router();

const Student = require('../models/student');
const studentService = require('../services/studentService');
const auth = require('../middleware/auth');
const {isValidObjectId} = require('mongoose');

router.get('/:id', auth, async (req, res) => {
    const id = req.params.id;
    if (!isValidObjectId(id)) 
        return res.status(400).send('Invalid Id');
    
    const student = await studentService.getStudent(id);
    if (!student) return res.status(404).send('No student with this id is found');

    res.send(student);
});

router.post('/', auth, async (req, res) => {
    const userId = req.user._id;
    req.body._userId = userId;
    const {error} = Student.validateStudent(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let student = await studentService.alreadyHasProfile(userId);
    if (student) return res.status(400).send('User already has a student profile.');

    student = new Student(_.pick(req.body, ['firstName', 'lastName', 'image', 'year', 'department']));
    student._userId = userId;
    student = await studentService.saveStudent(student);

    res.status(201).send(student);
});

router.put('/:id', auth, async (req, res) => {
    const id = req.params.id;
    const userId = req.user._id;
    req.body._userId = userId;

    const {error} = Student.validateStudent(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let student = await studentService.getStudent(id);
    if (!student) return res.status(404).send('No student with this id is found');

    student = await studentService.updateStudent(id, req.body, ['firstName', 'lastName', 'image', 'year', 'department', '_userId']);
    res.send(student);
});

// WILL BE DECIDED WETHER TO ADD GET ALL OR DELTE

module.exports = router;