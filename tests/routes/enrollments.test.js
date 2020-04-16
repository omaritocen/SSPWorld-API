const request = require('supertest');
const { ObjectID } = require('mongodb');
const _ = require('lodash');
const expect = require('expect');

const app = require('../../index');

const url = '/api/v1/enrollments/';

const Enrollment = require('../../models/enrollment');
const { courses, populateCourses } = require('../seed/courseSeed');
const { students, populateStudents } = require('../seed/studentSeed');
const { enrollments, populateEnrollments } = require('../seed/enrollmentSeed');
const { updates, populateUpdates } = require('../seed/updateSeed');
const { users } = require('../seed/mockedUsersSeed');

beforeEach(populateStudents);
beforeEach(populateCourses);
beforeEach(populateUpdates);
beforeEach(populateEnrollments);
after(async (done) => {
    done();
});

describe(url, () => {
    describe('POST /', () => {
        it('should post a new enrollment', async () => {
            const res = await request(app)
                .post(url)
                .set('x-auth-token', users[0].token)
                .send({ _courseId: courses[1]._id });

            expect(res.statusCode).toEqual(201);
            expect(res.body._studentId).toBe(students[0]._id.toHexString());

            const enrollment = await Enrollment.find({
                _courseId: courses[1]._id,
            });
            expect(enrollment).toBeTruthy();
        });

        it('should not post a new enrollment with invalid course id', async () => {
            const res = await request(app)
                .post(url)
                .set('x-auth-token', users[0].token)
                .send({ _courseId: new ObjectID() });

            expect(res.statusCode).toEqual(400);
            expect(res.body.error).toEqual('No course with this ID is found');
        });

        it('should return 400 if invalid body is sent', async () => {
            const res = await request(app)
                .post(url)
                .set('x-auth-token', users[0].token);

            expect(res.statusCode).toEqual(400);
            expect(res.body.error).toEqual('"_courseId" is required');
        });

        it('should return 401 if no access token is sent', async () => {
            const res = await request(app)
                .post(url)
                .send({ _courseId: courses[0]._id });

            expect(res.statusCode).toEqual(401);
            expect(res.body.error).toEqual('Invalid Token');
        });
    });

    describe('DELETE /:id', () => {
        it('should delete an enrollment', async () => {
            const res = await request(app)
                .delete(url + enrollments[0]._id)
                .set('x-auth-token', users[0].token);

            expect(res.statusCode).toEqual(200);
            expect(res.body._courseId).toEqual(courses[0]._id.toHexString());

            const enrollment = await Enrollment.findById(enrollments[0]._id);
            expect(enrollment).toBeFalsy();
        });

        it('should return a 400 if invalid id is sent', async () => {
            const res = await request(app)
                .delete(url + '123')
                .set('x-auth-token', users[0].token);

            expect(res.statusCode).toEqual(400);
            expect(res.body.error).toEqual('Invalid ID');
        });

        it('should return a 404 if no enrollment is found', async () => {
            const res = await request(app)
                .delete(url + new ObjectID())
                .set('x-auth-token', users[0].token);

            expect(res.statusCode).toEqual(404);
            expect(res.body.error).toEqual('No enrollment with this id is found');
        });

        it('should return 401 when deleting an enrollment that belongs to somebody else', async () => {
            const res = await request(app)
                .delete(url + enrollments[0]._id)
                .set('x-auth-token', users[3].token);

            expect(res.statusCode).toEqual(401);
            expect(res.body.error).toEqual('Access Denied');
        });

        it('should return 401 if no access token is sent', async () => {
            const res = await request(app).delete(url + enrollments[0]._id);

            expect(res.statusCode).toEqual(401);
            expect(res.body.error).toEqual('Invalid Token');
        });
    });
});
