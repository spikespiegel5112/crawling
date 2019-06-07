const Crawler = require('Crawler');
const MaoyanModel = require('../models/MaoyanModel');

let requestBody;
let crawlerResult;


const _crawlPromise = (req, res, next) => {
	return new Promise((resolve, reject) => {
		let $ = {};
		const address = req.query.address;

		const crawlerInstance = new Crawler({
			maxConnections: 10,
			// This will be called for each crawled page
			callback: function (error, result, done) {
				if (error) {
					console.log('creating error: ', error);
					res.status(400).json({
						message: error.toString()
					});
				} else {
					// $ is Cheerio by default
					//a lean implementation of core jQuery designed specifically for the server
					console.log($("title").text());
				}
				done();
			}
		});

		const homePageHeaders = {
			'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
			'Accept-Encoding': 'gzip, deflate, br',
			'Accept-Language': 'zh-CN,zh;q=0.9',
			'Cache-Control': 'max-age=0',
			'Connection': 'keep-alive',
			'Cookie': '_lxsdk_cuid=16b278f2da1c8-0bd217ef685a99-e353165-1fa400-16b278f2da1c8; _lxsdk=5B35B0C0878B11E9906EF30672EF100755FB61C41A934C41978723E76930287B; __mta=142417549.1559736824373.1559736824373.1559736841774.2; _lx_utm=utm_source%3Dgoogle%26utm_medium%3Dorganic; __mta=142417549.1559736824373.1559736841774.1559737125628.3; _lxsdk_s=16b278f2da4-502-080-202%7C%7C16',
			'Host': 'piaofang.maoyan.com',
			'Referer': 'https://www.google.com/',
			'Upgrade-Insecure-Requests': '1',
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36',
		};

		const dataJSONHeaders = {
			'Access-Control-Allow-Credentials': true,
			'Access-Control-Allow-Methods': 'GET',
			'Access-Control-Allow-Origin': 'https://piaofang.maoyan.com',
			'Access-Control-Max-Age': '2592000',
			'Connection': 'keep-alive',
			'Content-Encoding': 'gzip',
			'Content-Type': 'application/json;charset=utf-8',
			'Date': 'Wed, 05 Jun 2019 12:18:52 GMT',
			'ETag': 'W/"0a3c3dfbb55a4bcfb08584d89d29ae9c8"',
			'M-SpanName': 'MBOBoxController.getSecondBox',
			'M-TraceId': '-1579717533259130308',
			'Server': 'openresty',
			'Transfer-Encoding': 'chunked',
		};

		crawlerInstance.queue({
			url: address,
			headers: dataJSONHeaders,
			callback: (error, result, done) => {
				if (error) {
					console.log('insrtance error: ', error);
					reject(error.toString());

				} else {
					$ = result.$;
					// console.log('Grabbed', result.body.length, 'bytes');
					console.log('$: ', result.body);
					crawlerResult = JSON.parse(result.body);

					resolve(crawlerResult);

				}
				done();
			}
		});
	});
};


const _createRecord = requestBody => {
	return new Promise((resolve, reject) => {
		MaoyanModel.create({
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

const crawl = (req, res, next) => {
	_crawlPromise(req, res, next).then(response => {
		response.data.list.forEach((item, index) => {
			_createRecord(item);
		});
		res.status(200).json(response);
	}).catch(error => {
		res.status(400).json({
			message: error.toString()
		});
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

	_createRecord(req).then(response => {
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
	_crawlPromise(req).then(response => {
		response.data.list.forEach((item, index) => {
			_createRecord(item).then(response2 => {
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


exports.crawl = crawl;
exports.save = save;
exports.crawlAndSave = crawlAndSave;