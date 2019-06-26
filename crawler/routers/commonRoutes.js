const express = require('express');
const router = express.Router();

const commonController = require('../controllers/commonController');


router.post('/woffParser', commonController.woffParser);
router.post('/woff2Parser', commonController.woff2Parser);
router.post('/fontCmap', commonController.fontCmap);
router.post('/opentypeJs', commonController.opentypeJs);
router.post('/base64ToUint8Array', commonController.base64ToUint8Array);
router.post('/arrayBufferToBase64', commonController.arrayBufferToBase64);


module.exports = router;
