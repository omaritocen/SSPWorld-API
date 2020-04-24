const express = require('express');
const router = express.Router();

const courses = require('./courses');
const updates = require('./updates');
const students = require('./students');
const enrollments = require('./enrollments');
const users = require('./users');
const auth = require('./auth');

router.use('/courses', courses);
router.use('/updates', updates);
router.use('/students', students);
router.use('/users', users);
router.use('/auth', auth);

module.exports = router;
