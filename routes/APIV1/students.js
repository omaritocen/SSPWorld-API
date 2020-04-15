const express = require('express');

const router = express.Router();

const auth = require('../../middleware/auth');

const studentController = require('../../controllers/studentController');

router.get('/:id', auth, studentController.getStudentById);

router
    .route('/')
    .get(auth, studentController.getStudent)
    .post(auth, studentController.postStudent)
    .put(auth, studentController.updateStudent);

module.exports = router;
