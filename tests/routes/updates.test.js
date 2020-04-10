const request = require('supertest');
const {ObjectID} = require('mongodb');
const _ = require('lodash');
const expect = require('expect');

const app = require('../../index');

const url = '/api/v1/updates/';

const Update = require('../../models/update');
const {updates, populateUpdates} = require('../seed/updateSeed');
const {courses, populateCourses} = require('../seed/courseSeed');
const {users} = require('../seed/mockedUsersSeed');

beforeEach(populateCourses);
beforeEach(populateUpdates);

after(async done => {
    done();
});

describe(url, () => {
    describe('GET /:id', () => {
        it('should return a single update using id', async () => {
            const id = updates[0]._id;
            const res = await request(app)
                .get(url + id)
                .set('x-auth-token', users[0].token);
            
            expect(res.statusCode).toEqual(200);
            expect(res.body.title).toEqual(updates[0].title);
        });

        it('should not return updates without access token', async () => {
            const id = updates[0]._id;
            const res = await request(app)
                .get(url + id);

            expect(res.statusCode).toEqual(401);
            expect(res.body.error).toEqual('Invalid Token');
        })

        it('should return a 404 if no update is found', async () => {
            const id = new ObjectID();
            const res = await request(app)
                .get(url + id)
                .set('x-auth-token', users[0].token);
            
            expect(res.statusCode).toEqual(404);
            expect(res.body.error).toEqual('No update with this ID is found');
        });

        it('should retuen a 400 if invalid is sent', async () => {
            const id = '123';
            const res = await request(app)
                .get(url + id)
                .set('x-auth-token', users[0].token);
        
            expect(res.statusCode).toEqual(400);
            expect(res.body.error).toEqual('Invalid ID');
        });
    });
});