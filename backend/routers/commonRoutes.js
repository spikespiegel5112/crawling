const express = require('express');
const router = express.Router();

const commonController = require('../controllers/commonController');


router.post('/woffParser', commonController.woffParser);
// router.post('/fontCmap', commonController.fontCmap);
router.post('/opentypeJs', commonController.opentypeJs);
// router.post('/base64ToUint8Array', commonController.base64ToUint8Array);
router.post('/arrayBufferToBase64', commonController.arrayBufferToBase64);
router.post('/getFontFile', commonController.getFontFile);
router.post('/decodeFontValue', commonController.decodeFontValue);
router.post('/getDecodeFontValue', commonController.getDecodeFontValue);
router.post('/exportCSV', commonController.exportCSV);


module.exports = router;
