const express = require('express');
const router = express.Router();

const dictionaryController = require('../controllers/dictionaryController');

router.get('/getListByIdOrCode', dictionaryController.getListByIdOrCode);
router.get('/create', dictionaryController.create);


module.exports = router;
