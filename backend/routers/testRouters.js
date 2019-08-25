const express = require('express');
const router = express.Router();

const testController = require('../controllers/testController');


router.get('/testUrl', testController.testUrl);



module.exports = router;
