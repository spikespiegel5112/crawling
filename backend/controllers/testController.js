const express = require('express');
const MaoyanRecords = require('../models/MaoyanBoxOfficeRecordModel');
const SettingsModel = require('../models/SettingsModel');

const testUrl = (req, res, next) => {
  let data = {
	url: 'http://www.baidu.com'
  };
  console.log('testUrl++++++', data);
  try{
	res.status(200).json({
	  data: data
	})
  }catch (e) {
	res.status(400).json({
	  data: data
	})
  }

};
exports.testUrl = testUrl;
