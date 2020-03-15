const express = require('express');
const _ = require('lodash');

const router = express.Router();

const User = require('../models/user');
const userService = require('../services/userService');

router.post('/', async (req, res) => {
    const {error} = await User.validateLogin(req.body);
    if (error) return res.status(400).send({error: error.details[0].message});

    let user = await userService.loginUser(_.pick(req.body, ['sspID', 'password']));
    if (!user) return res.status(400).send({error: 'Wrong ID or Password.'});

    const token = user.generateAuthToken();
    res.status(200).send({"Token": token});
});

module.exports = router;