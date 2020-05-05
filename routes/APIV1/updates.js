const express = require('express');
const _ = require('lodash');

const router = express.Router();

const auth = require('../../middleware/auth');
const announcer = require('../../middleware/announcer');
const validid = require('../../middleware/validid');
const validateUpdate = require('../../middleware/validations/validateUpdate');

const updateController = require('../../controllers/updateController');

router.param('id', validid);

// GET /updates/:id
// PUT /updates/:id
// DELETE /updates/:id
router
    .route('/:id')
    .get(auth, updateController.getUpdateById)
    .put(
        [auth, announcer, validateUpdate],
        updateController.updateUpdate
    )
    .delete([auth, announcer], updateController.deleteUpdate);

// POST /updates
router.post(
    '/',
    [auth, announcer, validateUpdate],
    updateController.postUpdate
);

module.exports = router;
