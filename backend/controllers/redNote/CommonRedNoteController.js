const express = require("express");
const crawler = require("crawler");
const uuidv1 = require("uuid/v1");
const fs = require("fs");
const path = require("path");
const fastCsv = require("fast-csv");
const fetch = require("node-fetch");
const atob = require("atob");
const btoa = require("btoa");
const request = require("request");
const SettingsModel = require("../../models/SettingsModel");
// const woff2Parser = require('../util/woff2Parser');
const _woff2Parser = require("woff2-parser");
const _woffParser = require("woff-parser");
const _fontCmap = require("font-cmap");
const _opentypeJs = require("opentype.js");
const base64ToUint8Array = require("base64-to-uint8array");
const base64ArrayBufferConverter = require("base64-arraybuffer-converter");

let headers = {};

let dataJSONHeadersSample = {};
const crawlPagePromise = (req, res, next) => {
  return new Promise(async (resolve, reject) => {
    const wantWatchDataJSONHeaderSample = {
      GET: "/movie/1197814/wantindex?city_tier=0&city_id=0&cityName=%E5%85%A8%E5%9B%BD HTTP/1.1",
      Host: "piaofang.maoyan.com",
      Connection: "keep-alive",
      "Cache-Control": "max-age=0",
      "Upgrade-Insecure-Requests": "1",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
      Referer: "https://piaofang.maoyan.com/movie/1197814",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "zh-CN,zh;q=0.9",
      Cookie:
        "_lxsdk_cuid=16b278f2da1c8-0bd217ef685a99-e353165-1fa400-16b278f2da1c8; _lxsdk=5B35B0C0878B11E9906EF30672EF100755FB61C41A934C41978723E76930287B; __mta=142417549.1559736824373.1559736824373.1559736841774.2; wantindex-city={'city_tier':0,'city_id':0,'cityName':'%E5%85%A8%E5%9B%BD'}; theme=moviepro; __mta=142417549.1559736824373.1559736841774.1560526087657.3; _lx_utm=utm_source%3Dgoogle%26utm_medium%3Dorganic; _lxsdk_s=16b5699e75e-a28-65-652%7C%7C28",
    };

    let crawlerInstance = new crawler({
      maxConnections: 100,
      // rateLimit: 3000,

      // This will be called for each crawled page
      callback: function (error, result, done) {
        if (error) {
          console.log("creating error: ", error);
          res.status(400).json({
            message: error.toString(),
          });
          // done()
        } else {
          // $ is Cheerio by default
          //a lean implementation of core jQuery designed specifically for the server
          // console.log($("title").text());
          console.log("dataJSONHeadersSample+++++", dataJSONHeadersSample);
          // done();
        }
      },
    });

    const body = Object.assign(req.body, req.query);
    console.log("body++++", body);
    const query = (query) => {
      const queryKeyList = Object.keys(query);
      let result = "";
      if (queryKeyList.length > 0) {
        result = "?";
        queryKeyList.forEach((item, index) => {
          result += item + "=" + query[item];
          if (index < Object.keys(query).length - 1) {
            result += "&";
          }
        });
      }
      return result;
    };

    console.log("crawlPagePromise+++++++++", query(body));

    let queryString = "";
    if (req.method === "POST") {
      queryString = query(body);
      console.log("query+++++++++++++++", query(body));
    }
    console.log("body+++++++++++++++", body);

    headers = await SettingsModel.findOne({
      where: {
        code: req.body.headerCode,
      },
    });

    headers = headers?._previousDataValues || {
      value: "{}",
    };
    console.log("headers._previousDataValues+++++++++++", headers.value);
    console.log("req.body.address+++++++++++", req.body.address + queryString);

    crawlerInstance.queue({
      url: req.body.address + queryString,
      headers: JSON.parse(headers.value),
      // headers: dataJSONHeadersSample,
      callback: (error, result, done) => {
        if (error) {
          console.log("insrtance error: ", error);
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
      },
    });
  });
};
const convertDataURIToBinary = (dataURI) => {
  let BASE64_MARKER = ";base64,";
  let base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
  let base64 = dataURI.substring(base64Index);
  let raw = atob(base64);
  let rawLength = raw.length;
  let array = new Uint8Array(new ArrayBuffer(rawLength));

  for (i = 0; i < rawLength; i++) {
    array[i] = raw.charCodeAt(i);
  }
  return array;

  // return new Uint8Array(new ArrayBuffer(rawLength));
};

const woffParser = (req, res, next) => {
  let data = "";
  // let response = request(req.body.address)

  let buffer = Buffer.from(req.body.base64, "base64").toString();

  // res.status(200).json({
  // 	data: buffer
  // })
  _woffParser(buffer)
    .then((result) => {
      console.log(result);
      res.status(200).json({
        data: result,
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
        data: buffer,
      });
    });
};

const _getOpenTypeDataFromBase64 = (data) => {
  const base64String = data.split("base64,")[1];
  let buffer = Buffer.from(base64String, "base64");

  return _getOpenTypeDataFromBuffer(buffer);
};

const _getOpenTypeDataFromBuffer = (buffer) => {
  const toArrayBuffer = (buf) => {
    let ab = new ArrayBuffer(buf.length);
    let view = new Uint8Array(ab);
    for (let i = 0; i < buf.length; ++i) {
      view[i] = buf[i];
    }
    return ab;
  };
  const arrayBuffer = toArrayBuffer(buffer);
  // const fontData = _opentypeJs.parse(arrayBuffer);
  console.log(
    "_opentypeJs.parse(arrayBuffer);+++++",
    _opentypeJs.parse(arrayBuffer)
  );
  return _opentypeJs.parse(arrayBuffer);
};

const _fetch = (url) => {
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/octet-stream",
      },
    }).then((response) => {
      response = response.buffer();
      resolve(response);
      // fs.writeFile(p, _, "binary", function (err) {
      // 	console.log(err || p);
      // });

      // }).catch(error => {
      // 	reject(error)
    });
  });
};

const _request = (url) => {
  return new Promise((resolve, reject) => {
    request(url)
      .then((response) => {})
      .catch((error) => {});
  });
};

const getFontFile = (req, res, next) => {
  let url = req.body.url;
  _request(url).then((response) => {
    res.status(200).json({
      body: url,
    });
    // }).catch(error=>{
    // 	res.status(400).json({
    // 		error: error
    // 	})
  });

  // _fetch(url).then(response => {
  // 	res.status(200).json({
  // 		body: url
  // 	})
  // }).catch(error => {
  // 	res.status(400).json({
  // 		error: error
  // 	})
  // })
};

const _getPathData = (fontData) => {
  const result = [];
  console.log("fontData+++++++++++++++++++++++", fontData);
  const glyphDataRaw = fontData.glyphs.glyphs;
  const glyphData = [];
  const glyphDataArr = [];
  const pointLimit = 5;
  console.log("glyphDataRaw++++++++++", fontData);
  console.log(
    "glyphDataRaw++++++++++",
    JSON.parse(JSON.stringify(glyphDataRaw))
  );
  // Object.keys(glyphData).forEach((item, index) => {
  // 	glyphDataArr.push(glyphData[item])
  // });
  Object.keys(glyphDataRaw).forEach((item1, index1) => {
    glyphData.push(JSON.parse(JSON.stringify(glyphDataRaw[item1])));
    console.log("item++++", glyphDataRaw[item1]);
  });
  console.log("_getPathData++++++++++", glyphData);

  glyphData.forEach((item1, index1) => {
    // let pathList = glyphData[item].path.commands;
    // console.log('glyphData[item].path.commands', item.path.commands);
    item1.points = item1.points || [];
    result.push({
      name: item1.name,
      unicode: item1.unicode,
      points: [],
    });
    item1.points.forEach((item2, index2) => {
      let lastPointOfContour = item2.lastPointOfContour;
      let onCurve = item2.onCurve;
      let x = item2.x;
      let y = item2.y;
      result[index1].points.push({
        lastPointOfContour: lastPointOfContour,
        onCurve: onCurve,
        x: x,
        y: y,
      });
    });
  });
  console.log(" fontData[item]++++++++++", result);

  return result;
};

const _getFontDataByBase64Promise = (base64Data) => {
  return new Promise((resolve, reject) => {
    try {
      const fontData = _getOpenTypeDataFromBase64(base64Data);
      const pathData = _getPathData(fontData);
      console.log("base64+++++++++++++++++", base64Data);

      console.log("pathData getFontData+++++++++", pathData);

      console.log("glyphs+++++++++++++++++", fontData.glyphs.glyphs);
      console.log("pathData+++++++++++++++++", pathData);
      // resolve(JSON.stringify(fontData));
      resolve(pathData);
    } catch (error) {
      reject(error);
    }
  });
};
const getFontDataByBase64 = (req, res, next) => {
  const options = {
    address: req.body.address || "",
    base64Data: req.body.base64 || "",
  };
  _getFontDataByBase64Promise(options.base64Data)
    .then((response) => {
      res.status(200).json({
        data: response,
      });
    })
    .then((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

const getFontDataFromPage = async (req, res, next) => {
  try {
    let base64Data = await _getBase64DataFromPagePromise(req);
    // res.status(200).json({
    // 	data: base64Data
    // });
    _getFontDataByBase64Promise(base64Data)
      .then((response) => {
        res.status(200).json({
          data: response,
        });
      })
      .catch((error) => {
        res.status(400).json({
          error: error,
        });
      });
  } catch (error) {
    res.status(400).json({
      error: error,
    });
  }
};

const getFontDictionaryFromPage = async (req, res, next) => {
  try {
    const base64Data = await _getBase64DataFromPagePromise(req);
    const fontData = _getOpenTypeDataFromBase64(base64Data);
    const fontDictionaryData = await _generateFontDictionaryPromise(
      _getPathData(fontData)
    );
    res.status(200).json({
      data: fontDictionaryData,
    });
  } catch (error) {
    res.status(400).json({
      error: error,
    });
  }
};

const _fileReader = (url) => {
  return new Promise((resolve, reject) => {
    fs.readFile(url, (err, response) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(response.toString()));
      }
    });
  });
};

const _fileStat = (url) => {
  return new Promise((resolve, reject) => {
    fs.stat(url, (err, response) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(response.toString()));
      }
    });
  });
};

const getDecodeFontValue = async (req, res, next) => {
  let unicode = req.body.unicode;
  let base64 = req.body.base64;
  _decodeFontValuePromise(unicode, base64, res)
    .then((response) => {
      res.status(200).json({
        data: response,
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

const generateFontDictionary = (req, res, next) => {
  const fontData = req.body.data;
  _generateFontDictionaryPromise(fontData)
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      res.status(400).json({
        message: error.toString(),
      });
    });
};

const _generateFontDictionaryPromise = (fontData) => {
  const fontDictionaryUrl = "./data/fontDictionary2.json";
  return new Promise((resolve, reject) => {
    try {
      let result = [];
      let fontDictionaryData = fontData;
      fontData.forEach((item, index) => {
        if (!item.unicode) {
          fontDictionaryData[index].unicode = null;
        }
        fontDictionaryData[index].value = index < 3 ? "?" : index - 1;
      });
      resolve(fontDictionaryData);
    } catch (error) {
      reject(error);
    }
  });
};

const _decodeFontValuePromise = (unicode, base64, res) => {
  return new Promise(async (resolve, reject) => {
    // const fontDictionaryUrl = './data/fontDictionary1.json';
    // const fontDictionaryUrl = './data/fontDictionary2.json';
    const fontDictionaryUrl = "./data/fontDictionary3.json";

    try {
      let selectedUnicode = unicode;
      // selectedUnicode = selectedUnicode.replace('&#x', '');
      selectedUnicode = selectedUnicode
        .replace("&#x", "")
        .replace(";", "")
        .toLowerCase();

      let selectedPoints;
      let fontFIleBuffer;

      console.log("selectedUnicode++++++++++", selectedUnicode);
      const base64Data = base64;

      let fontData = _getOpenTypeDataFromBase64(base64);
      console.log("_getOpenTypeDataFromBase64 fontData+++++++", fontData);

      // const fontDictionaryData = await _fileReader(fontDictionaryUrl);
      const fontDictionaryData = await _generateFontDictionaryPromise(
        _getPathData(fontData)
      );

      console.log(
        "_generateFontDictionaryPromise response+++++++",
        fontDictionaryData
      );

      let glyphData = _getPathData(fontData);
      console.log("_getOpenTypeDataFromBase64 response+++++++", glyphData);

      // res.status(200).json({
      // 	data: fontDictionaryData
      // });
      // const pathData = _getPathData(fontData);
      // console.log('fontDictionaryData+++++++++', fontDictionaryData);

      let result = "?";
      let matchCount = 0;

      let selectedGlyphObject =
        glyphData.find(
          (item1) =>
            item1.name.replace("uni", "").toLowerCase() === selectedUnicode
        ) || "";

      console.log("selectedGlyphObject+++++++++", selectedGlyphObject);
      // console.log('fontDictionaryData+++++++++', fontDictionaryData);
      let matchedResult = "";
      if (selectedGlyphObject !== "") {
        matchedResult =
          fontDictionaryData.find((item3) => {
            let count = 0;
            const limit = item3.points.length >= 10 ? 10 : item3.points.length;

            item3.points.forEach((item4, index4) => {
              selectedGlyphObject.points.forEach((item5, index5) => {
                if (
                  item4.lastPointOfContour === item5.lastPointOfContour &&
                  item4.onCurve === item5.onCurve &&
                  item4.x === item5.x &&
                  item4.y === item5.y
                ) {
                  count++;
                }
              });
            });
            if (count >= limit - 1 && count !== 0) {
              return true;
            }
          }) || "";
      }

      resolve({
        selectedUnicode: selectedUnicode,
        result: matchedResult,
        selectedGlyphObject: selectedGlyphObject,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const arrayBufferToBase64 = (req, res, next) => {
  const buffer = req.body.buffer;
  let binary = "";
  let bytes = new Uint8Array(buffer);

  let len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  res.status(200).json({
    data: btoa(binary),
  });
  return btoa(binary);
};

const _parseUnicodeValue = (data, base64) => {
  return new Promise((resolve, reject) => {
    let result = [];
    console.log("data++++++++++++++", data);

    // res.status(200).json({
    // 	raw: data,
    // 	// data: data.trim('').split('&#x').filter((item, index) => index > 0)
    // 	data: base64
    // });

    let count = 0;

    const loop = (base64) => {
      let item = data.split("&#x")[count];
      // let item = data[count];
      if (count < data.split("&#x").length) {
        if (item.length >= 4) {
          console.log("_parseUnicodeValue++++++++++++++", item);
          console.log("base64++++++++++++++", base64);
          _decodeFontValuePromise(item, base64)
            .then(async (response) => {
              result.push(response.result);

              console.log("result+++++", result);
              if (count === data.split("&#x").length - 1) {
                resolve(result);
                // return result
              } else {
                // console.log("await commonController._decodeFontValuePromise(item, base64)", await _decodeFontValuePromise(item, base64));
                count++;
                loop(base64);
              }
            })
            .catch((error) => {
              console.log(error);
              count = data.split("&#x").length;
              reject(error);
            });
        } else {
          count++;
          loop(base64);
        }
      }
    };

    loop(base64);
  });
};
const _trimData = (selector) => {
  let result = selector.html().replace(".", "").split(";");
  return result
    .filter((item, index) => index < result.length - 2)
    .map((item) => {
      return item + ";";
    })
    .join("");
};

const parseDecimal = (res, req, next) => {
  const data = req.body.data;
  const base64 = req.body.base64;
  _parseDecimalPromise(data, base64)
    .then((response) => {
      res.status(200).json({
        data: response,
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};
const _parseDecimalPromise = (data, base64) => {
  return new Promise((resolve, reject) => {
    data = data.trim();
    let result;
    let dotIndex = "";
    data.split("&#x").forEach((item, index) => {
      if (item.split("").filter((item2) => item2 === ".").length > 0) {
        dotIndex = index;
      }
    });
    data = data.replace(".", "");

    _parseUnicodeValue(data, base64)
      .then(async (response) => {
        result = response
          .map((item, index) => {
            if (!item) {
              return item;
            }
            if (index === dotIndex - 1) {
              return item.value + ".";
            } else {
              return item.value;
            }
          })
          .join("");
        resolve(result);

        // resolve(response.map(item => item.value));
      })
      .catch((error) => {
        reject("__parseDecimalPromise error");
      });
  });
};
const exportCSV = (req, res) => {
  const rows = req.body.data;
  console.log("rows", rows);

  // fastCsv.writeToStream(process.stdout, rows);
  // fastCsv.writeToPath(path.resolve(__dirname, 'tmp.csv'), rows).on('error', err => {
  // res.status(400).json({
  //   error: err
  // });
  // }).on('finish', () => {
  // console.log(path.resolve(__dirname, 'tmp.csv'));
  // console.log('done');
  //
  // res.status(200).json({
  //   result: req.body
  // });
  // })
  const options = {
    root: __dirname + "/public/",
    dotfiles: "deny",
    headers: {
      "x-timestamp": Date.now(),
      "x-sent": true,
    },
  };
  fastCsv
    .writeToBuffer(rows)
    .then((data) => {
      console.log("buffer+++++", data);
      // res.status(200).send(data)
      fs.writeFile("aaa" + ".csv", data);
      // res.status(200).sendFIle('aaa', options)
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
  // const stream = fastCsv.format();
  // stream.pipe(process.stdout);
  // stream.write(rows);
  // stream.end()
};

const _getBase64DataFromPagePromise = (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await crawlPagePromise(req);
      console.log("_crawlRankingListBoxOfficePromise+++++", req.query);
      console.log("response+++++", response);
      const $ = response.$;
      const base64 = $("#js-nuwa")
        .html()
        .match(/(?<=src:url\().+.(?=\)\sformat\("woff"\))/)[0];

      resolve(base64);
    } catch (error) {
      reject(error);
    }
  });
};

const getBase64Data = async (req, res, next) => {
  _getBase64DataFromPagePromise(req)
    .then((response) => {
      res.status(200).json({
        data: response,
      });
    })
    .catch((error) => {
      res.status(400).json({
        error2: error,
      });
    });
};

exports.crawlPagePromise = crawlPagePromise;
exports.woffParser = woffParser;
exports.getFontDataFromPage = getFontDataFromPage;
exports.getFontDataByBase64 = getFontDataByBase64;
exports.getFontDictionaryFromPage = getFontDictionaryFromPage;
exports.getFontFile = getFontFile;
exports.getBase64Data = getBase64Data;
exports.generateFontDictionary = generateFontDictionary;
exports.arrayBufferToBase64 = arrayBufferToBase64;
exports.getDecodeFontValue = getDecodeFontValue;
exports.parseDecimal = parseDecimal;
exports.parseDecimalPromise = _parseDecimalPromise;

exports.exportCSV = exportCSV;
