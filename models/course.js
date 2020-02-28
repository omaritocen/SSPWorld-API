const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const CourseType = Object.freeze({'Core': 0, 'Elective': 1, 'Humanity': 2});
const Term = Object.freeze({'First': 0, 'Second': 1, 'Third': 2, 'Fourth': 3, 'Fifth': 4, 'Sixth': 5, 'Seventh': 6, 'Eighth': 7, 'Ninth': 8, 'Tenth': 9 });

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 3,
        max: 50
    }, 
    creditHours: {
        type: Number,
        required: true,
        min: 1,
        max: 4
    },
    courseType: {
        type: CourseType,
        required: true
    },  
    term: {
        type: Term,
        required: true
    }
});

courseSchema.statics.validate = function(body) {
    const schema = Joi.object({
        name: Joi.string().required().min(5).max(255),
        creditHours: Joi.number().required().min(1).max(5),
        courseType: Joi.string().required(),
        term: Joi.string().required()
    });

    return schema.validate(body);
}

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;