const express = require('express');
const router = express.Router();

const crawlerController = require('../controllers/crawlerWantSeeMaoyanController');

router.get('/crawl', crawlerController.crawl);
router.get('/crawlMovieList', crawlerController.crawlMovieList);
router.get('/crawlMovieDetail', crawlerController.crawlMovieDetail);
router.get('/oneKeyMovieDetail', crawlerController.oneKeyMovieDetail);
router.post('/save', crawlerController.save);
router.get('/getListByPagination', crawlerController.getListByPagination);
router.post('/crawlAndSave', crawlerController.crawlAndSave);
router.delete('/deleteRecords', crawlerController.deleteRecords);


module.exports = router;
