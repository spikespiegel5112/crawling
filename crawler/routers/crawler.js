const express = require('express');
const router = express.Router();

const crawlerController = require('../controllers/crawlerController');

router.get('/crawl', crawlerController.crawl);
router.post('/save', crawlerController.save);
router.get('/getListByPagination', crawlerController.getListByPagination);
router.post('/crawlAndSave', crawlerController.crawlAndSave);
router.delete('/deleteRecords', crawlerController.deleteRecords);


module.exports = router;
