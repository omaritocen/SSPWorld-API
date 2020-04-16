const request = require('supertest');
const {ObjectID} = require('mongodb');
const _ = require('lodash');
const expect = require('expect');

const app = require('../../index');

const url = '/api/v1/courses/';

const Course = require('../../models/course');
const {courses, populateCourses} = require('../seed/courseSeed');
const {updates, populateUpdates} = require('../seed/updateSeed');
const {users} = require('../seed/mockedUsersSeed');

beforeEach(populateCourses);
beforeEach(populateUpdates);
after(async done => {
    done();
});

// TODO: GET /enrolledCourses is missing, Awaiting Implemenation of enrollments

describe('/api/courses/', () => {

    describe('GET /', () => {
        it('should return all the courses', async () => {
            const res = await request(app)
                .get(url)
                .set('x-auth-token', users[0].token);
                
            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toEqual(2); 
        });

        it('should not return courses without access token', async () => {
            const res = await request(app)
                .get(url);
                
            expect(res.statusCode).toEqual(401);
            expect(res.body.error).toBe('Invalid Token');
        });

    });

    describe('GET /:id', () => {
        it('should return a single course', async () => {
            const res = await request(app)
                .get(url + courses[0]._id)
                .set('x-auth-token', users[0].token);
            
            expect(res.statusCode).toEqual(200);
            expect(res.body).toMatchObject(_.omit(courses[0], ['_id']));          
        });

        it('should return a 401 if no access token is sent', async() => {
            const id = courses[0]._id;
            const res = await request(app)
                .get(url + id);
            
            expect(res.statusCode).toEqual(401);
            expect(res.body.error).toBe('Invalid Token');  
        });

        it('should return a 400 if invalid id is sent', async() => {
            const id = '123';
            const res = await request(app)
                .get(url + id)
                .set('x-auth-token', users[0].token);
            
            expect(res.statusCode).toEqual(400);
            expect(res.body.error).toBe('Invalid ID');  
        });

        it('should return a 404 if no course is found', async() => {
            const id = new ObjectID();
            const res = await request(app)
                .get(url + id.toHexString())
                .set('x-auth-token', users[0].token);
            
            expect(res.statusCode).toEqual(404);
            expect(res.body.error).toBe('No course with this ID is found.');  
        });
    });

    describe('GET /getCourseByCourseName', () => {
        const subUrl = 'getCourseByCourseName';
        it('should return the course if course name is sent', async() => {
            const name = courses[0].name;
            const requestUrl = url + subUrl;
            const res = await request(app)
                .get(requestUrl)
                .query({courseName: name})
                .set('x-auth-token', users[0].token);
                

            expect(res.statusCode).toEqual(200);
            expect(res.body).toMatchObject(_.omit(courses[0], ['_id'])); 
        });
    });

    describe('GET /:id/updates', () => {
        it('should return the updates of the course', async () => {   
            const fullUrl = url + courses[0]._id + '/updates';
            const res = await request(app)
                .get(fullUrl)
                .set('x-auth-token', users[0].token);

            expect(res.statusCode).toEqual(200);
            expect(res.body[0].title).toEqual(updates[0].title);
        });

        it('should return an empty array if course has no updates', async () => {   
            const fullUrl = url + courses[1]._id + '/updates';
            const res = await request(app)
                .get(fullUrl)
                .set('x-auth-token', users[0].token);

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual([]);
        });

        it('should return a 404 if no course with this id is found', async () => {   
            const fullUrl = url + new ObjectID() + '/updates';
            const res = await request(app)
                .get(fullUrl)
                .set('x-auth-token', users[0].token);

            expect(res.statusCode).toEqual(404);
            expect(res.body.error).toEqual('No course with this id is found.');
        });

        it('should return a 400 if invalid is sent', async () => {   
            const fullUrl = url + '123'+ '/updates';
            const res = await request(app)
                .get(fullUrl)
                .set('x-auth-token', users[0].token);

            expect(res.statusCode).toEqual(400);
            expect(res.body.error).toEqual('Invalid ID');
        });

        it('should return a 401 if no token is sent', async () => {   
            const fullUrl = url + courses[0]._id + '/updates';
            const res = await request(app)
                .get(fullUrl)

            expect(res.statusCode).toEqual(401);
            expect(res.body.error).toEqual('Invalid Token');
        });
    });

    describe('POST /', () => {
        it('should create a new course', async () => {
            const body = {
                name: 'Course3',
                creditHours: 2,
                courseType: 'Core',
                term: 'Second'
            };

            const res = await request(app)
                .post(url)
                .set('x-auth-token', users[1].token)
                .send(body);

    
            expect(res.statusCode).toEqual(201);
            expect(res.body).toMatchObject(body);

            const course = await Course.findOne(body);
            expect(course).toBeTruthy();      
        });

        it('should not create a new course with invalid body', async () => {
            const body = {
                name: 'Course3',
                creditHours: 2,
                term: 'Second'
            };

            const res = await request(app)
            .post(url)
            .set('x-auth-token', users[1].token)
            .send(body);

            expect(res.statusCode).toEqual(400);

            const courses = await Course.find();
            expect(courses.length).toBe(2);  

        });

        it('should return 403 when not admin', async () => {
            const body = {
                name: 'Course3',
                creditHours: 2,
                courseType: 'Core',
                term: 'Second'
            };

            const res = await request(app)
            .post(url)
            .set('x-auth-token', users[0].token)
            .send(body);

            expect(res.statusCode).toEqual(403);
            expect(res.body.error).toBe('Access Denied');

            const courses = await Course.find();
            expect(courses.length).toBe(2);  
        });

        it('should return a 401 if no access token is sent', async () => {
            const body = {
                name: 'Course3',
                creditHours: 2,
                courseType: 'Core',
                term: 'Second'
            };

            const res = await request(app)
            .post(url)
            .send(body);

            expect(res.statusCode).toEqual(401);
            expect(res.body.error).toBe('Invalid Token');

            const courses = await Course.find();
            expect(courses.length).toBe(2);  
        });
    });

    describe('DELETE /:id', () => {

        it('should delete a single course', async () => {
            const res = await request(app)
            .delete(url + courses[0]._id)
            .set('x-auth-token', users[1].token);

            expect(res.statusCode).toEqual(200);
            expect(res.body.name).toEqual(courses[0].name);
            
            const coursess = await Course.find();
            expect(coursess.length).toBe(1);
        });

        it('should return a 401 no access token is sent', async() => {
            const id = courses[0]._id;
            const res = await request(app)
                .delete(url + id);
            
            expect(res.statusCode).toEqual(401);
            expect(res.body.error).toBe('Invalid Token');  
        });

        it('should return a 400 if invalid id is sent', async () => {
            const id = '123';
            const res = await request(app)
            .delete(url + id)
            .set('x-auth-token', users[1].token);

            expect(res.statusCode).toEqual(400);
            
            const coursess = await Course.find();
            expect(coursess.length).toBe(2);
        });
        
        it('should return a 404 if no course if found', async () => {
            const id = new ObjectID();
            const res = await request(app)
            .delete(url + id.toHexString())
            .set('x-auth-token', users[1].token);

            expect(res.statusCode).toEqual(404);
            expect(res.body.error).toBe('No course with this ID is found.');  
            
            const coursess = await Course.find();
            expect(coursess.length).toBe(2);
        }); 

        it('should return 403 when not admin', async () => {
            const id = courses[0]._id;
            const res = await request(app)
            .delete(url + id)
            .set('x-auth-token', users[0].token);

            expect(res.statusCode).toEqual(403);
            expect(res.body.error).toBe('Access Denied');
            
            const coursess = await Course.find();
            expect(coursess.length).toBe(2);
        }); 
    });

    describe('PUT /:id', () => {
        it('should update a single course', async () => {
            const id = courses[1]._id;
            const body = {
                name: "BoogieWoogieWooo",
                creditHours: 3,
                courseType: "Core",
                term: "First"
            }

            const res = await request(app)
                .put(url + id)
                .set('x-auth-token', users[1].token)
                .send(body);

                expect(res.statusCode).toEqual(200);
                expect(res.body).toMatchObject(body);

                const course = await Course.findById(id);
                expect(course).toMatchObject(body);
        });    

        it('should not update a course with invalid body', async () => {
            const id = courses[1]._id;
            const body = {
                courseType: "Core"
            }

            const res = await request(app)
                .put(url + id)
                .set('x-auth-token', users[1].token)
                .send(body);

            expect(res.statusCode).toEqual(400);
            expect(res.body.error).toBeTruthy();
            const course = await Course.findById(id);
            expect(course.courseType).toEqual('Humanity');

        });

        it('should return a 401 if no access token is sent', async() => {
            const body = {
                name: "BoogieWoogieWooo",
                creditHours: 3,
                courseType: "Core",
                term: "First"
            }

            const id = courses[0]._id;
            const res = await request(app)
                .delete(url + id)
                .send(body);
            
            expect(res.statusCode).toEqual(401);
            expect(res.body.error).toBe('Invalid Token');  
        });

        it('should return 403 when not admin', async () => {
            const body = {
                name: "BoogieWoogieWooo",
                creditHours: 3,
                courseType: "Core",
                term: "First"
            }

            const id = courses[0]._id;
            const res = await request(app)
            .put(url + id)
            .set('x-auth-token', users[0].token)
            .send(body);

            expect(res.statusCode).toEqual(403);
            expect(res.body.error).toBe('Access Denied');
            
            const coursess = await Course.find();
            expect(coursess.length).toBe(2);
        }); 

        it('should return a 400 if invalid id is sent', async () => {
            const body = {
                name: "BoogieWoogieWooo",
                creditHours: 3,
                courseType: "Core",
                term: "First"
            }

            const id = '123';
            const res = await request(app)
            .put(url + id)
            .set('x-auth-token', users[1].token)
            .send(body);

            expect(res.statusCode).toEqual(400);
            
            const coursess = await Course.find();
            expect(coursess.length).toBe(2);
        });
        
        it('should return a 404 if no course is found', async () => {
            const body = {
                name: "BoogieWoogieWooo",
                creditHours: 3,
                courseType: "Core",
                term: "First"
            }

            const id = new ObjectID();
            const res = await request(app)
            .put(url + id.toHexString())
            .set('x-auth-token', users[1].token)
            .send(body);

            expect(res.statusCode).toEqual(404);
            expect(res.body.error).toBe('No course with this ID is found.');  
            
            const coursess = await Course.find();
            expect(coursess.length).toBe(2);
        }); 
    });
});