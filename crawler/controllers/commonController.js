const express = require('express');
const crawler = require('crawler');
const uuidv1 = require('uuid/v1');
const fs = require('fs');
const atob = require('atob');
const btoa = require('btoa');
const request = require('request');
const SettingsModel = require('../models/SettingsModel');
// const woff2Parser = require('../util/woff2Parser');
const _woff2Parser = require('woff2-parser');
const _woffParser = require('woff-parser');
const _fontCmap = require('font-cmap');
const _opentypeJs = require('opentype.js');
// const _opentypeParser = require('opentype');

let headers = {};

let dataJSONHeadersSample = {};
const crawlPagePromise = (req, res, next) => {
	return new Promise(async (resolve, reject) => {

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
			console.log('query+++++++++++++++', query(body['query']));
		}
		console.log('body+++++++++++++++', body);


		headers = await SettingsModel.findOne({
			where: {
				code: req.body.headerCode
			}
		});


		headers = headers._previousDataValues;
		// console.log('headers._previousDataValues+++++++++++', headers.value);
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
					// res.status(200).json({
					// 	data: result
					// });
					done();

					resolve(result);

				}
			}
		});
	});
};


const woffParser = (req, res, next) => {
	let data = '';
	// let response = request(req.body.address)

	let buffer = Buffer.from(req.body.base64, 'base64')

	_woffParser(buffer).then(result => {
		console.log(result);
		res.status(200).json({
			data: result
		})
	}).catch(error => {
		res.status(400).json({
			error: error,
			data: buffer,
		})
	})
};
const woff2Parser = (req, res, next) => {
	console.log(req.body.address);
	request(req.body.address, (error, response, body) => {
		// res.status(200).json({
		// 	data: body
		// })
		if (!error && response.statusCode === 200) {
			_woff2Parser(body).then(result => {
				console.log(result);
				res.status(200).json({
					data: result
				})
			}).catch(error => {
				res.status(400).json({
					error: error,
					data: response,
				})
			})

		} else {
			res.status(400).json({
				error: error,
				req: req.body
			})
		}


	})
};


const woffBase64 = 'data:application/font-woff;charset=utf-8;base64,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';


const opentypeJs = (req, res, next) => {
	console.log(req.body.address);
	let data = '';
	// let response = request(req.body.address);
	const base64String = req.body.base64;
	const buffer = Buffer.from(base64String, 'base64');
	const arrayBuffer = JSON.parse(JSON.stringify(buffer));
	// let arrayBuffer = new ArrayBuffer(buffer.length);
	console.log('arrayBuffer+++++++++++++++++', base64String);
	// let buffer = new ArrayBuffer('');
	// res.status(200).json({
	// 	message: 'success',
	// 	address: req.body.address,
	// 	response: arrayBuffer.data
	// });
	_opentypeJs.load(buffer, (err, font) => {
		if (err) {
			res.status(400).json({
				address: req.body.address,
				error: err
			});
			// alert('Font could not be loaded: ' + err);
		} else {
			res.status(200).json({
				data: font
			});
			// Now let's display it on a canvas with id "canvas"
			var ctx = document.getElementById('canvas').getContext('2d');

			// Construct a Path object containing the letter shapes of the given text.
			// The other parameters are x, y and fontSize.
			// Note that y is the position of the baseline.
			var path = font.getPath('Hello, World!', 0, 150, 72);

			// If you just want to draw the text you can also use font.draw(ctx, text, x, y, fontSize).
			path.draw(ctx);
		}
	})
};


const base64ToUint8Array = (req, res, next) => {
	const base64String = req.body.base64Data;
	// const base64String = woffBase64.split('base64,')[1];
	const padding = '='.repeat((4 - base64String.length % 4) % 4);
	const base64 = (base64String + padding)
		.replace(/\-/g, '+')
		.replace(/_/g, '/');

	const rawData = atob(base64);
	const buffer = new Buffer(base64String, 'base64').toString();
	const outputArray = new Uint8Array(buffer);

	// for (let i = 0; i < rawData.length; ++i) {
	// 	outputArray[i] = rawData.charCodeAt(i);
	// }
	res.status(200).json({
		data: outputArray
	});
	return outputArray;
};

const arrayBufferToBase64 = (req, res, next) => {
	const buffer = req.body.buffer;
	var binary = '';
	var bytes = new Uint8Array(buffer);

	var len = bytes.byteLength;
	for (var i = 0; i < len; i++) {
		binary += String.fromCharCode(bytes[i]);
	}
	res.status(200).json({
		data: btoa(binary)
	});
	return btoa(binary);
};


const fontCmap = (req, res, next) => {
	const base64String = req.body.base64;
	let buffer = Buffer.from(base64String, 'base64');
	// buffer = JSON.parse(JSON.stringify()).data
	// res.status(200).json({
	// 	message: 'success2',
	// 	buffer: buffer
	// });
	// try {

	const bufferJSON = JSON.parse(JSON.stringify(buffer));
	_woffParser(buffer).then(result => {
		res.status(200).json({
			message: 'success',
			data: result
		});
	}).catch(error => {
		res.status(400).json({
			message: error,
			error: buffer
		});
	});
	console.log('buffer+++++++++++++++++++++++', buffer);
	let result = _fontCmap(buffer);
	console.log('_fontCmap++++++++++++++++', result);

	res.status(200).json({
		message: 'success',
		// data: JSON.parse(bufferJSON).data
		// arrayBuffer: buffer,
		result: result
	})
	// } catch (error) {
	// res.status(400).json({
	// 	error: error,
	// 	data: buffer,
	// })
	// }

};


exports.crawlPagePromise = crawlPagePromise;
exports.woffParser = woffParser;
exports.woff2Parser = woff2Parser;
exports.fontCmap = fontCmap;
exports.opentypeJs = opentypeJs;
exports.base64ToUint8Array = base64ToUint8Array;
exports.arrayBufferToBase64 = arrayBufferToBase64;



