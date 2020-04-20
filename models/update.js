const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const updateSchema = new mongoose.Schema({
    _courseId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    _userId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    title: {
        type: String,
        required: true,
        min: 5,
        max: 100
    },
    body: {
        type: String,
        required: true,
        min: 5,
        max: 1000
    },
    startDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    deadline: {
        type: Date,
        required: true
    }
});

updateSchema.statics.validate = (body) => {
    const schema = Joi.object({
        _courseId: Joi.objectId().required(),
        title: Joi.string().required().min(5).max(100),
        body: Joi.string().required().min(5).max(1000),
        startDate: Joi.date().required(),
        deadline: Joi.date().required()
    });

    return schema.validate(body);
}

const Update = mongoose.model('Update', updateSchema);

module.exports = Update;