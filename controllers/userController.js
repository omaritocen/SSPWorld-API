const _ = require('lodash');

const User = require('../models/user');
const userService = require('../services/userService');
const AppError = require('../utils/appError');


module.exports.registerUser = async (req, res, next) => {
    let user = await userService.userExists(req.body.email);
    if (user) return next(new AppError('A User with the same email already exists.', 400));
    
    user = await userService.idExists(req.body.sspID);
    if (user) return next(new AppError('A User with the same SSP ID already exists.', 400));

    user = new User(_.pick(req.body, ['email', 'sspID', 'password']));
    user = await userService.registerUser(user);
    const token = user.generateAuthToken();
    res.header('x-auth-token', token).status(201).send(_.pick(user, ['sspID', 'email', 'role']));
}

module.exports.loginUser = async (req, res, next) => {
    let user = await userService.loginUser(_.pick(req.body, ['sspID', 'password']));
    if (!user) return next(new AppError('Wrong ID or Password.', 400));

    const token = user.generateAuthToken();
    res.status(200).send({"Token": token});
}