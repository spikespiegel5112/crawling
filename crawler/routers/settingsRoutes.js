const express = require('express');
const router = express.Router();

const SettingsController = require('../controllers/SettingsController');

router.get('/getList', SettingsController.getList);
router.post('/createOrUpdate', SettingsController.createOrUpdate);
router.delete('/deleteItem', SettingsController.deleteItem);


module.exports = router;
