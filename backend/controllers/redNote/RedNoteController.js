const express = require("express");
const Sequelize = require("sequelize");
const find = require("cheerio-eq");
const crawler = require("crawler");

const commonController = require("./CommonRedNoteController");
const { AsyncParser } = require("json2csv");
const fastCsv = require("fast-csv");
const Serializer = require("sequelize-to-json");
const fs = require("fs");

let headers = {};

const crawlAndSave = (req, res, next) => {
  const address = req.query.address;

  commonController
    .crawlPagePromise(req, res)
    .then((response) => {
      console.log("crawlPagePromise+++++++", response);
      const timestamp = Date.now();

      let count = 0;
      const loop = () => {
        _createRecordPromise(response.data.list[count], timestamp)
          .then((response2) => {
            if (count === response.data.list.length - 1) {
              res.status(200).json(response);
            } else {
              loop();
              count++;
            }
          })
          .catch((error) => {
            res.status(400).json({
              message: error2,
            });
          });
      };

      loop();
    })
    .catch((error) => {
      console.log("error++++++++");
      console.log(error);
      res.status(400).json({
        message: error,
      });
    });
};

const _createRecordPromise = (requestBody, timestamp) => {
  let _timestamp = timestamp;
  console.log("timestamp:   ", timestamp);
  if (!timestamp) {
    _timestamp = Date.now();
  }
  return new Promise((resolve, reject) => {
    MaoyanPreSaleModel.create({
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

const _trimData = (selector) => {
  let result = selector.html().replace(".", "").split(";");
  // console.log('_trimData+++++++++++++++++', result)
  return result
    .filter((item, index) => index < result.length - 2)
    .map((item) => {
      return item + ";";
    })
    .join("");
};

const _crawlHomepageListPromise = (req, res, next) => {
  return new Promise((resolve, reject) => {
    console.log("_crawlMovieListPromise++++++++", req.query);
    commonController
      .crawlPagePromise(req, res, next)
      .then((response) => {
        const $ = response.$;
        const result = [];
        const titleEL = $("#movie-list section article");
        const limit = Number(req.query.limit);
        let offset = 0;

        Object.keys(titleEL).forEach((item, index) => {
          // console.log('item+++++++', item);
          if (typeof Number(item) === "number") {
            // console.log('item+++++++', Number(item));
            if (
              index < Number(limit) ||
              Number(limit) === 0 ||
              limit === "" ||
              limit === undefined
            ) {
              let itemValue = titleEL[item].attribs["data-com"];
              result.push({
                indexOf: itemValue.indexOf("/movie/"),
                movieId: itemValue.replace(/[^0-9]/gi, ""),
                title: find(
                  $,
                  "#movie-list section article:eq(" + index + ") .title"
                ).text(),
              });
            }
          }
        });
        console.log("titleEL+++++++++", titleEL.options);

        resolve(result);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

exports.crawlAndSave = crawlAndSave;
