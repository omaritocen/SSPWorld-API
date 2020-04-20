const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const studentSchema = new mongoose.Schema({
    _userId: {
        type: mongoose.Types.ObjectId,
        unique: true,
        required: true
    },
    firstName: {
        type: String,
        required: true,
        min: 3,
        max: 15
    },
    lastName: {
        type: String,
        required: true,
        min: 3,
        max: 15
    },
    image: {
        type: String
    },
    year: {
        type: String,
        required: true,
        enum: ['Prep', 'First', 'Second', 'Third', 'Senior']
    },
    department: {
        type: String,
        required: true,
        enum: ['General', 'CCE', 'EME', 'CAE', 'BME', 'GPE', 'OCE']
    }
});

studentSchema.statics.validate = (body) => {
    const schema = Joi.object({
        _userId: Joi.objectId().required(),
        firstName: Joi.string().required().min(3).max(15),
        lastName: Joi.string().required().min(3).max(15),
        image: Joi.string().optional().allow(''),
        year: Joi.string().required().valid('Prep', 'First', 'Second', 'Third', 'Senior'),
        department: Joi.string().required().valid('General', 'CCE', 'EME', 'CAE', 'BME', 'GPE', 'OCE')
    });

    return schema.validate(body);
}

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;