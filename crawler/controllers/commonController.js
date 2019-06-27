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
const base64ToUint8Array = require('base64-to-uint8array');
const base64ArrayBufferConverter = require('base64-arraybuffer-converter');

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
const convertDataURIToBinary = (dataURI) => {
	var BASE64_MARKER = ';base64,';
	var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
	var base64 = dataURI.substring(base64Index);
	var raw = atob(base64);
	var rawLength = raw.length;
	var array = new Uint8Array(new ArrayBuffer(rawLength));

	for (i = 0; i < rawLength; i++) {
		array[i] = raw.charCodeAt(i);

	}
	return array;

	// return new Uint8Array(new ArrayBuffer(rawLength));
};

const woffParser = (req, res, next) => {
	let data = '';
	// let response = request(req.body.address)

	let buffer = Buffer.from(req.body.base64, 'base64').toString();

	// res.status(200).json({
	// 	data: buffer
	// })
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
	let buffer = Buffer.from(req.body.base64, 'base64');

	_woff2Parser(buffer).then(result => {
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


const woffBase64 = '';
const maoyanFontDictionary = [{
	value: 0,
	fontSignature: [
		{onCurve: true, lastPointOfContour: false, x: 20, y: 20},
		{onCurve: true, lastPointOfContour: false, x: 50, y: 20},
		{onCurve: true, lastPointOfContour: true, x: 50, y: -20}
	]
}, {
	value: 0,
	fontSignature: [
		{onCurve: true, lastPointOfContour: false, x: 20, y: 20},
		{onCurve: true, lastPointOfContour: false, x: 50, y: 20},
		{onCurve: true, lastPointOfContour: true, x: 50, y: -20}
	]
}, {
	value: 0,
	fontSignature: [
		{onCurve: true, lastPointOfContour: false, x: 20, y: 20},
		{onCurve: true, lastPointOfContour: false, x: 50, y: 20},
		{onCurve: true, lastPointOfContour: true, x: 50, y: -20}
	]
}, {
	value: 0,
	fontSignature: [
		{onCurve: true, lastPointOfContour: false, x: 20, y: 20},
		{onCurve: true, lastPointOfContour: false, x: 50, y: 20},
		{onCurve: true, lastPointOfContour: true, x: 50, y: -20}
	]
}];


const opentypeJs = (req, res, next) => {
	console.log(req.body.address);
	let data = '';
	// let response = request(req.body.address);
	const base64String = req.body.base64.split('base64,')[1];
	const uint8Array = base64ToUint8Array(base64String);
	let buffer = Buffer.from(base64String, 'base64');

	const toArrayBuffer = (buf) => {
		var ab = new ArrayBuffer(buf.length);
		var view = new Uint8Array(ab);
		for (var i = 0; i < buf.length; ++i) {
			view[i] = buf[i];
		}
		return ab;
	};

	const arrayBuffer = toArrayBuffer(buffer);
	const fontData = _opentypeJs.parse(arrayBuffer);

	// res.status(200).json({
	// 	data: arrayBuffer
	// });
	const pathDictionary = [];
	Object.keys(fontData.glyphs.glyphs).forEach((item, index) => {
		let pathList = fontData.glyphs.glyphs[item].path.commands;
		pathDictionary.push({
			value: index,
			path: pathList.filter((item, index) => index < 5)
		})
	});
	console.log('fontData+++++++++++++++++', fontData);
	console.log('glyphs+++++++++++++++++', fontData.glyphs.glyphs);
	console.log('pathDictionary+++++++++++++++++', pathDictionary);


	try {
		res.status(200).json({
			data: pathDictionary
		});
	} catch (error) {
		res.status(400).json({
			address: req.body.address,
			error: error
		});
	}

};

function toArrayBuffer(buf) {
	var ab = new ArrayBuffer(buf.length);
	var view = new Uint8Array(ab);
	for (var i = 0; i < buf.length; ++i) {
		view[i] = buf[i];
	}
	return ab;
}

function toFont(string) {

	var buf = new Buffer(string, 'base64');
	const arrBuf = toArrayBuffer(buf);
	return opentype.parse(arrBuf);

}


// const base64ToUint8Array = (req, res, next) => {
// 	const base64String = req.body.base64Data;
// 	// const base64String = woffBase64.split('base64,')[1];
// 	const padding = '='.repeat((4 - base64String.length % 4) % 4);
// 	const base64 = (base64String + padding)
// 		.replace(/\-/g, '+')
// 		.replace(/_/g, '/');
//
// 	const rawData = atob(base64);
// 	const buffer = new Buffer(base64String, 'base64').toString();
// 	const outputArray = new Uint8Array(buffer);
//
// 	// for (let i = 0; i < rawData.length; ++i) {
// 	// 	outputArray[i] = rawData.charCodeAt(i);
// 	// }
// 	res.status(200).json({
// 		data: outputArray
// 	});
// 	return outputArray;
// };

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
// exports.base64ToUint8Array = base64ToUint8Array;
exports.arrayBufferToBase64 = arrayBufferToBase64;



