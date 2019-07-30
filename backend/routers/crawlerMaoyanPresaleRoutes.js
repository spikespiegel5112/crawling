const express = require('express');
const router = express.Router();

const crawlerPreSaleController = require('../controllers/crawlerMaoyanPreSaleController');

router.get('/crawlMovieList', crawlerPreSaleController.crawlMovieList);
router.get('/crawlMoviePreSaleDetail', crawlerPreSaleController.crawlMoviePreSaleDetail);
router.get('/crawlPreSaleWantToSeePortrait', crawlerPreSaleController.crawlPreSaleWantToSeePortrait);
router.get('/crawlPreSaleBoxOfficePremiere', crawlerPreSaleController.crawlPreSaleBoxOfficePremiere);
router.get('/crawlPreSaleBookingDetails', crawlerPreSaleController.crawlPreSaleBookingDetails);
router.get('/oneKeyMoviePreSale', crawlerPreSaleController.oneKeyMoviePreSale);
router.post('/saveOneMaoyanPreSale', crawlerPreSaleController.saveOneMaoyanPreSale);
router.post('/saveMultipleMaoyanPreSale', crawlerPreSaleController.saveMultipleMaoyanPreSale);
router.post('/saveMultipleMaoyanPreSaleBookingDetails', crawlerPreSaleController.saveMultipleMaoyanPreSaleBookingDetails);
router.get('/getPreSaleBookingDetailsByMovieId', crawlerPreSaleController.getPreSaleBookingDetailsByMovieId);

router.get('/getListByPagination', crawlerPreSaleController.getListByPagination);
router.delete('/deleteRecords', crawlerPreSaleController.deleteRecords);
router.get('/exportCSV', crawlerPreSaleController.exportCSV);

module.exports = router;
