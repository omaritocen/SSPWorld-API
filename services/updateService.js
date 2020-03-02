const mongoose = require('mongoose');

const Update = require('../models/update');

const getUpdate = async(id) => {
    const update = await Update.findById(id);
    return update;
}

const getUpdatesByCourseId = async(id) => {
    const updates = await Update.find({ _courseId: id });
    return updates;
}

const getUpdatesByCoursesIds = async (ids) => {
    const updates = await Update.find({_courseId: {$in: ids}}).sort('-deadline');
    return updates;
}

const saveUpdate = async (update) => {
    update = await update.save();
    return update;
}

const deleteUpdate = async (id) => {
    const update = await Update.findByIdAndRemove(id);
    return update;
}

const updateUpdate = async (id, body) => {
    const update = await Update.findByIdAndUpdate(id, body, {new: true});
    return update;
}

module.exports = {
    getUpdate,
    getUpdatesByCourseId,
    getUpdatesByCoursesIds,
    deleteUpdate,
    updateUpdate,
    saveUpdate
}