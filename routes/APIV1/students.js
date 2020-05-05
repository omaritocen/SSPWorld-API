const express = require('express');

const router = express.Router();

const auth = require('../../middleware/auth');
const validid = require('../../middleware/validid');
const validateStudent = require('../../middleware/validations/validateStudent');

const studentController = require('../../controllers/studentController');
const updateController = require('../../controllers/updateController');

const enrollmentsRouter = require('../../routes/APIV1/enrollments');

router.param('id', validid);

router.use('/enrollments', enrollmentsRouter);

router.get('/updates', auth, updateController.getStudentUpdates);

router.get('/:id', auth, studentController.getStudentById);

router
    .route('/')
    .get(auth, studentController.getStudent)
    .post([auth, validateStudent], studentController.postStudent)
    .put([auth, validateStudent], studentController.updateStudent);

module.exports = router;
