const express = require('express');
const find = require('cheerio-eq');
const crawler = require('crawler');
const MaoyanWantSeeModel = require('../models/MaoyanWantSeeModel');
const SettingsModel = require('../models/SettingsModel');

let headers = {};

let dataJSONHeadersSample = {};
const _crawlPagePromise = (req, res, next) => {
	return new Promise(async (resolve, reject) => {
		let $ = {};
		dataJSONHeadersSample = {
			"Host": "piaofang.maoyan.com",
			"Connection": "keep-alive",
			"Cache-Control": "max-age=0",
			"Upgrade-Insecure-Requests": "1",
			"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36",
			"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
			"Referer": "https://piaofang.maoyan.com/seat",
			"Accept-Encoding": "gzip, deflate, br",
			"Accept-Language": "zh-CN,zh;q=0.9",
			"Cookie": "_lxsdk_cuid=16b278f2da1c8-0bd217ef685a99-e353165-1fa400-16b278f2da1c8; _lxsdk=5B35B0C0878B11E9906EF30672EF100755FB61C41A934C41978723E76930287B; __mta=142417549.1559736824373.1559736824373.1559736841774.2; theme=moviepro; wantindex-city={\"city_tier\":0,\"city_id\":0,\"cityName\":\"%E5%85%A8%E5%9B%BD\"}; __mta=142417549.1559736824373.1559736841774.1560403190012.3; _lx_utm=utm_source%3Dgoogle%26utm_medium%3Dorganic; _lxsdk_s=16b4f46f13a-264-392-c4e%7C%7C18"
		};


		wantSeeDataJSONHeaderSample = {
			"GET": "/movie/1197814/wantindex?city_tier=0&city_id=0&cityName=%E5%85%A8%E5%9B%BD HTTP/1.1",
			"Host": "piaofang.maoyan.com",
			"Connection": "keep-alive",
			"Cache-Control": "max-age=0",
			"Upgrade-Insecure-Requests": "1",
			"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36",
			"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
			"Referer": "https://piaofang.maoyan.com/movie/1197814",
			"Accept-Encoding": "gzip, deflate, br",
			"Accept-Language": "zh-CN,zh;q=0.9",
			"Cookie": "_lxsdk_cuid=16b278f2da1c8-0bd217ef685a99-e353165-1fa400-16b278f2da1c8; _lxsdk=5B35B0C0878B11E9906EF30672EF100755FB61C41A934C41978723E76930287B; __mta=142417549.1559736824373.1559736824373.1559736841774.2; wantindex-city={'city_tier':0,'city_id':0,'cityName':'%E5%85%A8%E5%9B%BD'}; theme=moviepro; __mta=142417549.1559736824373.1559736841774.1560526087657.3; _lx_utm=utm_source%3Dgoogle%26utm_medium%3Dorganic; _lxsdk_s=16b5699e75e-a28-65-652%7C%7C28"
		};

		let crawlerInstance = new crawler({
			maxConnections: 10,
			// rateLimit: 3000,

			// This will be called for each crawled page
			callback: function (error, result, done) {
				if (error) {
					console.log('creating error: ', error);
					res.status(400).json({
						message: error.toString()
					});
					// done()
				} else {
					// $ is Cheerio by default
					//a lean implementation of core jQuery designed specifically for the server
					// console.log($("title").text());
					console.log('dataJSONHeadersSample+++++', dataJSONHeadersSample)
					// done();

				}
			}
		});


		headers = await SettingsModel.findOne({
			where: {
				code: req.query.headerCode
			}
		});
		headers = headers._previousDataValues;
		console.log('crawlerInstance+++++++++++', headers);

		crawlerInstance.queue({
			url: req.query.address,
			headers: JSON.parse(headers.value),
			// headers: dataJSONHeadersSample,
			callback: (error, result, done) => {
				if (error) {
					console.log('insrtance error: ', error);
					done();

					reject(error.toString());

				} else {
					// $ = result.$;
					// console.log('Grabbed', result.body.length, 'bytes');
					// console.log('$++++++++++++: ', Object.keys(result));
					done();

					resolve(result);

				}


			}
		});
	});
};


const _createRecord = (requestBody, timestamp) => {
	let _timestamp = timestamp;
	console.log('timestamp:   ', timestamp);
	if (!timestamp) {
		_timestamp = Date.now();
	}
	return new Promise((resolve, reject) => {
		MaoyanWantSeeModel.create({
			timestamp: _timestamp,
			"avgSeatView": requestBody.avgSeatView,
			"avgShowView": requestBody.avgShowView,
			"avgViewBox": requestBody.avgViewBox,
			"boxInfo": requestBody.boxInfo,
			"boxRate": requestBody.boxRate,
			"movieId": requestBody.movieId,
			"movieName": requestBody.movieName,
			"myRefundNumInfo": requestBody.myRefundNumInfo,
			"myRefundRateInfo": requestBody.myRefundRateInfo,
			"onlineBoxRate": requestBody.onlineBoxRate,
			"refundViewInfo": requestBody.refundViewInfo,
			"refundViewRate": requestBody.refundViewRate,
			"releaseInfo": requestBody.releaseInfo,
			"releaseInfoColor": requestBody.releaseInfoColor,
			"seatRate": requestBody.seatRate,
			"showInfo": requestBody.showInfo,
			"showRate": requestBody.showRate,
			"splitAvgViewBox": requestBody.splitAvgViewBox,
			"splitBoxInfo": requestBody.splitBoxInfo,
			"splitBoxRate": requestBody.splitBoxRate,
			"splitSumBoxInfo": requestBody.splitSumBoxInfo,
			"sumBoxInfo": requestBody.sumBoxInfo,
			"viewInfo": requestBody.viewInfo,
			"viewInfoV2": requestBody.viewInfoV2,
		}).then(result => {
			// console(result);
			resolve(result)
		}).catch(error => {
			reject(error)
		})
	})
};

const _createMaoyanWantSeeRecord = (requestBody, timestamp) => {
	let _timestamp = timestamp;
	console.log('timestamp:   ', timestamp);
	if (!timestamp) {
		_timestamp = Date.now();
	}
	return new Promise((resolve, reject) => {
		MaoyanWantSeeModel.create({
			timestamp: _timestamp,
			"titleChi": requestBody.titleChi,
			"title": requestBody.title,
			"releaseDate": requestBody.releaseDate,
			"platformEngName": requestBody.platformEngName,
			"platformChineseName": requestBody.platformChineseName,
			"platformType": requestBody.platformType,
			"numWantToSee": requestBody.numWantToSee,
			"byGenderMale": requestBody.byGenderMale,
			"byGenderFemale": requestBody.byGenderFemale,


			"byAge20": requestBody.byAge20,
			"byAge20To24": requestBody.byAge20To24,
			"byAge25To29": requestBody.byAge25To29,
			"byAge30To34": requestBody.byAge30To34,
			"byAge35To39": requestBody.byAge35To39,
			"byAge40": requestBody.byAge40,
			"byTier1": requestBody.byTier1,
			"byTier2": requestBody.byTier2,
			"byTier3": requestBody.byTier3,
			"byTier4": requestBody.byTier4,
		}).then(result => {
			// console(result);
			resolve(result)
		}).catch(error => {
			reject(error)
		})

	})
};

const _crawlMovieListPromise = (req, res, next) => {
	return new Promise((resolve, reject) => {
		console.log('_crawlMovieListPromise++++++++', req.query);
		_crawlPagePromise(req, res, next).then(response => {
			const $ = response.$;
			let result = [];
			let titleEL = $("#movie-list section article");
			Object.keys(titleEL).forEach(item => {
				// console.log('item+++++++', item);
				if (Number(item).toString() !== 'NaN') {
					// console.log('item+++++++', Number(item));
					let itemValue = titleEL[item].attribs['data-com'];
					result.push({
						data: itemValue,
						indexOf: itemValue.indexOf('/movie/'),
						movieId: itemValue.replace(/[^0-9]/ig, "")
					})

				}
			});
			console.log('titleEL+++++++++', titleEL.options);

			resolve(result)
		}).catch(error => {
			reject(error)
		})
	})
};

const _crawlMovieWantSeeDetailPromise = (req, res, next) => {
	return new Promise(async (resolve, reject) => {
		console.log('_crawlPagePromise+++++', req.query);

		try {
			const response = await _crawlPagePromise(req, res, next);

			console.log('_crawlPagePromise(req, res, next)+++++', req.query);
			// res.status(200).json({
			// 	data: req.query
			// });
			// console.log('_crawlPagePromise', response);
			const $ = response.$;
			let titleEL = $(".movie-baseinfo .info-title-content");
			// console.log('$+++++++++', titleEL.text());

			const rawData = {
				titleChi: $(".movie-baseinfo .info-title-content").text(),
				title: $(".movie-baseinfo .info-etitle-content").text(),
				releaseDate: $(".movie-baseinfo .score-info.ellipsis-1").text(),
				platformEngName: 'Maoyan',
				platformChineseName: '猫眼',
				platformType: 'Web',
				numWantToSee: $(".movie-baseinfo .block-wish-item.left h2").text().replace('想看', ''),
				byGenderMale: find($, ".movie-baseinfo .block-wish-detail p:eq(0)").text(),
				byGenderFemale: find($, ".movie-baseinfo .block-wish-detail p:eq(0)").text(),
				// request: req.query,
				// response: response
			};

			const result = {
				titleChi: rawData.titleChi,
				title: rawData.title,
				releaseDate: rawData.releaseDate,
				platformEngName: rawData.platformEngName,
				platformChineseName: rawData.platformChineseName,
				platformType: rawData.platformType,
				numWantToSee: rawData.numWantToSee,
				byGenderMale: rawData.byGenderMale.match(/[1-9]\d*\.\d*|0\.\d*[1-9]\d*$/) ? rawData.byGenderMale.match(/[1-9]\d*\.\d*|0\.\d*[1-9]\d*$/) + '%' : '',
				byGenderFemale: rawData.byGenderFemale.match(/[[1-9]\d*\.\d*|0\.\d*[1-9]\d*]$/g) ? String(rawData.byGenderFemale.match(/[[1-9]\d*\.\d*|0\.\d*[1-9]\d*]$/g)).split(',')[1] + '%' : ''
			};
			console.log('_crawlMovieWantSeeDetailPromise result+++++++++', result);

			resolve(result)

		} catch (e) {
			res.status(400).json({
				error: e
			});
			reject(e)
		}

	})
};

const _crawlMovieWantSeePortraitPromise = (req, res, next) => {
	return new Promise(async (resolve, reject) => {
		console.log('_crawlMovieWantSeePortraitPromise+++++', req.query);

		req.query = Object.assign(req.query, {
			address: encodeURI(req.query.address + '/wantindex?city_tier=0&city_id=0&cityName=全国')
			// address: req.query.address + '/wantindex?city_tier=0&city_id=0&cityName=全国'
		});

		try {
			const response = await _crawlPagePromise(req, res, next);

			console.log('_crawlMovieWantSeePortraitPromise(req, res, next)+++++', req.query);
			// res.status(200).json({
			// 	data: req.query
			// });
			// console.log('_crawlPagePromise', response);
			const $ = response.$;
			// console.log('$+++++++++', titleEL.text());

			const isEmpty = $(".bar-group .single-bar text").text() === '' ? true : false;

			const rawData = {

				byAge20: find($, ".bar-group .single-bar text:eq(0)").text(),
				byAge20To24: find($, ".bar-group .single-bar text:eq(1)").text(),
				byAge25To29: find($, ".bar-group .single-bar text:eq(2)").text(),
				byAge30To34: find($, ".bar-group .single-bar text:eq(3)").text(),
				byAge35To39: find($, ".bar-group .single-bar text:eq(4)").text(),
				byAge40: find($, ".bar-group .single-bar text:eq(5)").text(),
				byTier1: find($, ".linebars-list .linebars-item .linebars-value:eq(0)").text(),
				byTier2: find($, ".linebars-list .linebars-item .linebars-value:eq(1)").text(),
				byTier3: find($, ".linebars-list .linebars-item .linebars-value:eq(2)").text(),
				byTier4: find($, ".linebars-list .linebars-item .linebars-value:eq(3)").text(),
				// request: req.query,
				// html: response.body
			};

			const result = {
				// byAge20: rawData.byAge20.split('%')[0],
				byAge20: rawData.byAge20.split('%'),
				byAge20To24: rawData.byAge20To24.split('%')[1],
				byAge25To29: rawData.byAge25To29.split('%')[2],
				byAge30To34: rawData.byAge30To34.split('%')[3],
				byAge35To39: rawData.byAge35To39.split('%')[4],
				byAge40: rawData.byAge40.split('%')[5],
				byTier1: rawData.byTier1.split('%')[0],
				byTier2: rawData.byTier2.split('%')[1],
				byTier3: rawData.byTier3.split('%')[2],
				byTier4: rawData.byTier4.split('%')[3],
			};
			console.log('_crawlMovieWantSeeDetailPromise result+++++++++', result);

			resolve(rawData)

		} catch (e) {
			res.status(400).json({
				error: e
			});
			reject(e)
		}

	})
};

const crawlMovieList = async (req, res, next) => {
	_crawlMovieListPromise(req, res, next).then((response) => {
		res.status(200).json({
			data: response
		});
	}).catch(error => {
		res.status(400).json({
			error: error
		});
	})
};

const crawlMovieWantSeeDetail = async (req, res, next) => {
	return new Promise((resolve, reject) => {
		_crawlMovieWantSeeDetailPromise(req, res, next).then(response => {
			console.log('_crawlMovieWantSeeDetailPromise+++++++++++++++++++++++++++++++', response);
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

const crawlMovieWantSeePortrait = async (req, res, next) => {
	return new Promise((resolve, reject) => {
		_crawlMovieWantSeePortraitPromise(req, res, next).then(response => {
			console.log('_crawlMovieWantSeePortrait+++++++++++++++++++++++++++++++', response);
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

const oneKeyMovieWantSee = async (req, res, next) => {
	let address1 = "https://piaofang.maoyan.com/store";
	let queryWantSeeList = Object.assign(req, {
		query: {
			address: address1,
			headerCode: 'maoyanWantSee'
		}
	});

	console.log('queryWantSeeList++++++++++', queryWantSeeList.query);

	const movieList = await _crawlMovieListPromise(queryWantSeeList, res, next);
	let result = [];
	// console.log('oneKeyMovieWantSee movieList++++++++++', movieList);

	// let length = movieList.length;
	let length = 6;
	let index = 0;

	const loop = async () => {
		index++;
		item2 = movieList[index].data;
		let movieId = item2.replace(/[^0-9]/ig, "");

		let addressDetail = 'https://piaofang.maoyan.com/movie/' + movieId;
		let addressWantSee = encodeURI('https://piaofang.maoyan.com/movie/' + movieId + '/wantindex?city_tier=0&city_id=0&cityName=全国');
		// console.log('addressDetail++++++++++++', addressDetail);
		// console.log('movieId+++++++++++++++', movieId);

		const reqWantSeeDetail = req;
		const reqWantSeePortrait = req;
		const queryWantSeeList = {
			query: {
				address: addressDetail,
				headerCode: 'maoyanWantSeeDetail'
			}
		};

		const queryWantSeePortrait = {
			query: {
				address: addressWantSee,
				headerCode: 'maoyanWantSeePortrait'
			}
		};

		let data = {};
		let dataWantSee = {};

		try {
			dataWantDetail = await _crawlMovieWantSeeDetailPromise(Object.assign(req, queryWantSeeList), res, next);

			console.log(data);

			dataWantSeePortrait = await _crawlMovieWantSeePortraitPromise(Object.assign(req, queryWantSeePortrait), res, next);

			result.push({
				movieId: movieId,
				isEmptyPortrait: dataWantSeePortrait.isEmptyPortrait,
				data: Object.assign(dataWantDetail, dataWantSeePortrait.data)
			});

			if (index === length - 1) {
				console.log('result++++++++++++', result);

				res.status(200).json({
					status: 'success',
					data: result,
					index: index
				});
			} else {
				loop()
			}
		} catch (e) {
			res.status(400).json({
				error: e
			});
		}
	};

	loop()

};

const getListByPagination = (req, res, next) => {
	let pagination = {
		limit: Number(req.query.limit),
		page: Number(req.query.page),
		offset: req.query.limit * (req.query.page - 1)
	};

	MaoyanWantSeeModel.findAll({
		offset: pagination.offset,
		limit: pagination.limit,
		// order: ['DESC']
	}).then(async data => {
		res.status(200).json({
			pagination: {
				total: await MaoyanWantSeeModel.count(),
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

	MaoyanWantSeeModel.findAll({
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

	MaoyanWantSeeModel.findAll({
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

const save = (req, res, next) => {
	// console.log('postAddProduct', req.body);
	const timestamp = Date.now();

	_createRecord(req, timestamp).then(response => {
		res.status(200).json({
			data: req
		})
	}).catch(error => {
		res.status(400).json({
			message: error
		})
	})
};

const saveOneMaoyanWantSee = (req, res, next) => {
	const timestamp = Date.now();

	_createMaoyanWantSeeRecord(req, timestamp).then(response => {
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

const saveMultipleMaoyanWantSee = (req, res, next) => {
	const requestBody = req.body;
	if (!(requestBody instanceof Array)) {
		res.status(400).json({
			error: 'not array'
		})
	}
	const timestamp = Date.now();

	requestBody.forEach((item, index) => {
		_createMaoyanWantSeeRecord(item, timestamp).then(response => {
			if (index === requestBody.length - 1) {
				res.status(200).json({
					data: response
				})
			}

		}).catch(error => {
			res.status(400).json({
				error: error
			})
		})
	})
};


const crawlAndSave = (req, res, next) => {
	const address = req.query.address;
	_crawlPagePromise(req, res).then(response => {
		console.log('_crawlPagePromise', response);
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
			MaoyanWantSeeModel.findByPk(item).then(async response => {
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
		MaoyanWantSeeModel.findByPk(idBody).then(result => {
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


exports.crawlMovieList = crawlMovieList;
exports.crawlMovieWantSeeDetail = crawlMovieWantSeeDetail;
exports.crawlMovieWantSeePortrait = crawlMovieWantSeePortrait;
exports.oneKeyMovieWantSee = oneKeyMovieWantSee;
exports.save = save;
exports.saveOneMaoyanWantSee = saveOneMaoyanWantSee;
exports.saveMultipleMaoyanWantSee = saveMultipleMaoyanWantSee;
exports.getListByPagination = getListByPagination;
exports.getListByDate = getListByDate;
exports.crawlAndSave = crawlAndSave;
exports.deleteRecords = deleteRecords;
