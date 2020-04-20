const express = require('express');

const router = express.Router();

const courseController = require('../../controllers/courseController');
const updatesController = require('../../controllers/updateController');

const auth = require('../../middleware/auth');
const admin = require('../../middleware/admin');
const validid = require('../../middleware/validid');
const validateCourse = require('../../middleware/validations/validateCourse');;

router
    .route('/')
    .get(auth, courseController.getAllCourses)
    .post([auth, admin, validateCourse], courseController.createCourse);

router.get(
    '/:id/updates',
    [auth, validid],
    updatesController.getUpdatesByCourseId
);

router
    .route('/:id')
    .get([auth, validid], courseController.getCourseById)
    .put([auth, admin, validid, validateCourse], courseController.updateCourse)
    .delete([auth, admin, validid], courseController.deleteCourse);

module.exports = router;
