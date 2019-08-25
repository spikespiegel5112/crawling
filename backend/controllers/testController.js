
const dealsJson = require('../data/json/deals.json');
const brandsJson = require('../data/json/brands.json');
const giftsJson = require('../data/json/gifts.json');
const homepageCarouselJson = require('../data/json/homepage_carousel.json');
const itinerariesJson = require('../data/json/itineraries.json');
const productsJson = require('../data/json/products.json');
const shopsJson = require('../data/json/shops.json');
const splashScreenJson = require('../data/json/splash_screen.json');
const tagsJson = require('../data/json/tags.json');

const getDeals = (req, res, next) => {
  try {
	res.status(200).json({
	  data: dealsJson
	})
  } catch (e) {
	res.status(400).json({
	  data: e
	})
  }
};

const getBrands = (req, res, next) => {
  try {
	res.status(200).json({
	  data: brandsJson
	})
  } catch (e) {
	res.status(400).json({
	  data: e
	})
  }
};

const getGifts = (req, res, next) => {
  try {
	res.status(200).json({
	  data: giftsJson
	})
  } catch (e) {
	res.status(400).json({
	  data: e
	})
  }
};

const getHomepageCarousel = (req, res, next) => {
  try {
	res.status(200).json({
	  data: homepageCarouselJson
	})
  } catch (e) {
	res.status(400).json({
	  data: e
	})
  }
};

const getItineraries = (req, res, next) => {
  try {
	res.status(200).json({
	  data: itinerariesJson
	})
  } catch (e) {
	res.status(400).json({
	  data: e
	})
  }
};

const getProducts = (req, res, next) => {
  try {
	res.status(200).json({
	  data: productsJson
	})
  } catch (e) {
	res.status(400).json({
	  data: e
	})
  }
};

const getShops = (req, res, next) => {
  try {
	res.status(200).json({
	  data: shopsJson
	})
  } catch (e) {
	res.status(400).json({
	  data: e
	})
  }
};

const getSplashScreen = (req, res, next) => {
  try {
	res.status(200).json({
	  data: splashScreenJson
	})
  } catch (e) {
	res.status(400).json({
	  data: e
	})
  }
};

const getTags = (req, res, next) => {
  try {
	res.status(200).json({
	  data: tagsJson
	})
  } catch (e) {
	res.status(400).json({
	  data: e
	})
  }
};



const testUrl = (req, res, next) => {
  let data = {
	url: 'http://www.baidu.com'
  };
  console.log('testUrl++++++', data);
  try {
	res.status(200).json({
	  data: data
	})
  } catch (e) {
	res.status(400).json({
	  data: data
	})
  }

};
exports.testUrl = testUrl;
exports.getDeals = getDeals;
exports.getBrands = getBrands;
exports.getGifts = getGifts;
exports.getHomepageCarousel = getHomepageCarousel;
exports.getItineraries = getItineraries;
exports.getProducts = getProducts;
exports.getShops = getShops;
exports.getSplashScreen = getSplashScreen;
exports.getTags = getTags;



