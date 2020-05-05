const express = require('express');

const router = express.Router();
const userController = require('../../controllers/userController');
const validateRegisterUser = require('../../middleware/validations/validateRegisterUser');

// POST /users/
router.post('/', validateRegisterUser, userController.registerUser);

module.exports = router;