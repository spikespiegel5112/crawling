const express = require('express');
const crawler = require('crawler');
const uuidv1 = require('uuid/v1');
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


		let body = Object.assign(req.body, req.query);
		let query = query => {
			let queryKeyList = Object.keys(query);
			let result = '';
			if (queryKeyList.length > 0) {
				result = '?';
				queryKeyList.forEach((item, index) => {
					result += item + '=' + query[item];
					if (index < Object.keys(query).length - 1) {
						result += '&'
					}
				});
			}
			return result;
		};

		console.log('req.method+++++++++++++++', req.method);

		let queryString = '';
		if (req.method === 'POST') {
			queryString = query(body['query']);
		}
		console.log('body+++++++++++++++', body);

		console.log('query+++++++++++++++', query(body['query']));
		headers = await SettingsModel.findOne({
			where: {
				code: req.body.headerCode
			}
		});


		headers = headers._previousDataValues;
		console.log('req.body.address+++++++++++', req.body.address + queryString);

		crawlerInstance.queue({
			url: req.body.address + queryString,
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
					// console.log('$++++++++++++: ', result.$);
					done();

					resolve(result);

				}


			}
		});
	});
};


exports._crawlPagePromise = _crawlPagePromise;
