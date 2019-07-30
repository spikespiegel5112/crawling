const express = require('express');
const find = require('cheerio-eq');
const crawler = require('crawler');

const commonController = require('./commonController');
const MaoyanPreSaleModel = require('../models/MaoyanPreSaleModel');
const SettingsModel = require('../models/SettingsModel');
const {AsyncParser} = require('json2csv');
const fastCsv = require('fast-csv');
const Serializer = require('sequelize-to-json');
const fs = require('fs');

let headers = {};

let dataJSONHeadersSample = {};

const _trimData = selector => {
	let result = selector.html().replace('.', '').split(';');
	// console.log('_trimData+++++++++++++++++', result)
	return result.filter((item, index) => index < result.length - 2).map(item => {
		return item + ';'
	}).join('')
};

const _createRecordPromise = (requestBody, timestamp) => {
	let _timestamp = timestamp;
	console.log('timestamp:   ', timestamp);
	if (!timestamp) {
		_timestamp = Date.now();
	}
	return new Promise((resolve, reject) => {
		MaoyanPreSaleModel.create({
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

const _createMaoyanPreSaleRecord = (requestBody, timestamp) => {
	let _timestamp = timestamp;
	console.log('timestamp:   ', timestamp);
	if (!timestamp) {
		_timestamp = Date.now();
	}
	return new Promise((resolve, reject) => {
		MaoyanPreSaleModel.create({
			timestamp: _timestamp,
			"titleChi": requestBody.titleChi,
			"title": requestBody.title,
			"releaseDate": requestBody.releaseDate,
			"platformEngName": requestBody.platformEngName,
			"platformChineseName": requestBody.platformChineseName,
			"platformType": requestBody.platformType,
			"numWantToSee": requestBody.numWantToSee,

			"wantToSeeByGenderMale": requestBody.byGenderMale,
			"wantToSeeByGenderFemale": requestBody.byGenderFemale,
			"wantToSeeByAge20": requestBody.byAge20,
			"wantToSeeByAge20To24": requestBody.byAge20To24,
			"wantToSeeByAge25To29": requestBody.byAge25To29,
			"wantToSeeByAge30To34": requestBody.byAge30To34,
			"wantToSeeByAge35To39": requestBody.byAge35To39,
			"wantToSeeByAge40": requestBody.byAge40,
			"wantToSeeByTier1": requestBody.byTier1,
			"wantToSeeByTier2": requestBody.byTier2,
			"wantToSeeByTier3": requestBody.byTier3,
			"wantToSeeByTier4": requestBody.byTier4,

			"premiereBoxInfo": requestBody.premiereBoxInfo,
			"premiereShowRate": requestBody.premiereShowRate,
			"premiereShowInfo": requestBody.premiereShowInfo,
		}).then(result => {
			// console(result);
			resolve(result)
		}).catch(error => {
			reject(error)
		})

	})
};

const _createMultipleMaoyanPreSaleRecord = (requestBody, timestamp) => {
	let _timestamp = timestamp;
	console.log('timestamp:   ', timestamp);
	if (!timestamp) {
		_timestamp = Date.now();
	}
	return new Promise((resolve, reject) => {
		MaoyanPreSaleModel.bulkCreate(requestBody).then(result => {
			// console(result);
			resolve(result)
		}).catch(error => {
			reject(error)
		})

	})
};


const _crawlMoviePreSaleDetailPromise = (req, res, next) => {
	return new Promise(async (resolve, reject) => {
		console.log('crawlPagePromise+++++', req.query);

		try {
			const response = await commonController.crawlPagePromise(req, res, next);

			console.log('crawlPagePromise(req, res, next)+++++', req.query);
			// res.status(200).json({
			// 	data: req.query
			// });
			// console.log('crawlPagePromise', response);
			const $ = response.$;
			// console.log('$+++++++++', titleEL.text());

			const rawData = {
				titleChi: $(".movie-baseinfo .info-title-content").text(),
				title: $(".movie-baseinfo .info-etitle-content").text(),
				releaseDate: $(".movie-baseinfo .score-info.ellipsis-1").text(),
				platformEngName: 'Maoyan',
				platformChineseName: '猫眼',
				platformType: 'Web',
				numWantToSee: $(".movie-baseinfo .block-wish-item.left h2").text().replace('想看', '').trim(),
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
			console.log('_crawlMoviePreSaleDetailPromise result+++++++++', result);

			resolve(result)

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

const _crawlMovieListPromise = (req, res, next) => {
	return new Promise((resolve, reject) => {
		console.log('_crawlMovieListPromise++++++++', req.query);
		commonController.crawlPagePromise(req, res, next).then(response => {
			const $ = response.$;
			let result = [];
			let titleEL = $("#movie-list section article");
			let limit = Number(req.query.limit);
			// res.status(200).json({
			// 	limit:limit
			// });
			let offset = 0;

			Object.keys(titleEL).forEach((item, index) => {
				// console.log('item+++++++', item);
				if (Number(item).toString() !== 'NaN') {
					// console.log('item+++++++', Number(item));
					if (index < Number(limit) || Number(limit) === 0 || limit === '' || limit === undefined) {
						let itemValue = titleEL[item].attribs['data-com'];
						result.push({
							indexOf: itemValue.indexOf('/movie/'),
							movieId: itemValue.replace(/[^0-9]/ig, ""),
							title: find($, "#movie-list section article:eq(" + index + ") .title").text()
						})
					}
				}
			});
			console.log('titleEL+++++++++', titleEL.options);

			resolve(result)
		}).catch(error => {
			reject(error)
		})
	})
};

const crawlMoviePreSaleDetail = async (req, res, next) => {
	return new Promise((resolve, reject) => {
		_crawlMoviePreSaleDetailPromise(req, res, next).then(response => {
			console.log('_crawlMoviePreSaleDetailPromise+++++++++++++++++++++++++++++++', response);
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

const crawlPreSaleWantToSeePortrait = async (req, res, next) => {
	return new Promise((resolve, reject) => {
		_crawlPreSaleWantToSeePortraitPromise(req, res, next).then(response => {
			console.log('_crawlPreSaleWantToSeePortrait+++++++++++++++++++++++++++++++', response);
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
const _crawlPreSaleWantToSeePortraitPromise = (req, res, next) => {
	return new Promise(async (resolve, reject) => {
		console.log('_crawlPreSaleWantToSeePortraitPromise+++++', req.query);

		req.query = Object.assign(req.query, {
			address: encodeURI(req.query.address + '/wantindex?city_tier=0&city_id=0&cityName=全国')
			// address: req.query.address + '/wantindex?city_tier=0&city_id=0&cityName=全国'
		});

		try {
			const response = await commonController.crawlPagePromise(req, res, next);

			console.log('_crawlPreSaleWantToSeePortraitPromise(req, res, next)+++++', req.query);

			// console.log('crawlPagePromise', response);
			const $ = response.$;
			// console.log('$+++++++++', titleEL.text());

			const isEmpty = $(".no-persona").text() !== '';

			if (isEmpty) {
				const rawData = {
					wantToSeeByGenderMale: '',
					wantToSeeByGenderFemale: '',
					wantToSeeByAge20: '',
					wantToSeeByAge20To24: '',
					wantToSeeByAge25To29: '',
					wantToSeeByAge30To34: '',
					wantToSeeByAge35To39: '',
					wantToSeeByAge40: '',
					wantToSeeByTier1: '',
					wantToSeeByTier2: '',
					wantToSeeByTier3: '',
					wantToSeeByTier4: '',
				};
				// res.status(200).json({
				// 	data: rawData
				// });
				resolve(rawData)
			} else {
				const base64 = $('#js-nuwa').html().match(/(?<=src:url\().+.(?=\)\sformat\("woff"\))/)[0];
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
					wantToSeeByAge20: rawData.wantToSeeByAge20.split('%'),
					wantToSeeByAge20To24: rawData.wantToSeeByAge20To24.split('%')[1],
					wantToSeeByAge25To29: rawData.wantToSeeByAge25To29.split('%')[2],
					wantToSeeByAge30To34: rawData.wantToSeeByAge30To34.split('%')[3],
					wantToSeeByAge35To39: rawData.wantToSeeByAge35To39.split('%')[4],
					wantToSeeByAge40: rawData.wantToSeeByAge40.split('%')[5],
					wantToSeeByTier1: rawData.wantToSeeByTier1.split('%')[0],
					wantToSeeByTier2: rawData.wantToSeeByTier2.split('%')[1],
					wantToSeeByTier3: rawData.wantToSeeByTier3.split('%')[2],
					wantToSeeByTier4: rawData.wantToSeeByTier4.split('%')[3],
				};
				console.log('_crawlMoviePreSaleDetailPromise result+++++++++', result);

				resolve(rawData)
			}


		} catch (e) {
			res.status(400).json({
				error: e
			});
			reject(e)
		}

	})
};

const crawlPreSaleBoxOfficePremiere = async (req, res, next) => {

	_crawlPreSaleBoxOfficePremierePromise(req, res, next).then(response => {
		console.log('_crawlRankingListBoxOfficeDetailPromise+++++++++++++++++++++++++++++++', response);
		res.status(200).json({
			data: response
		});
	}).catch(error => {
		res.status(400).json({
			error2: error
		});
	})
};
const _crawlPreSaleBoxOfficePremierePromise = async (req, res, next) => {
	return new Promise(async (resolve, reject) => {

		try {

			const response = await commonController.crawlPagePromise(req, res, next);

			console.log('_crawlRankingListBoxOfficePremierePromise+++++', req.query);
			// console.log('commonController.crawlPagePromise', response);
			const $ = response.$;
			// const base64 = $('#js-nuwa').html().match(/(?<=src:url\().+.(?=\)\sformat\("woff"\))/)[0];

			const rawData = {
				premiereBoxInfo: find($, '.box-summary .box-item:eq(0) .box-num').text() + find($, '.box-summary .box-item:eq(0) .box-unit').text(),
				premiereShowRate: find($, '.box-summary .box-item:eq(1) .box-num').text(),
				premiereShowInfo: find($, '.box-summary .box-item:eq(2) .box-num').text() + find($, '.box-summary .box-item:eq(2) .box-unit').text()
			};
			const result = {
				premiereBoxInfo: rawData.premiereBoxInfo,
				premiereShowRate: rawData.premiereShowRate,
				premiereShowInfo: rawData.premiereShowInfo,
			};
			console.log('_crawlRankingListBoxOfficeGlobalPromise result+++++++++', result);

			resolve(result)
		} catch (e) {
			reject(e)
		}

	})
};
const oneKeyMoviePreSale = async (req, res, next) => {
	let address1 = "https://piaofang.maoyan.com/store";
	let queryPreSaleList = Object.assign(req, {
		query: {
			address: address1,
			headerCode: 'maoyanPreSale'
		}
	});

	console.log('queryPreSaleList++++++++++', queryPreSaleList.query);

	const movieList = await _crawlMovieListPromise(queryPreSaleList, res, next);
	let result = [];
	// console.log('oneKeyMoviePreSale movieList++++++++++', movieList);

	// let length = movieList.length;
	let length = 6;
	let index = 0;

	const loop = async () => {
		index++;
		item2 = movieList[index].data;
		let movieId = item2.replace(/[^0-9]/ig, "");

		let addressDetail = 'https://piaofang.maoyan.com/movie/' + movieId;
		let addressPreSale = encodeURI('https://piaofang.maoyan.com/movie/' + movieId + '/wantindex?city_tier=0&city_id=0&cityName=全国');
		// console.log('addressDetail++++++++++++', addressDetail);
		// console.log('movieId+++++++++++++++', movieId);

		const reqPreSaleDetail = req;
		const reqPreSalePortrait = req;
		const queryPreSaleList = {
			query: {
				address: addressDetail,
				headerCode: 'maoyanPreSaleDetail'
			}
		};

		const queryPreSalePortrait = {
			query: {
				address: addressPreSale,
				headerCode: 'maoyanPreSalePortrait'
			}
		};

		let data = {};
		let dataPreSale = {};

		try {
			dataWantDetail = await _crawlMoviePreSaleDetailPromise(Object.assign(req, queryPreSaleList), res, next);

			console.log(data);

			dataPreSalePortrait = await _crawlPreSaleWantToSeePortraitPromise(Object.assign(req, queryPreSalePortrait), res, next);

			result.push({
				movieId: movieId,
				isEmptyPortrait: dataPreSalePortrait.isEmptyPortrait,
				data: Object.assign(dataWantDetail, dataPreSalePortrait.data)
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

	MaoyanPreSaleModel.findAll({
		offset: pagination.offset,
		limit: pagination.limit,
		// order: ['DESC']
	}).then(async data => {
		res.status(200).json({
			pagination: {
				total: await MaoyanPreSaleModel.count(),
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

	MaoyanPreSaleModel.findAll({
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

	MaoyanPreSaleModel.findAll({
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

	_createRecordPromise(req, timestamp).then(response => {
		res.status(200).json({
			data: req
		})
	}).catch(error => {
		res.status(400).json({
			message: error
		})
	})
};

const saveOneMaoyanPreSale = (req, res, next) => {
	const timestamp = Date.now();

	_createMaoyanPreSaleRecord(req, timestamp).then(response => {
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

const saveMultipleMaoyanPreSale = (req, res, next) => {
	let requestBody = req.body;
	if (!(requestBody instanceof Array)) {
		res.status(400).json({
			error: 'not array'
		})
	}
	const timestamp = Date.now();
	requestBody = requestBody.map(item => {
		return Object.assign(item, {
			timestamp: timestamp
		})
	});
	_createMultipleMaoyanPreSaleRecord(requestBody, timestamp).then(response => {
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


const crawlAndSave = (req, res, next) => {
	const address = req.query.address;
	commonController.crawlPagePromise(req, res).then(response => {
		console.log('crawlPagePromise', response);
		const timestamp = Date.now();

		let count = 0;
		const loop = () => {
			_createRecordPromise(response.data.list[count], timestamp).then(response2 => {
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
		// 	_createRecordPromise(item, timestamp).then(response2 => {
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
			MaoyanPreSaleModel.findByPk(item).then(async response => {
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
		MaoyanPreSaleModel.findByPk(idBody).then(result => {
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
	MaoyanPreSaleModel.findAll().then(response => {
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


exports.crawlMovieList = crawlMovieList;
exports.crawlMoviePreSaleDetail = crawlMoviePreSaleDetail;
exports.crawlPreSaleWantToSeePortrait = crawlPreSaleWantToSeePortrait;
exports.crawlPreSaleBoxOfficePremiere = crawlPreSaleBoxOfficePremiere;
exports.oneKeyMoviePreSale = oneKeyMoviePreSale;
exports.save = save;
exports.saveOneMaoyanPreSale = saveOneMaoyanPreSale;
exports.saveMultipleMaoyanPreSale = saveMultipleMaoyanPreSale;
exports.getListByPagination = getListByPagination;
exports.getListByDate = getListByDate;
exports.crawlAndSave = crawlAndSave;
exports.deleteRecords = deleteRecords;
exports.exportCSV = exportCSV;
