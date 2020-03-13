const express = require('express');
const _ = require('lodash');

const router = express.Router();

const User = require('../models/user');
const userService = require('../services/userService');

// A REQUEST MAY BE SENT TO CREATE STUDENT PROFILE

router.post('/', async (req, res) => {
    const {error} = User.validateRegisteration(req.body);
    if (error) return res.status(400).send({error: error.details[0].message});

    let user = await userService.userExists(req.body.email);
    if (user) return res.status(400).send({error: 'A User with the same email already exists.'});

    user = await userService.idExists(req.body.sspID);
    if (user) return res.status(400).send({error: 'A User with the same SSP ID already exists.'});

    user = new User(_.pick(req.body, ['email', 'sspID', 'password']));
    user = await userService.registerUser(user);
    const token = user.generateAuthToken();
    res.header('x-auth-token', token).status(201).send(_.pick(user, ['sspID', 'email', 'role']));
});

module.exports = router;