const express = require('express');
const router = express.Router();

const headerSettingsController = require('../controllers/headerSettingsController');

router.get('/getList', headerSettingsController.getList);
router.post('/createOrUpdate', headerSettingsController.createOrUpdate);
router.delete('/deleteItem', headerSettingsController.deleteItem);


module.exports = router;
