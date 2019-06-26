const express = require('express');
const router = express.Router();

const crawlerMaoyanRankingListController = require('../controllers/crawlerMaoyanRankingListController');


// router.get('/crawl', crawlerMaoyanRankingListController.crawl);
router.get('/crawlRankingList', crawlerMaoyanRankingListController.crawlRankingList);

router.post('/crawlRankingListByYear', crawlerMaoyanRankingListController.crawlRankingListByYear);
router.get('/crawlRankingListDetail', crawlerMaoyanRankingListController.crawlRankingListDetail);
router.get('/crawlRankingListMoreSections', crawlerMaoyanRankingListController.crawlRankingListMoreSections);
router.get('/crawlRankingListRating', crawlerMaoyanRankingListController.crawlRankingListRating);
router.post('/crawlRankingListWantToSeePortrait', crawlerMaoyanRankingListController.crawlRankingListWantToSeePortrait);
router.post('/saveOneMaoyanOfficeBoxRecord', crawlerMaoyanRankingListController.saveOneMaoyanOfficeBoxRecord);
router.post('/saveMultipleMaoyanRankingListRecord', crawlerMaoyanRankingListController.saveMultipleMaoyanRankingListRecord);
router.get('/getListByPagination', crawlerMaoyanRankingListController.getListByPagination);
router.post('/crawlAndSave', crawlerMaoyanRankingListController.crawlAndSave);
router.delete('/deleteRecords', crawlerMaoyanRankingListController.deleteRecords);
router.get('/exportCSV', crawlerMaoyanRankingListController.exportCSV);
router.get('/fontParser', crawlerMaoyanRankingListController.fontParser);



module.exports = router;
