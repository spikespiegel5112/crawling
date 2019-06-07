const path = require('path');
const express = require('express');
const router = express.Router();

const crawlerControllers = require('../controllers/crawler')


router.get('/crawl', crawlerControllers.crawl);
router.post('/save', crawlerControllers.save);
router.post('/crawlAndSave', crawlerControllers.crawlAndSave);


module.exports = router;