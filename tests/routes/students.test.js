const request = require('supertest');
const { ObjectID } = require('mongodb');
const _ = require('lodash');
const expect = require('expect');

const app = require('../../index');

const url = '/api/v1/students/';

const Student = require('../../models/student');
const { students, populateStudents } = require('../seed/studentSeed');
const { courses, populateCourses } = require('../seed/courseSeed');
const { enrollments, populateEnrollments } = require('../seed/enrollmentSeed');
const { users } = require('../seed/mockedUsersSeed');

beforeEach(populateStudents);
beforeEach(populateEnrollments);

describe(url, () => {
    describe('GET /', () => {
        it("should return the user's profile", async () => {
            const res = await request(app)
                .get(url)
                .set('x-auth-token', users[0].token);

            expect(res.statusCode).toEqual(200);
            expect(res.body.firstName).toEqual(students[0].firstName);
        });

        it("should return the user's profile #2", async () => {
            const res = await request(app)
                .get(url)
                .set('x-auth-token', users[3].token);

            expect(res.statusCode).toEqual(200);
            expect(res.body.firstName).toEqual(students[1].firstName);
        });

        it('should return a 404 if user has no profile', async () => {
            const res = await request(app)
                .get(url)
                .set('x-auth-token', users[4].token);

            expect(res.statusCode).toEqual(404);
            expect(res.body.error).toEqual(
                'No student profile is found for this user id'
            );
        });

        it('should return 401 if no access token is sent', async () => {
            const res = await request(app).get(url);

            expect(res.statusCode).toEqual(401);
            expect(res.body.error).toEqual('Invalid Token');
        });

        it('should return 404 when asking for a profile for another role', async () => {
            const res = await request(app)
                .get(url)
                .set('x-auth-token', users[1].token);

            expect(res.statusCode).toEqual(404);
            expect(res.body.error).toEqual(
                'No student profile is found for this user id'
            );
        });
    });

    describe('GET /:id', () => {
        it('should return the student profile', async () => {
            const id = students[0]._id;
            const res = await request(app)
                .get(url + id)
                .set('x-auth-token', users[0].token);

            expect(res.statusCode).toEqual(200);
            expect(res.body.firstName).toEqual(students[0].firstName);
        });

        it('should return a 404 if user has no profile', async () => {
            const id = new ObjectID();
            const res = await request(app)
                .get(url + id)
                .set('x-auth-token', users[0].token);

            expect(res.statusCode).toEqual(404);
            expect(res.body.error).toEqual('No student with this id is found');
        });

        it('should return a 400 if invalid id is sent', async () => {
            const id = '123';
            const res = await request(app)
                .get(url + id)
                .set('x-auth-token', users[0].token);

            expect(res.statusCode).toEqual(400);
            expect(res.body.error).toEqual('Invalid ID');
        });

        it('should return 401 if no access token is sent', async () => {
            const id = students[0]._id;
            const res = await request(app).get(url + id);

            expect(res.statusCode).toEqual(401);
            expect(res.body.error).toEqual('Invalid Token');
        });
    });

    describe('POST /', () => {
        it('should post a new student', async () => {
            const student = {
                firstName: 'Marco',
                lastName: 'Polo',
                image: '',
                year: 'First',
                department: 'CAE',
            };

            const res = await request(app)
                .post(url)
                .set('x-auth-token', users[4].token)
                .send(student);

            expect(res.statusCode).toEqual(201);
            expect(res.body.firstName).toEqual(student.firstName);

            const res2 = await request(app)
                .get(url)
                .set('x-auth-token', users[4].token);

            expect(res2.statusCode).toEqual(200);
            expect(res2.body.lastName).toEqual(student.lastName);

            const studentObj = await Student.find({ _userId: users[4]._id });
            expect(studentObj).toBeTruthy();
        });

        it('should return a 400 if user already has profile', async () => {
            const student = {
                firstName: 'Marco',
                lastName: 'Polo',
                image: '',
                year: 'First',
                department: 'CAE',
            };

            const res = await request(app)
                .post(url)
                .set('x-auth-token', users[0].token)
                .send(student);

            expect(res.statusCode).toEqual(400);
            expect(res.body.error).toEqual(
                'User already has a student profile.'
            );
        });

        it('should return a 400 if invalid student profile is sent', async () => {
            const student = {
                firstName: 'Marco',
                image: '',
                year: 'First',
                department: 'CAE',
            };

            const res = await request(app)
                .post(url)
                .set('x-auth-token', users[4].token)
                .send(student);

            expect(res.statusCode).toEqual(400);
            expect(res.body.error).toEqual('"lastName" is required');
        });

        it('should return a 401 if no access token is sent', async () => {
            const student = {
                firstName: 'Marco',
                lastName: 'Polo',
                image: '',
                year: 'First',
                department: 'CAE',
            };

            const res = await request(app).post(url).send(student);

            expect(res.statusCode).toEqual(401);
            expect(res.body.error).toEqual('Invalid Token');
        });
    });

    describe('PUT /', () => {
        it('should update student profile', async () => {
            const student = {
                firstName: 'Marco',
                lastName: 'Polo',
                image: '',
                year: 'First',
                department: 'CAE',
            };

            const res = await request(app)
                .put(url)
                .set('x-auth-token', users[0].token)
                .send(student);

            expect(res.statusCode).toEqual(200);
            expect(res.body.firstName).toEqual(student.firstName);
        });

        it('should return a 400 if invalid body is sent', async () => {
            const student = {
                firstName: 'Marco',
                image: '',
                year: 'First',
                department: 'CAE',
            };

            const res = await request(app)
                .put(url)
                .set('x-auth-token', users[0].token)
                .send(student);

            expect(res.statusCode).toEqual(400);
            expect(res.body.error).toEqual('"lastName" is required');
        });

        it('should return a 404 if user has no profile', async () => {
            const student = {
                firstName: 'Marco',
                lastName: 'Polo',
                image: '',
                year: 'First',
                department: 'CAE',
            };

            const res = await request(app)
                .put(url)
                .set('x-auth-token', users[4].token)
                .send(student);

            expect(res.statusCode).toEqual(404);
            expect(res.body.error).toEqual(
                'No student profile is found for this user id'
            );
        });

        it('should return a 401 if no access token is sent', async () => {
            const student = {
                firstName: 'Marco',
                lastName: 'Polo',
                image: '',
                year: 'First',
                department: 'CAE',
            };

            const res = await request(app).put(url).send(student);

            expect(res.statusCode).toEqual(401);
            expect(res.body.error).toEqual('Invalid Token');
        });
    });

    describe('GET /:id/enrollments', () => {
        const subUrl = url + '/enrollments';
        it('should return the enrollments of the user', async () => {
            const res = await request(app)
                .get(subUrl)
                .set('x-auth-token', users[0].token);

            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toEqual(1);
            expect(res.body[0]._studentId).toEqual(
                students[0]._id.toHexString()
            );
        });

        it('should retuen 404 if no id is found', async () => {
            const res = await request(app)
                .get(subUrl)
                .set('x-auth-token', users[4].token);

            expect(res.statusCode).toEqual(404);
            expect(res.body.error).toEqual(
                'User does not have a student profile'
            );
        });

        it('should return an empty array if student has no enrollments', async () => {
            const res = await request(app)
                .get(subUrl)
                .set('x-auth-token', users[5].token);

            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toEqual(0);
            expect(res.body).toEqual([]);
        });

        it('should return 401 if no access token is sent', async () => {
            const res = await request(app).get(subUrl);

            expect(res.statusCode).toEqual(401);
            expect(res.body.error).toEqual('Invalid Token');
        });
    });

    describe('GET /enrollments/courses/:courseId', () => {
        const subUrl = url + 'enrollments/courses/';
        it('should return the student enrollment in this course', async () => {
            const res = await request(app)
                .get(subUrl + courses[0]._id)
                .set('x-auth-token', users[0].token);

            expect(res.statusCode).toEqual(200);
            expect(res.body._studentId).toEqual(students[0]._id.toHexString());
        });

        it('should return a 404 if student is not enrolled in this course', async () => {
            const res = await request(app)
                .get(subUrl + courses[0]._id)
                .set('x-auth-token', users[5].token);

            expect(res.statusCode).toEqual(404);
            expect(res.body.error).toEqual(
                'No enrollment for this student with this course id'
            );
        });

        it('should return 400 if user has no student profile', async () => {
            const res = await request(app)
                .get(subUrl + courses[0]._id)
                .set('x-auth-token', users[4].token);

            expect(res.statusCode).toEqual(400);
            expect(res.body.error).toEqual(
                'User does not have a student profile'
            );
        });

        it('should return 404 if no course with this id is found', async () => {
            const res = await request(app)
                .get(subUrl + new ObjectID())
                .set('x-auth-token', users[5].token);

            expect(res.statusCode).toEqual(404);
            expect(res.body.error).toEqual('No course with this id is found');
        });

        it('should return 401 if no access token is sent', async () => {
            const res = await request(app)
            .get(subUrl + courses[0]._id)

            expect(res.statusCode).toEqual(401);
            expect(res.body.error).toEqual('Invalid Token');
        });
    });
});
