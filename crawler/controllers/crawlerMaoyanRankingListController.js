const express = require('express');
const find = require('cheerio-eq');
const crawler = require('crawler');
const cheerio = require('cheerio');
const uuidv1 = require('uuid/v1');

const commonController = require('./commonController');
const MaoyanRecordModel = require('../models/MaoyanRecordModel');
const SettingsModel = require('../models/SettingsModel');
const {AsyncParser} = require('json2csv');
const fastCsv = require('fast-csv');
const Serializer = require('sequelize-to-json');
const fs = require('fs');

const saveOneRankingListRecord = (req, res, next) => {
	const timestamp = Date.now();

	_createRecord(req, timestamp).then(response => {
		res.status(200).json({
			message: 'success',
			data: response
		})
	}).catch(error => {
		res.status(400).json({
			error: error
		})
	})
};
const _createRecord = (requestBody, timestamp) => {
	let _timestamp = timestamp;
	requestBody = requestBody.body;
	requestBody = Object.assign(requestBody, {
		recordId: uuidv1(),
		timestamp: timestamp
	});
	// console.log('timestamp:   ', timestamp);
	console.log('requestBody:   ', requestBody);
	if (!timestamp) {
		_timestamp = Date.now();
	}
	return new Promise((resolve, reject) => {
		MaoyanRecordModel.create(requestBody).then(result => {
			resolve(result)
		}).catch(error => {
			console.log(error);
			reject(error)
		})
	})
};

const saveMultipleMaoyanRankingListRecord = (req, res, next) => {
	let requestBody = req.body;
	if (!(requestBody instanceof Array)) {
		res.status(400).json({
			error: 'not array'
		})
	}
	const timestamp = Date.now();
	requestBody = requestBody.map(item => {
		return Object.assign(item, {
			recordId: uuidv1(),
			timestamp: timestamp
		})
	});
	_createMultipleMaoyanRankingListRecordPromise(requestBody, timestamp).then(response => {
		res.status(200).json({
			data: response
		})

	}).catch(error => {
		res.status(400).json({
			error: error
		})
	});


	// requestBody.forEach((item, index) => {
	//
	// })
};

const _createMultipleMaoyanRankingListRecordPromise = (requestBody, timestamp) => {
	let _timestamp = timestamp;
	console.log('timestamp:   ', timestamp);
	if (!timestamp) {
		_timestamp = Date.now();
	}
	return new Promise((resolve, reject) => {
		MaoyanRecordModel.bulkCreate(requestBody.reverse()).then(result => {
			// console(result);
			resolve(result)
		}).catch(error => {
			reject(error)
		})

	})
};


const _crawlRankingListPromise = (req, res, next) => {
	return new Promise((resolve, reject) => {
		commonController.crawlPagePromise(req, res, next).then(response => {
			// console.log('_crawlRankingListPromise++++++++', response);

			const $ = response.$;
			let result = [];
			let titleEL = $("#ranks-list .row");
			let limit = Number(req.query.limit);
			// res.status(200).json({
			// 	limit:limit
			// });

			let offset = 0;
			Object.keys(titleEL).forEach((item, index) => {
				// console.log('item+++++++', item);
				if (Number(item).toString() !== 'NaN') {
					// console.log('item+++++++', Number(item));
					if (index - offset < limit || limit === 'NaN' || limit === '' || limit === undefined) {
						let itemValue = titleEL[item].attribs['data-com'];
						result.push({
							title: find($, '#ranks-list .row:eq(' + item + ') .first-line').text(),
							movieId: itemValue.replace(/[^0-9]/ig, ""),
							data: itemValue,
							indexOf: itemValue.indexOf('/movie/'),
						})

					}


				} else {
					offset++;
				}
			});
			// console.log('titleEL+++++++++', titleEL.options);

			resolve(result)
		}).catch(error => {
			reject(error)
		})
	})
};

const _crawlRankingListDetailPromise = (req, res, next) => {
	return new Promise(async (resolve, reject) => {

		try {
			const response = await commonController.crawlPagePromise(req, res, next);

			// console.log('commonController.crawlPagePromise(req, res, next)+++++', response.body);
			const $ = response.$;

			const rawData = {
				recordId: uuidv1(),
				titleChi: $(".movie-baseinfo .info-title-content").text(),
				title: $(".movie-baseinfo .info-etitle-content").text(),
				releaseDate: $(".movie-baseinfo .score-info.ellipsis-1").text(),
				platformEngName: 'Maoyan',
				platformChineseName: '猫眼',
				platformType: 'Web',
				numWantToSee: $('.score-detail .detail-wish-count').text(),
				rating: $('.score-block-content .rating-num').text(),
				preSaleBoxInfo: find($, ".info-presell-block .info-detail-col:eq(0) .detail-num").text(),

			};

			const result = {
				recordId: rawData.recordId,
				// 详情数据
				titleChi: rawData.titleChi,
				title: rawData.title,
				releaseDate: rawData.releaseDate,
				platformEngName: rawData.platformEngName,
				platformChineseName: rawData.platformChineseName,
				platformType: rawData.platformType,
				numWantToSee: rawData.numWantToSee,
				rating: rawData.rating,
				preSaleBoxInfo: rawData.preSaleBoxInfo

			};
			console.log('_crawlRankingListDetailPromise result+++++++++', result);

			resolve(result)

		} catch (e) {
			res.status(400).json({
				error: e
			});
			reject(e)
		}

	})
};

const crawlRankingListMoreSections = async (req, res, next) => {
	_crawlRankingListMoreSectionsPromise(req, res, next).then(response => {
		console.log('crawlRankingListMoreSections+++++++++++++++++++++++++++++++', response);
		res.status(200).json({
			data: response
		});
	}).catch(error => {
		res.status(400).json({
			error: error
		});
	})
};
const _crawlRankingListMoreSectionsPromise = (req, res, next) => {
	return new Promise(async (resolve, reject) => {
		try {
			const response = await commonController.crawlPagePromise(req, res, next);

			// console.log('commonController.crawlPagePromise(req, res, next)+++++', response.body);
			let html = '';
			// console.log('$+++++++++', cheerio);

			response.body = JSON.parse(response.body);
			Object.keys(response.body.sectionHTMLs).forEach(item => {
				console.log(item);
				html += response.body.sectionHTMLs[item].html;
			});

			const $ = cheerio.load(response.body + html);

			// console.log('commonController.crawlPagePromise++++++++++++++', JSON.stringify($(".detail-section")));
			// console.log('$+++++++++', titleEL.text());

			const rawData = {
				description: $(".detail-section .detail-item .detail-block-content").text(),
			};

			const result = {
				// 详情数据
				description: rawData.description,
			};

			console.log('_crawlRankingListMoreSectionsPromise result+++++++++', result);

			resolve(result)

		} catch (e) {
			res.status(400).json({
				error: e
			});
			reject(e)
		}

	})
};

const _trimData = selector => {
	let result = selector.html().replace('.', '').split(';');
	// console.log('_trimData+++++++++++++++++', result)
	return result.filter((item, index) => index < result.length - 2).map(item => {
		return item + ';'
	}).join('')
};

const crawlRankingListBoxOfficeDetail = async (req, res, next) => {
	_crawlRankingListBoxOfficeDetailPromise(req, res, next).then(response => {
		console.log('_crawlRankingListBoxOfficeDetailPromise+++++++++++++++++++++++++++++++', response);
		res.status(200).json({
			data: response
		});
	}).catch(error => {
		res.status(400).json({
			error: error
		});
	})
};

const crawlRankingListBoxOfficePremiere = async (req, res, next) => {
	_crawlRankingListBoxOfficePremierePromise(req, res, next).then(response => {
		console.log('_crawlRankingListBoxOfficeDetailPromise+++++++++++++++++++++++++++++++', response);
		res.status(200).json({
			data: response
		});
	}).catch(error => {
		res.status(400).json({
			error: error
		});
	})
};

const crawlRankingListBoxOfficeGlobal = async (req, res, next) => {
	_crawlRankingListBoxOfficeGlobalPromise(req, res, next).then(response => {
		console.log('_crawlRankingListBoxOfficeGlobalPromise+++++++++++++++++++++++++++++++', response);
		res.status(200).json({
			data: response
		});
	}).catch(error => {
		res.status(400).json({
			error: error
		});
	})
};

const crawlRankingListBoxOfficeBoxPremiere = async (req, res, next) => {
	_crawlRankingListBoxOfficePremierePromise(req, res, next).then(response => {
		console.log('_crawlRankingListBoxOfficeGlobalPromise+++++++++++++++++++++++++++++++', response);
		res.status(200).json({
			data: response
		});
	}).catch(error => {
		res.status(400).json({
			error: error
		});
	})
};

const crawlRankingListRating = async (req, res, next) => {
	_crawlRankingListRatingPromise(req, res, next).then(response => {
		console.log('_crawlRankingListRatingPromise+++++++++++++++++++++++++++++++', response);
		res.status(200).json({
			data: response
		});
	}).catch(error => {
		res.status(400).json({
			error: error
		});
	})
};

const crawlRankingListPreSale = async (req, res, next) => {
	_crawlRankingListPreSalePromise(req, res, next).then(response => {
		console.log('_crawlRankingListPreSalePromise+++++++++++++++++++++++++++++++', response);
		res.status(200).json({
			data: response
		});
	}).catch(error => {
		res.status(400).json({
			error: error
		});
	})
};

const _crawlRankingListPreSalePromise = async (req, res, next) => {
	return new Promise(async (resolve, reject) => {
		console.log('commonController.crawlPagePromise+++++', req.body);

		try {
			const response = await commonController.crawlPagePromise(req, res, next);

			let requestBody = response.body.replace('&#x', '\\u');
			// cheero.load(resquestBody);
			console.log('commonController.crawlPagePromise(req, res, next)+++++', req.query);
			// console.log('commonController.crawlPagePromise', response);
			const $ = response.$;


			const base64 = $('#js-nuwa').html().match(/(?<=src:url\().+.(?=\)\sformat\("woff"\))/)[0];
			res.status(200).json({
				data: base64
			});

			const rawData = {
				preSaleBoxInfo: find($, '.box-item:eq(0) .box-num').text() + find($, '.box-item:eq(0) .box-unit').text(),
				// 预售排片占比
				preSaleShowRate: find($, '.box-item:eq(1) .box-num').text(),
				// 预售排片场次
				preSaleShowInfo: find($, '.box-item:eq(2) .box-num').text(),
				// 首日预售票房
				preSaleDayOneBoxInfo: find($, '.box-item:eq(3) .box-num').text()
			};

			const result = {
				preSaleBoxInfo: rawData.preSaleBoxInfo,
				preSaleShowRate: rawData.preSaleShowRate,
				preSaleShowInfo: rawData.preSaleShowInfo,
				preSaleDayOneBoxInfo: rawData.preSaleDayOneBoxInfo,
			};
			console.log('_crawlRankingListDetailPromise result+++++++++', result);

			resolve(result)

		} catch (e) {
			res.status(400).json({
				error: e
			});
			reject(e)
		}

	})
};

const _crawlRankingListBoxOfficeDetailPromise = async (req, res, next) => {
	return new Promise(async (resolve, reject) => {

		try {
			const response = await commonController.crawlPagePromise(req, res, next);

			// cheero.load(resquestBody);
			console.log('_crawlRankingListBoxOfficePromise+++++', req.query);
			// console.log('commonController.crawlPagePromise', response);
			const $ = response.$;
			// res.status(200).json({
			// 	data: response.body
			// });


			const base64 = $('#js-nuwa').html().match(/(?<=src:url\().+.(?=\)\sformat\("woff"\))/)[0];


			const rawData = {
				boxInfo: await commonController.parseDecimal(find($, '.box-summary:eq(0) .box-item:eq(0) .box-num .cs').html(), base64) + find($, '.box-summary:eq(0) .box-item:eq(0) .box-unit').text(),
				boxInfoFirstWeek: await commonController.parseDecimal(find($, '.box-summary:eq(0) .box-item:eq(1) .box-num .cs').html(), base64) + find($, '.box-summary:eq(0) .box-item:eq(1) .box-unit').text(),
				boxInfoFirstDay: await commonController.parseDecimal(find($, '.box-summary:eq(0) .box-item:eq(1) .box-num .cs').html(), base64) + find($, '.box-summary:eq(0) .box-item:eq(2) .box-unit').text(),
				splitBoxInfo: await commonController.parseDecimal(find($, '.box-summary:eq(1) .box-item:eq(0) .box-num .cs').html(), base64) + find($, '.box-summary:eq(1) .box-item:eq(0) .box-unit').text(),
				splitBoxInfoFirstWeek: await commonController.parseDecimal(find($, '.box-summary:eq(1) .box-item:eq(1) .box-num .cs').html(), base64) + find($, '.box-summary:eq(1) .box-item:eq(1) .box-unit').text(),
				splitBoxInfoFirstDay: await commonController.parseDecimal(find($, '.box-summary:eq(1) .box-item:eq(1) .box-num .cs').html(), base64) + find($, '.box-summary:eq(1) .box-item:eq(2) .box-unit').text(),

				avgSeatView: '',
				avgShowView: '',
				avgViewBox: '',
				boxRate: '',
				myRefundNumInfo: '',
				myRefundRateInfo: '',
				onlineBoxRate: '',
				refundViewInfo: '',
				refundViewRate: '',
				releaseInfo: '',
				releaseInfoColor: '',
				seatRate: '',
				showInfo: '',
				showRate: '',
				splitAvgViewBox: '',
				splitBoxRate: '',
				splitSumBoxInfo: '',
				sumBoxInfo: '',
				viewInfo: '',
				viewInfoV2: ''
			};

			const result = {
				boxInfo: rawData.boxInfo,
				boxInfoFirstWeek: rawData.boxInfoFirstWeek,
				boxInfoFirstDay: rawData.boxInfoFirstDay,
				splitBoxInfo: rawData.splitBoxInfo,
				splitBoxInfoFirstWeek: rawData.splitBoxInfoFirstWeek,
				splitBoxInfoFirstDay: rawData.splitBoxInfoFirstDay,
				avgSeatView: '',
				avgShowView: '',
				avgViewBox: '',
				boxRate: '',
				myRefundNumInfo: '',
				myRefundRateInfo: '',
				onlineBoxRate: '',
				refundViewInfo: '',
				refundViewRate: '',
				releaseInfo: '',
				releaseInfoColor: '',
				seatRate: '',
				showInfo: '',
				showRate: '',
				splitAvgViewBox: '',
				splitBoxRate: '',
				splitSumBoxInfo: '',
				sumBoxInfo: '',
				viewInfo: '',
				viewInfoV2: ''
			};
			console.log('_crawlRankingListDetailPromise result+++++++++', result);

			resolve(result)

		} catch (e) {
			reject(e)
		}

	})
};


const _crawlRankingListBoxOfficePremierePromise = async (req, res, next) => {
	return new Promise(async (resolve, reject) => {
		try {
			const response = await commonController.crawlPagePromise(req, res, next);

			console.log('_crawlRankingListBoxOfficePremierePromise+++++', req.query);
			// console.log('commonController.crawlPagePromise', response);
			const $ = response.$;
			// const base64 = $('#js-nuwa').html().match(/(?<=src:url\().+.(?=\)\sformat\("woff"\))/)[0];

			const rawData = {
				preSaleBoxInfo: find($, '.box-summary .box-item:eq(0) .box-num').text() + find($, '.box-summary .box-item:eq(0) .box-unit').text(),
				preSaleShowRate: find($, '.box-summary .box-item:eq(1) .box-num').text(),
				preSaleShowInfo: find($, '.box-summary .box-item:eq(2) .box-num').text() + find($, '.box-summary .box-item:eq(2) .box-unit').text()
			};
			const result = {
				preSaleBoxInfo: rawData.preSaleBoxInfo,
				preSaleShowRate: rawData.preSaleShowRate,
				preSaleShowInfo: rawData.preSaleShowInfo,
			};
			console.log('_crawlRankingListBoxOfficeGlobalPromise result+++++++++', result);

			resolve(result)
		} catch (e) {
			reject(e)
		}

	})
};


const _crawlRankingListBoxOfficeGlobalPromise = async (req, res, next) => {
	return new Promise(async (resolve, reject) => {
		try {
			const response = await commonController.crawlPagePromise(req, res, next);

			console.log('_crawlRankingListBoxOfficeGlobalPromise+++++', req.query);
			// console.log('commonController.crawlPagePromise', response);
			const $ = response.$;
			// const base64 = $('#js-nuwa').html().match(/(?<=src:url\().+.(?=\)\sformat\("woff"\))/)[0];

			const rawData = {
				globalBoxInfo: find($, '.section-sum .desc:eq(0) .value span:eq(0)').text() + find($, '.section-sum .desc:eq(0) .unit').text(),
				northAmericaBoxInfo: find($, '.section-sum .desc:eq(1) .value span:eq(0)').text() + find($, '.section-sum .desc:eq(1) .unit').text(),
				imdbRating: find($, '.section-sum .desc:eq(1) .value span').text() + find($, '.section-sum .desc:eq(2) .unit').text()
			};
			const result = {
				globalBoxInfo: rawData.globalBoxInfo,
				northAmericaBoxInfo: rawData.northAmericaBoxInfo,
				imdbRating: rawData.imdbRating,
			};
			console.log('_crawlRankingListBoxOfficeGlobalPromise result+++++++++', result);

			resolve(result)
		} catch (e) {
			reject(e)
		}

	})
};

const _crawlRankingListRatingPromise = async (req, res, next) => {
	return new Promise(async (resolve, reject) => {
		console.log('commonController.crawlPagePromise+++++', req.body);

		try {
			const response = await commonController.crawlPagePromise(req, res, next);

			let requestBody = response.body.replace('&#x', '\\u');
			// cheero.load(resquestBody);
			console.log('commonController.crawlPagePromise(req, res, next)+++++', req.query);
			// console.log('commonController.crawlPagePromise', response);
			const $ = response.$;
			// res.status(200).json({
			// 	data: requestBody
			// });


			const base64 = $('#js-nuwa').html().match(/(?<=src:url\().+.(?=\)\sformat\("woff"\))/)[0];


			const rawData = {
				rating: await commonController.parseDecimal($('.score-num .cs').html(), base64),
				numOfRating: await commonController.parseDecimal($('.score-count .cs').html(), base64),
				rating9To10: find($, '.movie-comments .distribute-item:eq(0) .distribute-val').text(),
				rating7To8: find($, '.movie-comments .distribute-item:eq(1) .distribute-val').text(),
				rating5To6: find($, '.movie-comments .distribute-item:eq(2) .distribute-val').text(),
				rating3To4: find($, '.movie-comments .distribute-item:eq(3) .distribute-val').text(),
				rating1To2: find($, '.movie-comments .distribute-item:eq(4) .distribute-val').text(),
				ratingByGenderMale: await commonController.parseDecimal($('.persona-gender-male .persona-item-value .cs').html()
					, base64),
				ratingByGenderFemale: await commonController.parseDecimal($('.persona-gender-female .persona-item-value .cs').html()
					, base64),
				ratingByAge20: await commonController.parseDecimal(find($, '.persona-item-value:eq(2) .cs').html(), base64)+'%',
				ratingByAge20To24: await commonController.parseDecimal(find($, '.persona-item-value:eq(3) .cs').html(), base64)+'%',
				ratingByAge25To29: await commonController.parseDecimal(find($, '.persona-item-value:eq(4) .cs').html(), base64)+'%',
				ratingByAge30To34: await commonController.parseDecimal(find($, '.persona-item-value:eq(5) .cs').html(), base64)+'%',
				ratingByAge35To39: await commonController.parseDecimal(find($, '.persona-item-value:eq(6) .cs').html(), base64)+'%',
				ratingByAge40: await commonController.parseDecimal(find($, '.persona-item-value:eq(7) .cs').html(), base64)+'%',
				ratingByTier1: await commonController.parseDecimal(find($, '.persona-item-value:eq(8) .cs').html(), base64)+'%',
				ratingByTier2: await commonController.parseDecimal(find($, '.persona-item-value:eq(9) .cs').html(), base64)+'%',
				ratingByTier3: await commonController.parseDecimal(find($, '.persona-item-value:eq(10) .cs').html(), base64)+'%',
				ratingByTier4: await commonController.parseDecimal(find($, '.persona-item-value:eq(11) .cs').html(), base64)+'%',
			};

			const result = {
				rating: rawData.rating,
				numOfRating: rawData.numOfRating,
				rating1To2: rawData.rating1To2,
				rating3To4: rawData.rating3To4,
				rating5To6: rawData.rating5To6,
				rating7To8: rawData.rating7To8,
				rating9To10: rawData.rating9To10,
				ratingByGenderMale: rawData.ratingByGenderMale,
				ratingByGenderFemale: rawData.ratingByGenderFemale,
				ratingByAge20: rawData.ratingByAge20,
				ratingByAge20To24: rawData.ratingByAge20To24,
				ratingByAge25To29: rawData.ratingByAge25To29,
				ratingByAge30To34: rawData.ratingByAge30To34,
				ratingByAge35To39: rawData.ratingByAge35To39,
				ratingByAge40: rawData.ratingByAge40,
				ratingByTier1: rawData.ratingByTier1,
				ratingByTier2: rawData.ratingByTier2,
				ratingByTier3: rawData.ratingByTier3,
				ratingByTier4: rawData.ratingByTier4,
			};
			console.log('_crawlRankingListDetailPromise result+++++++++', result);

			resolve(result)

		} catch (e) {
			res.status(400).json({
				error: e
			});
			reject(e)
		}

	})
};


const _crawlRankingListWantToSeePortraitPromise = (req, res, next) => {
	return new Promise(async (resolve, reject) => {
		console.log('_crawlRankingListWantToSeePortraitPromise+++++', req.query);

		req.query = Object.assign(req.query, {
			address: encodeURI(req.query.address + '/wantindex?city_tier=0&city_id=0&cityName=全国')
			// address: req.query.address + '/wantindex?city_tier=0&city_id=0&cityName=全国'
		});

		try {
			const response = await commonController.crawlPagePromise(req, res, next);

			console.log('_crawlRankingListWantToSeePortraitPromise(req, res, next)+++++', req.query);
			// res.status(200).json({
			// 	data: req.query
			// });
			// console.log('commonController.crawlPagePromise', response);
			const $ = response.$;
			// console.log('$+++++++++', titleEL.text());

			const base64 = $('#js-nuwa').html().match(/(?<=src:url\().+.(?=\)\sformat\("woff"\))/)[0];

			const isEmpty = $(".bar-group .single-bar text").text() === '' ? true : false;

			const rawData = {
				wantToSeeByGenderMale: await commonController.parseDecimal(_trimData(find($, '.stackcolumn-desc .cs:eq(0)')), base64) + '%',
				wantToSeeByGenderFemale: await commonController.parseDecimal(_trimData(find($, '.stackcolumn-desc .cs:eq(1)')), base64) + '%',
				wantToSeeByAge20: find($, ".bar-group .single-bar text:eq(0)").text(),
				wantToSeeByAge20To24: find($, ".bar-group .single-bar text:eq(1)").text(),
				wantToSeeByAge25To29: find($, ".bar-group .single-bar text:eq(2)").text(),
				wantToSeeByAge30To34: find($, ".bar-group .single-bar text:eq(3)").text(),
				wantToSeeByAge35To39: find($, ".bar-group .single-bar text:eq(4)").text(),
				wantToSeeByAge40: find($, ".bar-group .single-bar text:eq(5)").text(),
				wantToSeeByTier1: find($, ".linebars-list .linebars-item .linebars-value:eq(0)").text(),
				wantToSeeByTier2: find($, ".linebars-list .linebars-item .linebars-value:eq(1)").text(),
				wantToSeeByTier3: find($, ".linebars-list .linebars-item .linebars-value:eq(2)").text(),
				wantToSeeByTier4: find($, ".linebars-list .linebars-item .linebars-value:eq(3)").text(),
				// request: req.query,
				// html: response.body
			};

			const result = {
				wantToSeeByGenderMale: rawData.wantToSeeByGenderMale,
				wantToSeeByGenderFemale: rawData.wantToSeeByGenderFemale,
				wantToSeeByAge20: rawData.wantToSeeByAge20,
				wantToSeeByAge20To24: rawData.wantToSeeByAge20To24,
				wantToSeeByAge25To29: rawData.wantToSeeByAge25To29,
				wantToSeeByAge30To34: rawData.wantToSeeByAge30To34,
				wantToSeeByAge35To39: rawData.wantToSeeByAge35To39,
				wantToSeeByAge40: rawData.wantToSeeByAge40,
				wantToSeeByTier1: rawData.wantToSeeByTier1,
				wantToSeeByTier2: rawData.wantToSeeByTier2,
				wantToSeeByTier3: rawData.wantToSeeByTier3,
				wantToSeeByTier4: rawData.wantToSeeByTier4,
			};
			console.log('_crawlRankingListDetailPromise result+++++++++', result);

			resolve(rawData)

		} catch (e) {
			reject(e);

			res.status(400).json({
				error: e
			});
		}

	})
};

const crawlRankingList = async (req, res, next) => {
	console.log('req++++++++++++++++', req.method);
	_crawlRankingListPromise(req, res, next).then(response => {
		res.status(200).json(response);

	}).catch(error => {
		res.status(400).json({
			message: error.toString()
		});
	})


};

const crawlRankingListByYear = async (req, res, next) => {
	_crawlRankingListbyYearPromise(req, res, next).then(response => {
		res.status(200).json({
			data: response
		});
	}).catch(error => {
		res.status(400).json({
			error: error.toString()
		});
	})
};

const _crawlRankingListbyYearPromise = async (req, res, next) => {
	return new Promise((resolve, reject) => {
		commonController.crawlPagePromise(req, res, next).then(response => {
			console.log('responseA+++++++++++++', response.yearlist);
			// res.status(200).json(response);
			// res.status(200).json(response.body);

			const $ = response.$;

			let result = [];
			let listItem = $('#ranks-list .row');
			let limit = req.body.limit;
			let offset = 0;


			console.log('#ranks-list .row .first-line+++++++++++++++++', typeof listItem);
			// console.log('#ranks-list .row .first-line+++++++++++++++++', $('#ranks-list .row').text().length);

			Object.keys(listItem).forEach((item, index) => {
				if (Number(item).toString() !== 'NaN') {
					index = index - offset;
					if (index < Number(limit) || Number(limit) === 0 || limit === '' || limit === undefined) {

						let itemValue = listItem[item].attribs['data-com'];

						result.push({
							// data: itemValue,
							movieId: itemValue.replace(/[^0-9]/ig, ""),
							title: listItem.find('.first-line').text(),
						})
						// result.push($('#ranks-list .row'))
					}

				} else {
					offset++
				}

			});
			offset = 0;
			Object.keys(listItem.find('.first-line')).forEach((item, index) => {
				if (Number(item).toString() !== 'NaN') {
					index = index - offset;
					if (index < Number(limit) || Number(limit) === 0 || limit === '' || limit === undefined) {
						// console.log(listItem.find('.first-line')[item].children[0].data);
						result[index].title = listItem.find('.first-line')[item].children[0].data
					}
				} else {
					offset++
				}
			});
			offset = 0;
			resolve(result)

		}).catch(error => {
			reject(error)
		})
	})
};


const crawlRankingListDetail = async (req, res, next) => {
	return new Promise((resolve, reject) => {
		_crawlRankingListDetailPromise(req, res, next).then(response => {
			console.log('_crawlRankingListDetailPromise+++++++++++++++++++++++++++++++', response);
			res.status(200).json({
				data: response
			});
		}).catch(error => {
			res.status(400).json({
				error: error
			});
		})
	})
};


const crawlRankingListWantToSeePortrait = async (req, res, next) => {
	return new Promise((resolve, reject) => {
		_crawlRankingListWantToSeePortraitPromise(req, res, next).then(response => {
			console.log('_crawlRankingListWantToSeePortrait+++++++++++++++++++++++++++++++', response);
			resolve(response);
			res.status(200).json({
				data: response
			});
		}).catch(error => {
			reject(error);
			res.status(400).json({
				error: error
			});
		})
	})
};


const getListByPagination = (req, res, next) => {
	let pagination = {
		limit: Number(req.query.limit),
		page: Number(req.query.page),
		offset: req.query.limit * (req.query.page - 1)
	};

	MaoyanRecordModel.findAll({
		offset: pagination.offset,
		limit: pagination.limit,
		// order: ['DESC']
	}).then(async data => {
		res.status(200).json({
			pagination: {
				total: await MaoyanRecordModel.count(),
			},
			data: data
		})
	}).catch(error => {
		res.status(400).json({
			error: {
				message: error,
				req: pagination
			}
		})
	})
};

const getCrawlDate = (req, res, next) => {
	let query = {
		limit: Number(req.query.limit),
		page: Number(req.query.page),
		offset: req.query.page * (req.query.page - 1)
	};

	MaoyanRecordModel.findAll({
		offset: pagination.offset,
		limit: pagination.limit
	}).then(data => {
		res.status(200).json({
			req: pagination,
			data: data
		})
	}).catch(error => {
		res.status(400).json({
			error: {
				message: error,
				req: pagination
			}
		})
	})
};

const getListByDate = (req, res, next) => {
	let query = {
		limit: Number(req.query.limit),
		page: Number(req.query.page),
		offset: req.query.page * (req.query.page - 1)
	};

	MaoyanRecordModel.findAll({
		offset: pagination.offset,
		limit: pagination.limit
	}).then(data => {
		res.status(200).json({
			req: pagination,
			data: data
		})
	}).catch(error => {
		res.status(400).json({
			error: {
				message: error,
				req: pagination
			}
		})
	})
};

const saveMultipleMovieData = (req, res, next) => {
	// console.log('postAddProduct', req.body);
	const timestamp = Date.now();

	_createRecord(req, timestamp).then(response => {
		res.status(200).json({
			body: req.body
		})
	}).catch(error => {
		res.status(400).json({
			error: error
		})
	})
};


const crawlAndSave = (req, res, next) => {
	const address = req.query.address;
	commonController.crawlPagePromise(req, res).then(response => {
		console.log('commonController.crawlPagePromise', response);
		const timestamp = Date.now();

		let count = 0;
		const loop = () => {
			_createRecord(response.data.list[count], timestamp).then(response2 => {
				if (count === response.data.list.length - 1) {
					res.status(200).json(response);
				} else {
					loop();
					count++
				}
			}).catch(error => {
				res.status(400).json({
					message: error2
				});
			})
		};

		loop();
		// response.data.list.forEach((item, index) => {
		// 	_createRecord(item, timestamp).then(response2 => {
		// 		if (index === response.data.list.length - 1) {
		// 			res.status(200).json(response);
		// 		}
		// 	}).catch(error => {
		// 		res.status(400).json({
		// 			message: error2
		// 		});
		// 	})
		//
		// });
	}).catch(error => {
		res.status(400).json({
			message: error
		});
	})
};

const deleteRecords = (req, res, next) => {
	console.log(req.body);
	console.log(req.params);
	const idBody = req.body.id;
	console.log(idBody instanceof Array);
	if (idBody instanceof Array) {
		idBody.forEach((item, index) => {
			MaoyanRecordModel.findByPk(item).then(async response => {
				const result = await response.destroy();
				if (index + 1 === req.body.id.length) {
					res.status(200).json({
						message: 'Delete successful',
						body: result
					});
				}
			}).catch(error => {
				res.status(400).json({
					message: 'Delete failed',
					error: error.toString()
				});
			})
		})
	} else {
		MaoyanRecordModel.findByPk(idBody).then(result => {
			console.log(result);
			result.destroy().then(() => {
				if (index + 1 === req.body.id.length) {
					res.status(200).json({
						message: 'Delete successful',
						body: result
					});
				}
			})
		}).catch(error => {
			res.status(400).json({
				message: 'Delete failed',
				error: error.toString()
			});
		})
	}
};

const exportCSV = (req, res, getTitle, rows, fileName) => {
	MaoyanRecordModel.findAll().then(response => {
		// console.log(res.json(response));
		try {
			if (sname == 'JSON') {
				res.attachment('nation.txt');
				res.send(nations);
			} else if (sname == 'CSV') {
				var ites = [];
				var lines = items.split(',');
				for (var i = 0; i < lines.length; i++) {
					ites.push(lines[i]);
				}
				json2csv({
					data: nations,
					fields: ites
				}, function (err, csv) {
					var iconv = new Iconv('UTF-8', encode);
					content = iconv.convert(csv);
					res.attachment('nation.csv');
					res.send(content);
				})

			}
		} catch (error) {
			// console.error(error);
			res.status(400).json({
				message: 'error',
				error: response
			})
		}


	}).catch(error => {
		res.status(400).json({
			error: error
		})
	})
};

const fontParser = (req, res, next) => {
	fs.readFile(req.query.address, function (err, contents) {
		if (err) throw err;
		woff2Parser(contents).then(function (result) {
			console.log(result);
			res.status(200).json({
				data: result
			})
		}).catch(error => {
			res.status(400).json({
				data: result
			})
		})
	});
};


exports.crawlRankingList = crawlRankingList;
exports.crawlRankingListByYear = crawlRankingListByYear;
exports.crawlRankingListDetail = crawlRankingListDetail;
exports.crawlRankingListRating = crawlRankingListRating;

exports.crawlRankingListBoxOfficeDetail = crawlRankingListBoxOfficeDetail;
exports.crawlRankingListBoxOfficeGlobal = crawlRankingListBoxOfficeGlobal;
exports.crawlRankingListBoxOfficeBoxPremiere = crawlRankingListBoxOfficeBoxPremiere;
exports.crawlRankingListMoreSections = crawlRankingListMoreSections;
exports.crawlRankingListWantToSeePortrait = crawlRankingListWantToSeePortrait;

exports.crawlRankingListPreSale = crawlRankingListPreSale;
exports.saveOneRankingListRecord = saveOneRankingListRecord;
exports.saveMultipleMaoyanRankingListRecord = saveMultipleMaoyanRankingListRecord;
exports.getListByPagination = getListByPagination;
exports.getListByDate = getListByDate;
exports.crawlAndSave = crawlAndSave;
exports.deleteRecords = deleteRecords;
exports.exportCSV = exportCSV;

exports.fontParser = fontParser;
