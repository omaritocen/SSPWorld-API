const express = require('express');

const router = express.Router();

const auth = require('../../middleware/auth');
const validid = require('../../middleware/validid');

const studentController = require('../../controllers/studentController');
const updateController = require('../../controllers/updateController');
const courseController = require('../../controllers/courseController');
const enrollmentController = require('../../controllers/enrollmentController');

router.get('/updates', auth, updateController.getStudentUpdates);

router.get('/enrollments/courses/', auth, courseController.getEnrolledCourses);

router.route('/enrollments/courses/:courseId')
    .get(auth, enrollmentController.getEnrollmentsByCourseId)
    .delete(auth, enrollmentController.deleteEnrollmentByCourseId);

router.get('/enrollments', auth, enrollmentController.getEnrollmentsByStudentId);

router.get('/:id', [auth, validid], studentController.getStudentById);

router
    .route('/')
    .get(auth, studentController.getStudent)
    .post(auth, studentController.postStudent)
    .put(auth, studentController.updateStudent);

module.exports = router;
