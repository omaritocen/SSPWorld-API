const express = require('express');

const router = express.Router();

const userController = require('../../controllers/userController');
const validateLoginUser = require('../../middleware/validations/validateLoginUser');

// POST /auth/
router.post('/', validateLoginUser, userController.loginUser);

module.exports = router;