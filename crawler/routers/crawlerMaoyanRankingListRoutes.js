const express = require('express');
const router = express.Router();

const crawlerMaoyanRankingListController = require('../controllers/crawlerMaoyanRankingListController');


// router.get('/crawl', crawlerMaoyanRankingListController.crawl);
router.get('/crawlRankingList', crawlerMaoyanRankingListController.crawlRankingList);

router.post('/crawlRankingListByYear', crawlerMaoyanRankingListController.crawlRankingListByYear);
router.get('/crawlRankingListBoxOfficeDetail', crawlerMaoyanRankingListController.crawlRankingListBoxOfficeDetail);
router.get('/crawlRankingListBoxOfficeGlobal', crawlerMaoyanRankingListController.crawlRankingListBoxOfficeGlobal);
router.get('/crawlRankingListBoxOfficePremiere', crawlerMaoyanRankingListController.crawlRankingListBoxOfficePremiere);

router.get('/crawlRankingListDetail', crawlerMaoyanRankingListController.crawlRankingListDetail);
router.get('/crawlRankingListMoreSections', crawlerMaoyanRankingListController.crawlRankingListMoreSections);
router.get('/crawlRankingListRating', crawlerMaoyanRankingListController.crawlRankingListRating);
router.get('/crawlRankingListPreSale', crawlerMaoyanRankingListController.crawlRankingListPreSale);

router.get('/crawlRankingListWantToSeePortrait', crawlerMaoyanRankingListController.crawlRankingListWantToSeePortrait);
router.post('/saveOneRankingListRecord', crawlerMaoyanRankingListController.saveOneRankingListRecord);
router.post('/saveMultipleMaoyanRankingListRecord', crawlerMaoyanRankingListController.saveMultipleMaoyanRankingListRecord);
router.get('/getListByPagination', crawlerMaoyanRankingListController.getListByPagination);
router.post('/crawlAndSave', crawlerMaoyanRankingListController.crawlAndSave);
router.delete('/deleteRecords', crawlerMaoyanRankingListController.deleteRecords);
router.get('/exportCSV', crawlerMaoyanRankingListController.exportCSV);
router.get('/fontParser', crawlerMaoyanRankingListController.fontParser);



module.exports = router;
