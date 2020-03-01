const mongoose = require('mongoose');
const Joi = require('@hapi/joi');


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
        type: String,
        enum: ['Core', 'Elective', 'Humanity'],
        required: true
    },  
    term: {
        type: String,
        enum: ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth'],
        required: true
    }
});

courseSchema.statics.validate = function(body) {
    const schema = Joi.object({
        name: Joi.string().required().min(5).max(255),
        creditHours: Joi.number().required().min(1).max(5),
        courseType: Joi.string().valid('Core', 'Elective', 'Humanity').required(),
        term: Joi.string().valid('First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth').required()
    });

    return schema.validate(body);
}

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;