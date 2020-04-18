const express = require('express');

const router = express.Router();

const auth = require('../../middleware/auth');
const validId = require('../../middleware/validid');

const enrollmentController = require('../../controllers/enrollmentController');

router.post('/', auth, enrollmentController.postEnrollment);

// TODO: CHANGE SSPWORLD THEN REMOVE IT 

router.get('/getEnrollmentsByStudentId/:id',auth, enrollmentController.getEnrollmentsByStudentId);

// TODO:  GET student/enrollments/course remove this after changing sspworld

router.get('/isEnrolled/:courseId', auth, enrollmentController.getEnrollmentsByCourseId);


//TODO: I HAVE NO IDEA WHY ON EARTH I MADE THIS FUCKING THING
// TODO: CHANGE TO DELETE student/enrollments/courses/:id

router.delete('/deleteByCourseId/:courseId', auth, enrollmentController.deleteEnrollmentByCourseId);

router.delete('/:id', [auth, validId], enrollmentController.deleteEnrollment);

module.exports = router;