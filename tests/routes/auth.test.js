const request = require('supertest');
const config = require('config');
const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const expect = require('expect');

const app = require('../../index');

const {populateUsers, users} = require('../seed/userSeed');

const url = '/api/auth/';
const User = require('../../models/user');

beforeEach(populateUsers);

after(async done => {
    done();
});

describe(url, () => {
    describe('POST /', () => {
        it('should login user and return access token', async () => {
            const body = {
                sspID: users[1].sspID,
                password: 'example123'
            }

            const res = await request(app)
                .post(url)
                .send(body);

            expect(res.statusCode).toEqual(200);
            const token = res.body.Token;
            expect(token).toBeTruthy();

            const secret = config.get('jwtPrivateKey');
            jwt.verify(token, secret);
        });

        it('should not login user with false credentials', async () => {
            const body = {
                sspID: users[1].sspID,
                password: 'wrongPassword'
            }

            const res = await request(app)
                .post(url)
                .send(body);

            expect(res.statusCode).toEqual(400);
            expect(res.body.error).toEqual('Wrong ID or Password.');
        });

        it('should not login user with invalid body', async () => {
            const body = {
                sspID: users[1].sspID
            }

            const res = await request(app)
                .post(url)
                .send(body);

            expect(res.statusCode).toEqual(400);
            expect(res.body.error).toEqual('\"password\" is required');
        });
    });
});