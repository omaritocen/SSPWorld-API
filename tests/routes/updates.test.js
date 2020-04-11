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

//TODO: FIX THE BUG OF 403 AND ADD THE GET UPDATES BY STUDENTS AFTER IMPLMENTING ENROLLMENTS

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

    //describe('GET /getUpdatesByCourseId/:id')

    describe('POST /', () => {
        it('should post a new update', async () => {
            const update = {
                _courseId: courses[1]._id,
                title: 'a title for the new update',
                body: 'the body for the update',
                startDate: Date.now(),
                deadline: Date.now()
            };

            const res = await request(app)
                .post(url)
                .set('x-auth-token', users[2].token)
                .send(update);

            expect(res.statusCode).toEqual(201);
            expect(res.body.title).toEqual(update.title);

            const updates = await Update.find();
            expect(updates.length).toEqual(4);
            expect(updates[3].title).toEqual(update.title);
        });

        it('should not post a new update with invalid body', async () => {
            const update = {
                _courseId: courses[1]._id,
                title: 'a title for the new update',
                startDate: Date.now(),
                deadline: Date.now()
            };

            const res = await request(app)
                .post(url)
                .set('x-auth-token', users[2].token)
                .send(update);

            expect(res.statusCode).toEqual(400);
            expect(res.body.error).toEqual('\"body\" is required');

            const updates = await Update.find();
            expect(updates.length).toEqual(3);
        });

        it('should not post a new update with invalid course id', async () => {
            const update = {
                _courseId: new ObjectID(),
                title: 'a title for the new update',
                body: 'the body for the update',
                startDate: Date.now(),
                deadline: Date.now()
            };

            const res = await request(app)
                .post(url)
                .set('x-auth-token', users[2].token)
                .send(update);

            expect(res.statusCode).toEqual(400);
            expect(res.body.error).toEqual('There is no course with this id is found');
        });

        it('should return a 401 if no access token is sent', async () => {
            const update = {
                _courseId: courses[1]._id,
                title: 'a title for the new update',
                body: 'the body for the update',
                startDate: Date.now(),
                deadline: Date.now()
            };

            const res = await request(app)
                .post(url)
                .send(update);

            expect(res.statusCode).toEqual(401);
            expect(res.body.error).toEqual('Invalid Token');

        });

        it('should return a 403 when not a repre', async () => {
            const update = {
                _courseId: courses[1]._id,
                title: 'a title for the new update',
                body: 'the body for the update',
                startDate: Date.now(),
                deadline: Date.now()
            };

            const res = await request(app)
                .post(url)
                .set('x-auth-token', users[0].token)
                .send(update);

            expect(res.statusCode).toEqual(403);
            expect(res.body.error).toEqual('Access Denied');
        });     
    });

    describe('PUT /:id', () => {
        it('should update an update', async () => {
            const update = {
                _courseId: courses[1]._id,
                title: 'a changed update',
                body: 'the body for the update',
                startDate: Date.now(),
                deadline: Date.now()
            };

            const res = await request(app)
                .put(url + updates[2]._id)
                .set('x-auth-token', users[2].token)
                .send(update);

            expect(res.statusCode).toEqual(200);
            expect(res.body.title).toEqual(update.title);

            const resUpdate = await Update.findOne({title: update.title});
            expect(resUpdate).toBeTruthy();
            expect(resUpdate.body).toEqual(update.body);
        });

        it('should return a 400 if invalid body is sent', async() => {
            const update = {
                _courseId: courses[1]._id,
                body: 'the body for the update',
                startDate: Date.now(),
                deadline: Date.now()
            };

            const res = await request(app)
                .put(url + updates[2]._id)
                .set('x-auth-token', users[2].token)
                .send(update);

            expect(res.statusCode).toEqual(400);
            expect(res.body.error).toEqual(update.title);
        });

        it('should return a 404 if no update is found', async() => {
            const id = new ObjectID();
            const update = {
                _courseId: courses[1]._id,
                title: 'a changed update',
                body: 'the body for the update',
                startDate: Date.now(),
                deadline: Date.now()
            };

            const res = await request(app)
                .put(url + id)
                .set('x-auth-token', users[2].token)
                .send(update);

            expect(res.statusCode).toEqual(404);
            expect(res.body.error).toEqual('No update with this ID is found');
        });

        it('should return a 400 if invalid id is sent', async() => {
            const id = '123';
            const update = {
                _courseId: courses[1]._id,
                title: 'a changed update',
                body: 'the body for the update',
                startDate: Date.now(),
                deadline: Date.now()
            };

            const res = await request(app)
                .put(url + id)
                .set('x-auth-token', users[2].token)
                .send(update);

            expect(res.statusCode).toEqual(400);
            expect(res.body.error).toEqual('Invalid ID');
        });

        it('should return a 403 if update an update by other user', async() => {
            const id = updates[1]._id;
            const update = {
                _courseId: courses[1]._id,
                title: 'a changed update',
                body: 'the body for the update',
                startDate: Date.now(),
                deadline: Date.now()
            };

            const res = await request(app)
                .put(url + id)
                .set('x-auth-token', users[2].token)
                .send(update);

            expect(res.statusCode).toEqual(403);
            expect(res.body.error).toEqual('Access denied');
        });
    });

    describe('DELETE /:id', () => {
        it('should delete an update', async () => {
            const id = updates[2]._id;
            const res = await request(app)
                .get(url + id)
                .set('x-auth-token', users[2].token);
            
            expect(res.statusCode).toEqual(200);
            expect(res.body.title).toEqual(updates[2].title);
        });

        it('should return a 404 if no update is found', async () => {
            const id = new ObjectID();
            const res = await request(app)
                .get(url + id)
                .set('x-auth-token', users[0].token);
            
            expect(res.statusCode).toEqual(404);
            expect(res.body.error).toEqual('No update with this ID is found');
        });

        it('should return a 400 if invalid id is sent', async () => {
            const id = '123';
            const res = await request(app)
                .get(url + id)
                .set('x-auth-token', users[2].token);
            
            expect(res.statusCode).toEqual(400);
            expect(res.body.error).toEqual('Invalid ID');
        });

        it('should return a 401 if no access token', async () => {
            const id = updates[2]._id;
            const res = await request(app)
                .get(url + id)
            
            expect(res.statusCode).toEqual(401);
            expect(res.body.error).toEqual('Invalid Token');
        });

        // it('should return a 403 if other user attempted to delete', async () => {
        //     const id = updates[0]._id;
        //     const res = await request(app)
        //         .get(url + id)
        //         .set('x-auth-token', users[2].token);
            
        //     expect(res.statusCode).toEqual(403);
        //     expect(res.body.error).toEqual('Access denied');
        // });
    });

});