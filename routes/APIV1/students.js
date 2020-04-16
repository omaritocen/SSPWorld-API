const express = require('express');

const router = express.Router();

const auth = require('../../middleware/auth');
const validid = require('../../middleware/validid');

const studentController = require('../../controllers/studentController');
const updateController = require('../../controllers/updateController');
const enrollmentController = require('../../controllers/enrollmentController');

router.get('/updates', auth, updateController.getStudentUpdates);

router.get('/enrollments/courses/:courseId',auth, enrollmentController.getEnrollmentsByCourseId);;

router.get('/enrollments', auth, enrollmentController.getEnrollmentsByStudentId);

router.get('/:id', [auth, validid], studentController.getStudentById);

router
    .route('/')
    .get(auth, studentController.getStudent)
    .post(auth, studentController.postStudent)
    .put(auth, studentController.updateStudent);

module.exports = router;
