const express = require('express');
const router = express.Router();

const settingsController = require('../controllers/settingsController');

router.post('/createOrUpdate', settingsController.createOrUpdate);
router.get('/getList', settingsController.getList);
router.delete('/deleteRecords', settingsController.deleteRecords);


module.exports = router;
