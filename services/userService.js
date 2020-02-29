const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../models/user');

const userExists = async (email) => {
    const user = await User.findOne({email});
    return user;
}

const idExists = async (sspID) => {
    const user = await User.findOne({sspID});
    return user;
}

const registerUser = async (user) => {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    user = await user.save();
    return user;
}

const loginUser = async (body) => {
    const user = await User.findOne({sspID: body.sspID});
    if (user) {
        const result = await bcrypt.compare(body.password, user.password);
        if (result) return user;
    }

    return undefined;
}

module.exports = {
    registerUser,
    loginUser,
    userExists,
    idExists
}