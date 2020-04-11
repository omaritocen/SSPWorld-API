const express = require('express');
const _ = require('lodash');

const router = express.Router();

const auth = require('../../middleware/auth');
const announcer = require('../../middleware/announcer');

const updateController = require('../../controllers/updateController');

// TODO: THE ROUTE TO BE CHANGED TO /student/updates
router
    .get('/', auth, updateController.getStudentUpdates);

router
    .route('/:id')
    .get(auth, updateController.getUpdateById)
    .put([auth, announcer], updateController.updateUpdate)
    .delete([auth, announcer], updateController.deleteUpdate);

router
    .post('/', [auth, announcer], updateController.postUpdate);

module.exports = router;