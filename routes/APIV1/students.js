const express = require('express');

const router = express.Router();

const auth = require('../../middleware/auth');
const validid = require('../../middleware/validid');

const studentController = require('../../controllers/studentController');
const updateController = require('../../controllers/updateController');

const enrollmentsRouter = require('../../routes/APIV1/enrollments');

router.use('/enrollments', enrollmentsRouter);

router.get('/updates', auth, updateController.getStudentUpdates);

router.get('/:id', [auth, validid], studentController.getStudentById);

router
    .route('/')
    .get(auth, studentController.getStudent)
    .post(auth, studentController.postStudent)
    .put(auth, studentController.updateStudent);

module.exports = router;
