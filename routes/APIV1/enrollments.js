const express = require('express');

const router = express.Router({ mergeParams: true });

const auth = require('../../middleware/auth');
const validid = require('../../middleware/validid');
const validateEnrollment = require('../../middleware/validations/validateEnrollment');

const enrollmentController = require('../../controllers/enrollmentController');
const courseController = require('../../controllers/courseController');

router.param('id', validid);

// GET /students/enrollments/
// POST /students/enrollments/
router
    .get('/', auth, enrollmentController.getEnrollmentsByStudentId)
    .post('/', [auth, validateEnrollment], enrollmentController.postEnrollment);

// DELETE /students/enrollments/:id
router.delete('/:id', auth, enrollmentController.deleteEnrollment);

// GET /students/enrollments/courses/
router.get('/courses/', auth, courseController.getEnrolledCourses);

// GET /students/enrollments/courses/:courseId
// DELETE /students/enrollments/courses/:courseId
router.route('/courses/:courseId')
    .get(auth, enrollmentController.getEnrollmentsByCourseId)
    .delete(auth, enrollmentController.deleteEnrollmentByCourseId);


module.exports = router;
