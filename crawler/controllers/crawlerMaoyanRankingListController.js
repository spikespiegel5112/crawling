const express = require('express');
const find = require('cheerio-eq');
const crawler = require('crawler');
const uuidv1 = require('uuid/v1');

const commonController = require('./commonController');
const MaoyanRecordModel = require('../models/MaoyanRecordModel');
const SettingsModel = require('../models/SettingsModel');
const {AsyncParser} = require('json2csv');
const fastCsv = require('fast-csv');
const Serializer = require('sequelize-to-json');
const fs = require('fs');


const _createRecord = (requestBody, timestamp) => {
	let _timestamp = timestamp;
	requestBody = requestBody.body;

	console.log('timestamp:   ', timestamp);
	console.log('requestBody:   ', requestBody);
	if (!timestamp) {
		_timestamp = Date.now();
	}
	return new Promise((resolve, reject) => {
		MaoyanRecordModel.create({
			recordId: uuidv1(),
			timestamp: _timestamp,
			movieId: requestBody.movieId,
			// 详情数据
			titleChi: requestBody.detail.titleChi,
			title: requestBody.detail.title,
			date: requestBody.detail.date,
			releaseDate: requestBody.detail.releaseDate,
			platformEngName: requestBody.detail.platformEngName,
			platformChineseName: requestBody.detail.platformChineseName,
			platformType: requestBody.detail.platformType,
			description: requestBody.detail.dasdasdasdas,

			// 评分数据
			rating: requestBody.rating.rating,
			rating1To2: requestBody.rating.rating1To2,
			rating3To4: requestBody.rating.rating3To4,
			rating5To6: requestBody.rating.rating5To6,
			rating7To8: requestBody.rating.rating7To8,
			rating9To10: requestBody.rating.rating9To10,
			// 想看数据
			numWantToSee: requestBody.wantToSee.numWantToSee,
			wantToSeeByGenderMale: requestBody.wantToSee.wantToSeeByGenderMale,
			wantToSeeByGenderFemale: requestBody.wantToSee.wantToSeeByGenderFemale,
			wantToSeeByAge20: requestBody.wantToSee.wantToSeeByAge20,
			wantToSeeByAge20To24: requestBody.wantToSee.wantToSeeByAge20To24,
			wantToSeeByAge25To29: requestBody.wantToSee.wantToSeeByAge25To29,
			wantToSeeByAge30To34: requestBody.wantToSee.wantToSeeByAge30To34,
			wantToSeeByAge35To39: requestBody.wantToSee.wantToSeeByAge35To39,
			wantToSeeByAge40: requestBody.wantToSee.wantToSeeByAge40,
			wantToSeeByTier1: requestBody.wantToSee.wantToSeeByTier1,
			wantToSeeByTier2: requestBody.wantToSee.wantToSeeByTier2,
			wantToSeeByTier3: requestBody.wantToSee.wantToSeeByTier3,
			wantToSeeByTier4: requestBody.wantToSee.wantToSeeByTier4,

			// 内地票房
			avgSeatView: requestBody.boxOffice.avgSeatView,
			avgShowView: requestBody.boxOffice.avgShowView,
			avgViewBox: requestBody.boxOffice.avgViewBox,
			boxInfo: requestBody.boxOffice.boxInfo,
			boxRate: requestBody.boxOffice.boxRate,
			myRefundNumInfo: requestBody.boxOffice.myRefundNumInfo,
			myRefundRateInfo: requestBody.boxOffice.myRefundRateInfo,
			onlineBoxRate: requestBody.boxOffice.onlineBoxRate,
			refundViewInfo: requestBody.boxOffice.refundViewInfo,
			refundViewRate: requestBody.boxOffice.refundViewRate,
			releaseInfo: requestBody.boxOffice.releaseInfo,
			releaseInfoColor: requestBody.boxOffice.releaseInfoColor,
			seatRate: requestBody.boxOffice.seatRate,
			showInfo: requestBody.boxOffice.showInfo,
			showRate: requestBody.boxOffice.showRate,
			splitAvgViewBox: requestBody.boxOffice.splitAvgViewBox,
			splitBoxInfo: requestBody.boxOffice.splitBoxInfo,
			splitBoxRate: requestBody.boxOffice.splitBoxRate,
			splitSumBoxInfo: requestBody.boxOffice.splitSumBoxInfo,
			sumBoxInfo: requestBody.boxOffice.sumBoxInfo,
			viewInfo: requestBody.boxOffice.viewInfo,
			viewInfoV2: requestBody.boxOffice.viewInfoV2,


		}).then(result => {
			resolve(result)
		}).catch(error => {
			console.log(error);
			reject(error)
		})
	})
};

const _createMaoyanOfficeBoxRecord = (requestBody, timestamp) => {
	let _timestamp = timestamp;
	console.log('timestamp:   ', timestamp);
	if (!timestamp) {
		_timestamp = Date.now();
	}
	return new Promise((resolve, reject) => {
		MaoyanRecordModel.create({
			timestamp: _timestamp,
			"titleChi": requestBody.titleChi,
			"title": requestBody.title,
			"releaseDate": requestBody.releaseDate,
			"platformEngName": requestBody.platformEngName,
			"platformChineseName": requestBody.platformChineseName,
			"platformType": requestBody.platformType,
			date: requestBody.date,
			description: requestBody.dasdasdasdas,


		}).then(result => {
			// console(result);
			resolve(result)
		}).catch(error => {
			reject(error)
		})

	})
};

const _createMultipleMaoyanWantSeeRecord = (requestBody, timestamp) => {
	let _timestamp = timestamp;
	console.log('timestamp:   ', timestamp);
	if (!timestamp) {
		_timestamp = Date.now();
	}
	return new Promise((resolve, reject) => {
		MaoyanRecordModel.bulkCreate(requestBody).then(result => {
			// console(result);
			resolve(result)
		}).catch(error => {
			reject(error)
		})

	})
};

const _crawlRankingListPromise = (req, res, next) => {
	return new Promise((resolve, reject) => {
		commonController._crawlPagePromise(req, res, next).then(response => {
			// console.log('_crawlRankingListPromise++++++++', response);

			const $ = response.$;
			let result = [];
			let titleEL = $("#ranks-list .row");
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
			// console.log('titleEL+++++++++', titleEL.options);

			resolve(result)
		}).catch(error => {
			reject(error)
		})
	})
};

const _crawlBoxOfficeDetailPromise = (req, res, next) => {
	return new Promise(async (resolve, reject) => {
		console.log('commonController._crawlPagePromise+++++', req.body);

		try {
			const response = await commonController._crawlPagePromise(req, res, next);

			console.log('commonController._crawlPagePromise(req, res, next)+++++', req.query);
			res.status(200).json({
				data: res.body
			});
			// console.log('commonController._crawlPagePromise', response);
			const $ = response.$;
			// console.log('$+++++++++', titleEL.text());

			const rawData = {
				recordId: uuidv1(),
				timestamp: _timestamp,
				movieId: requestBody.movieId,
				// 详情数据
				date: requestBody.detail.date,
				description: requestBody.detail.dasdasdasdas,
				titleChi: $(".movie-baseinfo .info-title-content").text(),
				title: $(".movie-baseinfo .info-etitle-content").text(),
				releaseDate: $(".movie-baseinfo .score-info.ellipsis-1").text(),
				platformEngName: 'Maoyan',
				platformChineseName: '猫眼',
				platformType: 'Web',

			};

			const result = {
				movieId: requestBody.movieId,
				// 详情数据
				date: rawData.timestamp,
				description: rawData.description,
				titleChi: rawData.titleChi,
				title: rawData.title,
				releaseDate: rawData.releaseDate,
				platformEngName: rawData.platformEngName,
				platformChineseName: rawData.platformChineseName,
				platformType: rawData.platformType,
			};
			console.log('_crawlBoxOfficeDetailPromise result+++++++++', result);

			resolve(result)

		} catch (e) {
			res.status(400).json({
				error: e
			});
			reject(e)
		}

	})
};

const _crawlBoxOfficeRatingPromise = (req, res, next) => {
	return new Promise(async (resolve, reject) => {
		console.log('commonController._crawlPagePromise+++++', req.body);

		try {
			const response = await commonController._crawlPagePromise(req, res, next);

			console.log('commonController._crawlPagePromise(req, res, next)+++++', req.query);
			res.status(200).json({
				data: res.body
			});
			// console.log('commonController._crawlPagePromise', response);
			const $ = response.$;
			// console.log('$+++++++++', titleEL.text());

			const rawData = {
				recordId: uuidv1(),
				timestamp: _timestamp,
				movieId: requestBody.movieId,
				// 详情数据
				date: requestBody.detail.date,
				description: requestBody.detail.dasdasdasdas,
				titleChi: $(".movie-baseinfo .info-title-content").text(),
				title: $(".movie-baseinfo .info-etitle-content").text(),
				releaseDate: $(".movie-baseinfo .score-info.ellipsis-1").text(),
				platformEngName: 'Maoyan',
				platformChineseName: '猫眼',
				platformType: 'Web',

			};

			const result = {
				movieId: requestBody.movieId,
				// 详情数据
				date: rawData.timestamp,
				description: rawData.description,
				titleChi: rawData.titleChi,
				title: rawData.title,
				releaseDate: rawData.releaseDate,
				platformEngName: rawData.platformEngName,
				platformChineseName: rawData.platformChineseName,
				platformType: rawData.platformType,
			};
			console.log('_crawlBoxOfficeDetailPromise result+++++++++', result);

			resolve(result)

		} catch (e) {
			res.status(400).json({
				error: e
			});
			reject(e)
		}

	})
};

const _crawlBoxOfficeWantToSeePortraitPromise = (req, res, next) => {
	return new Promise(async (resolve, reject) => {
		console.log('_crawlBoxOfficeWantToSeePortraitPromise+++++', req.query);

		req.query = Object.assign(req.query, {
			address: encodeURI(req.query.address + '/wantindex?city_tier=0&city_id=0&cityName=全国')
			// address: req.query.address + '/wantindex?city_tier=0&city_id=0&cityName=全国'
		});

		try {
			const response = await commonController._crawlPagePromise(req, res, next);

			console.log('_crawlBoxOfficeWantToSeePortraitPromise(req, res, next)+++++', req.query);
			// res.status(200).json({
			// 	data: req.query
			// });
			// console.log('commonController._crawlPagePromise', response);
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
			console.log('_crawlBoxOfficeDetailPromise result+++++++++', result);

			resolve(rawData)

		} catch (e) {
			res.status(400).json({
				error: e
			});
			reject(e)
		}

	})
};

const crawlRankingList = async (req, res, next) => {
	console.log('req++++++++++++++++', req.method);
	commonController._crawlPagePromise(req, res, next).then(response => {


		res.status(200).json(response);
	}).catch(error => {
		res.status(400).json({
			message: error.toString()
		});
	})

};

const crawlRankingListByYear = async (req, res, next) => {
	commonController._crawlPagePromise(req, res, next).then(response => {
		console.log('responseA+++++++++++++', response.yearlist);
		res.status(200).json(Object.keys(response));
		// res.status(200).json(response.body);

		const $ = response.$;

		let result = [];
		let listItem = $('#ranks-list .row');

		console.log('#ranks-list .row .first-line+++++++++++++++++', typeof listItem);
		// console.log('#ranks-list .row .first-line+++++++++++++++++', $('#ranks-list .row').text().length);

		Object.keys(listItem).forEach((item, index) => {
			if (Number(item).toString() !== 'NaN') {
				let itemValue = listItem[item].attribs['data-com'];

				result.push({
					// data: itemValue,
					movieId: itemValue.replace(/[^0-9]/ig, ""),
					title: listItem.find('.first-line').text(),
				})
				// result.push($('#ranks-list .row'))
			}
		});
		Object.keys(listItem.find('.first-line')).forEach((item, index) => {
			if (Number(item).toString() !== 'NaN') {
				// console.log(listItem.find('.first-line')[item].children[0].data);
				result[index].title = listItem.find('.first-line')[item].children[0].data
			}
		});
		res.status(200).json(result);
	}).catch(error => {
		res.status(400).json({
			error: error.toString()
		});
	})
};

const _crawlRankingListbyYearPromise = async (req, res, next) => {
	return new Promise((resolve, reject) => {
		commonController._crawlPagePromise(req, res, next).then(response => {
			resolve(response)
			// res.status(200).json(response);
		}).catch(error => {
			reject(error)
			// res.status(400).json({
			// 	message: error.toString()
			// });
		})
	})
};


const crawlBoxOfficeDetail = async (req, res, next) => {
	return new Promise((resolve, reject) => {
		_crawlBoxOfficeDetailPromise(req, res, next).then(response => {
			console.log('_crawlBoxOfficeDetailPromise+++++++++++++++++++++++++++++++', response);
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

const crawlBoxOfficeRating = async (req, res, next) => {
	return new Promise((resolve, reject) => {
		_crawlBoxOfficeRatingPromise(req, res, next).then(response => {
			console.log('_crawlBoxOfficeDetailPromise+++++++++++++++++++++++++++++++', response);
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


const crawlBoxOfficeWantToSeePortrait = async (req, res, next) => {
	return new Promise((resolve, reject) => {
		_crawlBoxOfficeWantToSeePortraitPromise(req, res, next).then(response => {
			console.log('_crawlBoxOfficeWantToSeePortrait+++++++++++++++++++++++++++++++', response);
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

const save = (req, res, next) => {
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

const saveOneMaoyanOfficeBoxRecord = (req, res, next) => {
	const timestamp = Date.now();

	_createMaoyanOfficeBoxRecord(req, timestamp).then(response => {
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

const saveMultipleMaoyanOfficeBoxRecord = (req, res, next) => {
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
	_createMultipleMaoyanWantSeeRecord(requestBody, timestamp).then(response => {
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
	commonController._crawlPagePromise(req, res).then(response => {
		console.log('commonController._crawlPagePromise', response);
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


exports.crawlRankingList = crawlRankingList;
exports.crawlRankingListByYear = crawlRankingListByYear;
exports.crawlBoxOfficeDetail = crawlBoxOfficeDetail;
exports.crawlBoxOfficeRating = crawlBoxOfficeRating;
exports.crawlBoxOfficeWantToSeePortrait = crawlBoxOfficeWantToSeePortrait;
exports.save = save;
exports.saveOneMaoyanOfficeBoxRecord = saveOneMaoyanOfficeBoxRecord;
exports.saveMultipleMaoyanOfficeBoxRecord = saveMultipleMaoyanOfficeBoxRecord;
exports.getListByPagination = getListByPagination;
exports.getListByDate = getListByDate;
exports.crawlAndSave = crawlAndSave;
exports.deleteRecords = deleteRecords;
exports.exportCSV = exportCSV;
