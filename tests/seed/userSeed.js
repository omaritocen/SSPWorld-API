const config = require('config');

const User = require('../../models/user');

const users = [{
    email: "example@example.com",
    sspID: 5313,
    password: 'boom123',
    role: 'student'
}, {
    email: "example123@example.com",
    sspID: 5300,
    password: 'boom123',
    role: 'student'
}]; 


const populateUsers = (done) => {
    //this.timeout(3000);
    User.deleteMany({}).then(() => {
        return User.insertMany(users);
    }).then(() => done());
}

module.exports = {
    users,
    populateUsers
}
