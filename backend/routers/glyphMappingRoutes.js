const express = require('express');
const router = express.Router();

const glyphMappingController = require('../controllers/glyphMappingController');

router.get('/getList', glyphMappingController.getList);
router.post('/createOrUpdate', glyphMappingController.createOrUpdate);
router.delete('/deleteItem', glyphMappingController.deleteItem);


module.exports = router;
