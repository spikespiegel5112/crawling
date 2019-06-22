const express = require('express');
const router = express.Router();

const crawlerByJsonController = require('../controllers/crawlerByJsonController');


router.post('/crawl', crawlerByJsonController.crawl);
router.get('/getListByPagination', crawlerByJsonController.getListByPagination);
router.get('/getListByDate', crawlerByJsonController.getListByDate);
router.post('/save', crawlerByJsonController.save);
router.post('/crawlAndSave', crawlerByJsonController.crawlAndSave);
router.delete('/deleteRecords', crawlerByJsonController.deleteRecords);


module.exports = router;
