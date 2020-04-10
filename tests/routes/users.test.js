const request = require('supertest');
const {ObjectID} = require('mongodb');
const _ = require('lodash');
const expect = require('expect');

const app = require('../../index');

const {populateUsers, users} = require('../seed/userSeed');

const url = '/api/v1/users/';
const User = require('../../models/user');

beforeEach(populateUsers);

after(async done => {
    done();
});

describe(url , () => {
    describe('POST /', () => {
        
        it('should register a new user', async () => {
            const body = {
                email: 'exampleuser@example.com',
                sspID: 6123,
                password: 'example123',
                confirmPassword: 'example123'
            }

            const res = await request(app)
                .post(url)
                .send(body);
            
            expect(res.statusCode).toEqual(201);
            expect(res.body.email).toEqual(body.email);
            
            const user = await User.findOne({email: body.email});
            expect(user).toBeTruthy();
            expect(user.sspID).toEqual(body.sspID);
        });

        it('should not register a new user with existing ssp ID', async() => {
            const body = {
                email: 'exampleuser@example.com',
                sspID: users[0].sspID,
                password: 'example123',
                confirmPassword: 'example123'
            }

            const res = await request(app)
            .post(url)
            .send(body);
        
            expect(res.statusCode).toEqual(400);
            expect(res.body.error).toEqual('A User with the same SSP ID already exists.');
            
            const user = await User.findOne({email: body.email});
            expect(user).toBeFalsy();
        });
        
        it('should not register a new user with existing email', async() => {
            const body = {
                email: users[0].email,
                sspID: 6000,
                password: 'example123',
                confirmPassword: 'example123'
            }

            const res = await request(app)
            .post(url)
            .send(body);
        
            expect(res.statusCode).toEqual(400);
            expect(res.body.error).toEqual('A User with the same email already exists.');
            
            const user = await User.findOne({sspID: body.sspID});
            expect(user).toBeFalsy();
        });

        it('should not register a user with invalid body', async() => {
            const body = {
                email: users[0].email,
                sspID: 6000
            }

            const res = await request(app)
            .post(url)
            .send(body);
        
            expect(res.statusCode).toEqual(400);
            expect(res.body.error).toEqual('\"password\" is required');
            
            const urs = await User.find();
            expect(urs.length).toEqual(2);            
        });

        it('should not allow the user to set the role', async () => {
            const body = {
                email: 'exampleuser@example.com',
                sspID: 6123,
                password: 'example123',
                confirmPassword: 'example123',
                role: 'admin'
            }

            const res = await request(app)
                .post(url)
                .send(body);
            
                expect(res.statusCode).toEqual(400);
                expect(res.body.error).toEqual('\"role\" is not allowed');
                
                const urs = await User.find();
                expect(urs.length).toEqual(2); 
        });
    });
});
