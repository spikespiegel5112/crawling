const express = require('express');
const crawler = require('crawler');
const WantSeeMaoyanModel = require('../models/WantSeeMaoyanModel');
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


		// try {
		//
		// 	// res.status(200).json({
		// 	// 	headers
		// 	// })
		// } catch (e) {
		// 	res.status(400).json({
		// 		error: e,
		// 		req: req.query
		// 	})
		// }

		console.log('crawlerInstance+++++++++++', headers);

		crawlerInstance.queue({
			url: req.query.address,
			// headers: JSON.parse(headers.value),
			headers: dataJSONHeadersSample,
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
		MaoyanRecords.create({
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

const _crawlMovieDetailPromise = (req, res, next) => {
	return new Promise(async (resolve, reject) => {
		console.log('_crawlPagePromise+++++', req.query);

		_crawlPagePromise(req, res, next).then(response => {
			console.log('_crawlPagePromise(req, res, next)+++++', req.query);
			// res.status(200).json({
			// 	data: req.query
			// });
			// console.log('_crawlPagePromise', response);
			const $ = response.$;
			let titleEL = $(".movie-baseinfo .info-title-content");
			// console.log('$+++++++++', titleEL.text());

			const result = {
				titleChi: $(".movie-baseinfo .info-title-content").text(),
				title: $(".movie-baseinfo .info-etitle-content").text(),
				releaseDate: $(".movie-baseinfo .score-info.ellipsis-1").text(),
				platformEngName: 'Maoyan',
				platformChineseName: '猫眼',
				platformType: 'Web',
				numWantToSee: $(".movie-baseinfo .block-wish-item.left h2").text(),
				byGenderMale: $(".movie-baseinfo .block-wish-detail p").text(),
				byGenderFemale: $(".movie-baseinfo .block-wish-detail p").text()
			};

			console.log('_crawlMovieDetailPromise result+++++++++', result);
			resolve(result)
		}).catch(error => {
			reject(error)
		})
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

const crawlMovieDetail = async (req, res, next) => {
	return new Promise((resolve, reject) => {
		_crawlMovieDetailPromise(req, res, next).then(response => {
			console.log('_crawlMovieDetailPromise+++++++++++++++++++++++++++++++', response);
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

const oneKeyMovieDetail = async (req, res, next) => {
	let address1 = "https://piaofang.maoyan.com/store";
	let reqWithAddress1 = Object.assign(req, {
		query: {
			address: address1,
			headerCode: 'maoyanWantSee'
		}
	});

	console.log('reqWithAddress1++++++++++', reqWithAddress1.query);


	const movieList = await _crawlMovieListPromise(reqWithAddress1, res, next);
	let result = [];
	// console.log('oneKeyMovieDetail movieList++++++++++', movieList);

	let length = 4;
	movieList.filter((item, index) => index < length).forEach(async (item, index) => {
		item = item.data;
		let movieId = item.replace(/[^0-9]/ig, "");

		let address2 = 'https://piaofang.maoyan.com/movie/' + movieId;
		// console.log('address2++++++++++++', address2);
		// console.log('movieId+++++++++++++++', movieId);

		let reqWithAddress2 = Object.assign(req, {
			query: {
				address: address2,
				headerCode: 'maoyanWantSee'
			}
		});
		let data = {};
		console.log('index++++++', index);

		try {
			data = await _crawlMovieDetailPromise(reqWithAddress2, res, next);

			result.push({
				movieId: movieId,
				data: data
			});
			if (index === length - 1) {
				res.status(200).json({
					status: 'success',
					data: result
				});
			}
		} catch (e) {
			res.status(400).json({
				error: e
			});
		}

		// _crawlMovieDetailPromise(reqWithAddress2, res, next).then(response => {
		// 	// data = response;
		//
		// 	console.log('result+++++++++++++++', result);
		//
		//
		// }).catch(error => {
		// 	res.status(400).json({
		// 		error: error
		// 	});
		// })


	});


};

const crawl = async (req, res, next) => {
	console.log(req.query.address);
	const movieIndexList = await _extractMovieListPromise(req, res, next);
	res.status(200).json({
		// keys: Object.keys(result),
		// length: result.length,
		// typeof: result instanceof Array,
		data: movieIndexList,
		// body: response.body
	});
};

const getListByPagination = (req, res, next) => {
	let pagination = {
		limit: Number(req.query.limit),
		page: Number(req.query.page),
		offset: req.query.limit * (req.query.page - 1)
	};

	MaoyanRecords.findAll({
		offset: pagination.offset,
		limit: pagination.limit,
		// order: ['DESC']
	}).then(async data => {
		res.status(200).json({
			pagination: {
				total: await MaoyanRecords.count(),
			},
			data: data
		})
	}).catch(error => {
		res.status(500).json({
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

	MaoyanRecords.findAll({
		offset: pagination.offset,
		limit: pagination.limit
	}).then(data => {
		res.status(200).json({
			req: pagination,
			data: data
		})
	}).catch(error => {
		res.status(500).json({
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

	MaoyanRecords.findAll({
		offset: pagination.offset,
		limit: pagination.limit
	}).then(data => {
		res.status(200).json({
			req: pagination,
			data: data
		})
	}).catch(error => {
		res.status(500).json({
			error: {
				message: error,
				req: pagination
			}
		})
	})
};

const save = (req, res, next) => {
	// console.log('postAddProduct', req.body);
	const maoyanData = {
		"avgSeatView": "3.0%",
		"avgShowView": "3",
		"avgViewBox": "39.2",
		"boxInfo": "46.21",
		"boxRate": "0.9%",
		"movieId": "1207959",
		"movieName": "阿拉丁",
		"myRefundNumInfo": "--",
		"myRefundRateInfo": "--",
		"onlineBoxRate": "--",
		"refundViewInfo": "--",
		"refundViewRate": "--",
		"releaseInfo": "上映14天",
		"releaseInfoColor": "#666666 1.00",
		"seatRate": "0.9%",
		"showInfo": "4701",
		"showRate": "1.3%",
		"splitAvgViewBox": "35.7",
		"splitBoxInfo": "42.00",
		"splitBoxRate": "0.9%",
		"splitSumBoxInfo": "2.71亿",
		"sumBoxInfo": "2.92亿",
		"viewInfo": "1.1",
		"viewInfoV2": "1.1万"
	};
	const timestamp = Date.now();

	_createRecord(req, timestamp).then(response => {
		res.status(200).json({
			data: req
		})
	}).catch(error => {
		res.status(500).json({
			message: error
		})
	})


};


const crawlAndSave = (req, res, next) => {
	const address = req.query.address;
	_crawlPagePromise(req, res).then(response => {
		console.log('_crawlPagePromise', response);
		const timestamp = Date.now();

		response.data.list.forEach((item, index) => {
			_createRecord(item, timestamp).then(response2 => {
				if (index === response.data.list.length - 1) {
					res.status(200).json(response);
				}
			}).catch(error => {
				res.status(500).json({
					message: error2
				});
			})

		});
	}).catch(error => {
		res.status(500).json({
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
			MaoyanRecords.findByPk(item).then(async response => {
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
		MaoyanRecords.findByPk(idBody).then(result => {
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


exports.crawl = crawl;
exports.crawlMovieList = crawlMovieList;
exports.crawlMovieDetail = crawlMovieDetail;
exports.oneKeyMovieDetail = oneKeyMovieDetail;
exports.save = save;
exports.getListByPagination = getListByPagination;
exports.getListByDate = getListByDate;
exports.crawlAndSave = crawlAndSave;
exports.deleteRecords = deleteRecords;
