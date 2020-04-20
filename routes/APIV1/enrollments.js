const express = require('express');

const router = express.Router();

const auth = require('../../middleware/auth');
const validId = require('../../middleware/validid');
const validateEnrollment = require('../../middleware/validations/validateEnrollment');

const enrollmentController = require('../../controllers/enrollmentController');

router.post('/', [auth, validateEnrollment], enrollmentController.postEnrollment);

router.delete('/:id', [auth, validId], enrollmentController.deleteEnrollment);

module.exports = router;
