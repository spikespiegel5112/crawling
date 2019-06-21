const express = require('express');
const router = express.Router();

const crawlerController = require('../controllers/crawlerMaoyanPresaleRoutes');

// router.get('/crawl', crawlerController.crawl);
router.get('/crawlMovieList', crawlerController.crawlMovieList);
router.get('/crawlMoviePresaleDetail', crawlerController.crawlMoviePresaleDetail);
router.get('/crawlMoviePresalePortrait', crawlerController.crawlMoviePresalePortrait);
router.get('/oneKeyMoviePresale', crawlerController.oneKeyMoviePresale);
router.post('/saveOneMaoyanPresale', crawlerController.saveOneMaoyanPresale);
router.post('/saveMultipleMaoyanPresale', crawlerController.saveMultipleMaoyanPresale);
// router.post('/save', crawlerController.save);
router.get('/getListByPagination', crawlerController.getListByPagination);
// router.post('/crawlAndSave', crawlerController.crawlAndSave);
router.delete('/deleteRecords', crawlerController.deleteRecords);
router.get('/exportCSV', crawlerController.exportCSV);

module.exports = router;
