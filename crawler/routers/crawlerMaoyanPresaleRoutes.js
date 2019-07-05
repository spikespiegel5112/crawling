const express = require('express');
const router = express.Router();

const crawlerController = require('../controllers/crawlerMaoyanPreSaleController');

// router.get('/crawl', crawlerController.crawl);
router.get('/crawlMovieList', crawlerController.crawlMovieList);
router.get('/crawlMoviePreSaleDetail', crawlerController.crawlMoviePreSaleDetail);
router.get('/crawlMoviePreSalePortrait', crawlerController.crawlMoviePreSalePortrait);
router.get('/oneKeyMoviePreSale', crawlerController.oneKeyMoviePreSale);
router.post('/saveOneMaoyanPreSale', crawlerController.saveOneMaoyanPreSale);
router.post('/saveMultipleMaoyanPreSale', crawlerController.saveMultipleMaoyanPreSale);
// router.post('/save', crawlerController.save);
router.get('/getListByPagination', crawlerController.getListByPagination);
// router.post('/crawlAndSave', crawlerController.crawlAndSave);
router.delete('/deleteRecords', crawlerController.deleteRecords);
router.get('/exportCSV', crawlerController.exportCSV);

module.exports = router;
