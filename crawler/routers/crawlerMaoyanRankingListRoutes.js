const express = require('express');
const router = express.Router();

const crawlerController = require('../controllers/crawlerMaoyanBoxOfficeListController');

// router.get('/crawl', crawlerController.crawl);
router.get('/crawlMovieList', crawlerController.crawlMovieList);
router.get('/crawlMovieWantSeeDetail', crawlerController.crawlMovieWantSeeDetail);
router.get('/crawlMovieWantSeePortrait', crawlerController.crawlMovieWantSeePortrait);
router.get('/oneKeyMovieWantSee', crawlerController.oneKeyMovieWantSee);
router.post('/saveOneMaoyanWantSee', crawlerController.saveOneMaoyanWantSee);
router.post('/saveMultipleMaoyanWantSee', crawlerController.saveMultipleMaoyanWantSee);
// router.post('/save', crawlerController.save);
router.get('/getListByPagination', crawlerController.getListByPagination);
// router.post('/crawlAndSave', crawlerController.crawlAndSave);
router.delete('/deleteRecords', crawlerController.deleteRecords);
router.get('/exportCSV', crawlerController.exportCSV);

module.exports = router;
