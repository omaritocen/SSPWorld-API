const express = require('express');
const _ = require('lodash');

const router = express.Router();

const auth = require('../../middleware/auth');
const announcer = require('../../middleware/announcer');
const validId = require('../../middleware/validid');
const validateUpdate = require('../../middleware/validations/validateUpdate');

const updateController = require('../../controllers/updateController');

router
    .route('/:id')
    .get([auth, validId] , updateController.getUpdateById)
    .put([auth, announcer, validId, validateUpdate], updateController.updateUpdate)
    .delete([auth, announcer, validId], updateController.deleteUpdate);

router
    .post('/', [auth, announcer, validateUpdate], updateController.postUpdate);

module.exports = router;