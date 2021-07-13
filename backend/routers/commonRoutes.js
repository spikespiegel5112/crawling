const express = require('express');
const router = express.Router();

const commonController = require('../controllers/commonController');


router.post('/woffParser', commonController.woffParser);
// router.post('/fontCmap', commonController.fontCmap);
router.post('/getFontDataByBase64', commonController.getFontDataByBase64);
router.get('/getBase64Data', commonController.getBase64Data);
router.get('/getFontDataFromPage', commonController.getFontDataFromPage);
router.post('/generateFontDictionary', commonController.generateFontDictionary);
router.get('/getFontDictionaryFromPage', commonController.getFontDictionaryFromPage);
router.post('/arrayBufferToBase64', commonController.arrayBufferToBase64);
router.post('/getFontFile', commonController.getFontFile);
router.post('/getDecodeFontValue', commonController.getDecodeFontValue);
router.post('/exportCSV', commonController.exportCSV);


module.exports = router;
