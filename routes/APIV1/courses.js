const express = require('express');

const router = express.Router();

const courseController = require('../../controllers/courseController');
const updatesController = require('../../controllers/updateController');

const auth = require('../../middleware/auth');
const admin = require('../../middleware/admin');
const validid = require('../../middleware/validid');

router.get(
    '/getCourseByCourseName',
    auth,
    courseController.getCourseByCourseName
);

router
    .route('/')
    .get(auth, courseController.getAllCourses)
    .post([auth, admin], courseController.createCourse);

router.get('/getEnrolledCourses', auth, courseController.getEnrolledCourses);
router.post('/', [auth, admin], courseController.createCourse);

router
    .get('/:id/updates', auth, updatesController.getUpdatesByCourseId);

router
    .route('/:id')
    .get(auth, courseController.getCourseById)
    .put([auth, admin], courseController.updateCourse)
    .delete([auth, admin], courseController.deleteCourse);

module.exports = router;
