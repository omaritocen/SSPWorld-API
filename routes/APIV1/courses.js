const express = require('express');

const router = express.Router();

const courseController = require('../../controllers/courseController');
const updatesController = require('../../controllers/updateController');

const auth = require('../../middleware/auth');
const admin = require('../../middleware/admin');
const validid = require('../../middleware/validid');

//TODO: IT'S NOW A QUERY PART OF THE / ROUTE AND NEEDS TO BE REMOVED

router.get(
    '/getCourseByCourseName',
    auth,
    courseController.getCourseByCourseName
);

router
    .route('/')
    .get(auth, courseController.getAllCourses)
    .post([auth, admin], courseController.createCourse);

//TODO: REMOVE THIS ROUTE IT'S CHANGED TO /student/enrollments/courses/
router.get('/getEnrolledCourses', auth, courseController.getEnrolledCourses);

router.post('/', [auth, admin], courseController.createCourse);

router
    .get('/:id/updates', [auth, validid], updatesController.getUpdatesByCourseId);

router
    .route('/:id')
    .get([auth , validid], courseController.getCourseById)
    .put([auth, admin, validid], courseController.updateCourse)
    .delete([auth, admin, validid], courseController.deleteCourse);

module.exports = router;
