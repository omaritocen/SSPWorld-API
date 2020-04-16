const express = require('express');
const _ = require('lodash');

const router = express.Router();

const auth = require('../../middleware/auth');
const announcer = require('../../middleware/announcer');
const validId = require('../../middleware/validid');

const updateController = require('../../controllers/updateController');

// TODO: THIS ROUTE TO BE REMOVED AFTER TESTING
router
    .get('/', auth, updateController.getStudentUpdates);

router
    .route('/:id')
    .get([auth, validId] , updateController.getUpdateById)
    .put([auth, announcer, validId], updateController.updateUpdate)
    .delete([auth, announcer, validId], updateController.deleteUpdate);

router
    .post('/', [auth, announcer], updateController.postUpdate);

module.exports = router;