const _ = require('lodash');

const User = require('../models/user');
const userService = require('../services/userService');


module.exports.registerUser = async (req, res) => {
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
}

module.exports.loginUser = async (req, res) => {
    const {error} = await User.validateLogin(req.body);
    if (error) return res.status(400).send({error: error.details[0].message});

    let user = await userService.loginUser(_.pick(req.body, ['sspID', 'password']));
    if (!user) return res.status(400).send({error: 'Wrong ID or Password.'});

    const token = user.generateAuthToken();
    res.status(200).send({"Token": token});
}