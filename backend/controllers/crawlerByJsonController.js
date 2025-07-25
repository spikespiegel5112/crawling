const express = require("express");
const crawler = require("crawler");
const MaoyanRecords = require("../models/MaoyanBoxOfficeRecordModel");
const SettingsModel = require("../models/SettingsModel");

let dataJSONHeaders = {};
const _crawlPromise = (req, res, next) => {
  return new Promise(async (resolve, reject) => {
    let $ = {};

    const crawlerInstance = new crawler({
      maxConnections: 10,
      // This will be called for each crawled page
      callback: function (error, result, done) {
        if (error) {
          console.log("creating error: ", error);
          res.status(400).json({
            message: error.toString(),
          });
        } else {
          // $ is Cheerio by default
          //a lean implementation of core jQuery designed specifically for the server
          // console.log($("title").text());
        }
        done();
      },
    });

    dataJSONHeaders = {
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Methods": "GET",
      "Access-Control-Allow-Origin": "https://piaofang.maoyan.com",
      "Access-Control-Max-Age": "2592000",
      Connection: "keep-alive",
      "Content-Encoding": "gzip",
      "Content-Type": "application/json;charset=utf-8",
      Date: "Wed, 05 Jun 2019 12:18:52 GMT",
      ETag: "W/'0a3c3dfbb55a4bcfb08584d89d29ae9c8'",
      "M-SpanName": "MBOBoxController.getSecondBox",
      "M-TraceId": "-1579717533259130308",
      Server: "openresty",
      "Transfer-Encoding": "chunked",
    };

    let headers = {};
    try {
      headers = await SettingsModel.findOne({
        where: {
          code: req.body.headerCode,
        },
      });
      headers = headers._previousDataValues;

      // res.status(200).json({
      // 	headers
      // })
    } catch (e) {
      res.status(400).json({
        error: e,
        req: req.query,
      });
    }

    crawlerInstance.queue({
      url: req.body.address,
      // headers: dataJSONHeaders,
      headers: JSON.parse(headers.value),
      callback: (error, result, done) => {
        console.log(error);
        console.log(result);
        if (error) {
          console.log("insrtance error: ", error);
          reject(error.toString());
        } else {
          $ = result.$;
          // console.log('Grabbed', result.body.length, 'bytes');
          console.log("$: ", result.body);
          let crawlerResult;
          try {
            crawlerResult = Object.assign(
              { headers: JSON.parse(headers.value) },
              JSON.parse(result.body)
            );
            resolve(crawlerResult);
          } catch (e) {
            reject(e);
          }
        }
        done();
      },
    });
  });
};

const _createRecord = (requestBody, timestamp) => {
  let _timestamp = timestamp;
  console.log(timestamp);
  if (!timestamp) {
    _timestamp = Date.now();
  }
  return new Promise((resolve, reject) => {
    MaoyanRecords.create({
      timestamp: _timestamp,
      avgSeatView: requestBody.avgSeatView,
      avgShowView: requestBody.avgShowView,
      avgViewBox: requestBody.avgViewBox,
      boxInfo: requestBody.boxInfo,
      boxRate: requestBody.boxRate,
      movieId: requestBody.movieId,
      movieName: requestBody.movieName,
      myRefundNumInfo: requestBody.myRefundNumInfo,
      myRefundRateInfo: requestBody.myRefundRateInfo,
      onlineBoxRate: requestBody.onlineBoxRate,
      refundViewInfo: requestBody.refundViewInfo,
      refundViewRate: requestBody.refundViewRate,
      releaseInfo: requestBody.releaseInfo,
      releaseInfoColor: requestBody.releaseInfoColor,
      seatRate: requestBody.seatRate,
      showInfo: requestBody.showInfo,
      showRate: requestBody.showRate,
      splitAvgViewBox: requestBody.splitAvgViewBox,
      splitBoxInfo: requestBody.splitBoxInfo,
      splitBoxRate: requestBody.splitBoxRate,
      splitSumBoxInfo: requestBody.splitSumBoxInfo,
      sumBoxInfo: requestBody.sumBoxInfo,
      viewInfo: requestBody.viewInfo,
      viewInfoV2: requestBody.viewInfoV2,
    })
      .then((result) => {
        // console.log(result);
        resolve(result);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const crawl = (req, res, next) => {
  console.log(req.query.address);
  _crawlPromise(req, res, next)
    .then((response) => {
      res.status(200).json(response.data);
    })
    .catch((error) => {
      res.status(400).json({
        message: error.toString(),
      });
    });
};

const getListByPagination = (req, res, next) => {
  let pagination = {
    limit: Number(req.query.limit),
    page: Number(req.query.page),
    offset: req.query.limit * (req.query.page - 1),
  };

  MaoyanRecords.findAll({
    offset: pagination.offset,
    limit: pagination.limit,
    // order: ['DESC']
  })
    .then(async (data) => {
      res.status(200).json({
        pagination: {
          total: await MaoyanRecords.count(),
        },
        data: data,
      });
    })
    .catch((error) => {
      res.status(500).json({
        error: {
          message: error,
          req: pagination,
        },
      });
    });
};

const getCrawlDate = (req, res, next) => {
  let query = {
    limit: Number(req.query.limit),
    page: Number(req.query.page),
    offset: req.query.page * (req.query.page - 1),
  };

  MaoyanRecords.findAll({
    offset: pagination.offset,
    limit: pagination.limit,
  })
    .then((data) => {
      res.status(200).json({
        req: pagination,
        data: data,
      });
    })
    .catch((error) => {
      res.status(500).json({
        error: {
          message: error,
          req: pagination,
        },
      });
    });
};

const getListByDate = (req, res, next) => {
  let query = {
    limit: Number(req.query.limit),
    page: Number(req.query.page),
    offset: req.query.page * (req.query.page - 1),
  };

  MaoyanRecords.findAll({
    offset: pagination.offset,
    limit: pagination.limit,
  })
    .then((data) => {
      res.status(200).json({
        req: pagination,
        data: data,
      });
    })
    .catch((error) => {
      res.status(500).json({
        error: {
          message: error,
          req: pagination,
        },
      });
    });
};

const save = (req, res, next) => {
  // console.log('postAddProduct', req.body);
  const maoyanData = {
    avgSeatView: "3.0%",
    avgShowView: "3",
    avgViewBox: "39.2",
    boxInfo: "46.21",
    boxRate: "0.9%",
    movieId: "1207959",
    movieName: "阿拉丁",
    myRefundNumInfo: "--",
    myRefundRateInfo: "--",
    onlineBoxRate: "--",
    refundViewInfo: "--",
    refundViewRate: "--",
    releaseInfo: "上映14天",
    releaseInfoColor: "#666666 1.00",
    seatRate: "0.9%",
    showInfo: "4701",
    showRate: "1.3%",
    splitAvgViewBox: "35.7",
    splitBoxInfo: "42.00",
    splitBoxRate: "0.9%",
    splitSumBoxInfo: "2.71亿",
    sumBoxInfo: "2.92亿",
    viewInfo: "1.1",
    viewInfoV2: "1.1万",
  };
  const timestamp = Date.now();

  MaoyanRecords.create({
    timestamp: _timestamp,
    avgSeatView: requestBody.avgSeatView,
    avgShowView: requestBody.avgShowView,
    avgViewBox: requestBody.avgViewBox,
    boxInfo: requestBody.boxInfo,
    boxRate: requestBody.boxRate,
    movieId: requestBody.movieId,
    movieName: requestBody.movieName,
    myRefundNumInfo: requestBody.myRefundNumInfo,
    myRefundRateInfo: requestBody.myRefundRateInfo,
    onlineBoxRate: requestBody.onlineBoxRate,
    refundViewInfo: requestBody.refundViewInfo,
    refundViewRate: requestBody.refundViewRate,
    releaseInfo: requestBody.releaseInfo,
    releaseInfoColor: requestBody.releaseInfoColor,
    seatRate: requestBody.seatRate,
    showInfo: requestBody.showInfo,
    showRate: requestBody.showRate,
    splitAvgViewBox: requestBody.splitAvgViewBox,
    splitBoxInfo: requestBody.splitBoxInfo,
    splitBoxRate: requestBody.splitBoxRate,
    splitSumBoxInfo: requestBody.splitSumBoxInfo,
    sumBoxInfo: requestBody.sumBoxInfo,
    viewInfo: requestBody.viewInfo,
    viewInfoV2: requestBody.viewInfoV2,
  })
    .then((result) => {
      console.log(result);
      // res.status(200).json({
      // 	data: req
      // })
    })
    .catch((error) => {
      res.status(500).json({
        message: error,
      });
    });

  // _createRecord(req, timestamp).then(response => {
  // 	res.status(200).json({
  // 		data: req
  // 	})
  // }).catch(error => {
  // 	res.status(500).json({
  // 		message: error
  // 	})
  // })
};

const crawlAndSave = (req, res, next) => {
  const address = req.body.address;
  _crawlPromise(req, res)
    .then((response) => {
      console.log("_crawlPromise", response);
      const timestamp = Date.now();

      response.data.list.forEach((item, index) => {
        _createRecord(item, timestamp)
          .then((response2) => {
            if (index === response.data.list.length - 1) {
              res.status(200).json(response);
            }
          })
          .catch((error) => {
            res.status(500).json({
              message: error,
            });
          });
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: error,
      });
    });
};

const deleteRecords = (req, res, next) => {
  console.log(req.body);
  console.log(req.params);
  const idBody = req.body.id;
  console.log(idBody instanceof Array);
  if (idBody instanceof Array) {
    idBody.forEach((item, index) => {
      MaoyanRecords.findByPk(item)
        .then(async (response) => {
          const result = await response.destroy();
          if (index + 1 === req.body.id.length) {
            res.status(200).json({
              message: "Delete successful",
              body: result,
            });
          }
        })
        .catch((error) => {
          res.status(400).json({
            message: "Delete failed",
            error: error.toString(),
          });
        });
    });
  } else {
    MaoyanRecords.findByPk(idBody)
      .then((result) => {
        console.log(result);
        result.destroy().then(() => {
          if (index + 1 === req.body.id.length) {
            res.status(200).json({
              message: "Delete successful",
              body: result,
            });
          }
        });
      })
      .catch((error) => {
        res.status(400).json({
          message: "Delete failed",
          error: error.toString(),
        });
      });
  }
};

exports.crawl = crawl;
exports.save = save;
exports.getListByPagination = getListByPagination;
exports.getListByDate = getListByDate;
exports.crawlAndSave = crawlAndSave;
exports.deleteRecords = deleteRecords;
