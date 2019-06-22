const express = require('express');
const router = express.Router();

const crawlerMaoyanRankingListController = require('../controllers/crawlerMaoyanRankingListController');


// router.get('/crawl', crawlerMaoyanRankingListController.crawl);
router.get('/crawlRankingList', crawlerMaoyanRankingListController.crawlRankingList);

router.post('/crawlRankingListByYear', crawlerMaoyanRankingListController.crawlRankingListByYear);
router.get('/crawlBoxOfficeDetail', crawlerMaoyanRankingListController.crawlBoxOfficeDetail);
router.get('/crawlBoxOfficeRating', crawlerMaoyanRankingListController.crawlBoxOfficeRating);
router.post('/crawlBoxOfficeWantToSeePortrait', crawlerMaoyanRankingListController.crawlBoxOfficeWantToSeePortrait);
router.post('/saveOneMaoyanOfficeBoxRecord', crawlerMaoyanRankingListController.saveOneMaoyanOfficeBoxRecord);
router.post('/save', crawlerMaoyanRankingListController.save);
router.get('/getListByPagination', crawlerMaoyanRankingListController.getListByPagination);
router.post('/crawlAndSave', crawlerMaoyanRankingListController.crawlAndSave);
router.delete('/deleteRecords', crawlerMaoyanRankingListController.deleteRecords);
router.get('/exportCSV', crawlerMaoyanRankingListController.exportCSV);

module.exports = router;
