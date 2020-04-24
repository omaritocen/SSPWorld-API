const express = require('express');

const router = express.Router();

const userController = require('../../controllers/userController');

// POST /auth/
router.post('/', userController.loginUser);

module.exports = router;