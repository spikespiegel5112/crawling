const express = require('express');
const router = express.Router();

const crawlerMaoyanBoxOfficeListController = require('../controllers/crawlerMaoyanBoxOfficeListController');

router.get('/crawlMovieList', crawlerMaoyanBoxOfficeListController.crawlMovieList);
router.post('/save', crawlerMaoyanBoxOfficeListController.save);
router.get('/getListByPagination', crawlerMaoyanBoxOfficeListController.getListByPagination);
router.post('/crawlAndSave', crawlerMaoyanBoxOfficeListController.crawlAndSave);
router.delete('/deleteRecords', crawlerMaoyanBoxOfficeListController.deleteRecords);


module.exports = router;
