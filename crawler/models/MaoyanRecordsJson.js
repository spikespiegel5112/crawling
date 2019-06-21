const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const MaoyanRecordsJson = sequelize.define('MaoyanRecords', {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: true,
		primaryKey: true
	},
	timestamp: {
		type: Sequelize.STRING,
		allowNull: false
	},
	title: {
		type: Sequelize.STRING,
		allowNull: true
	},
	description: {
		type: Sequelize.STRING,
		allowNull: true
	},
	avgSeatView: {
		type: Sequelize.STRING,
		allowNull: true
	},
	avgShowView: {
		type: Sequelize.STRING,
		allowNull: true
	},
	avgViewBox: {
		type: Sequelize.STRING,
		allowNull: true
	},
	boxInfo: {
		type: Sequelize.STRING,
		allowNull: true
	},
	boxRate: {
		type: Sequelize.STRING,
		allowNull: true
	},
	movieId: {
		type: Sequelize.STRING,
		allowNull: true
	},
	movieName: {
		type: Sequelize.STRING,
		allowNull: true
	},
	myRefundNumInfo: {
		type: Sequelize.STRING,
		allowNull: true
	},
	myRefundRateInfo: {
		type: Sequelize.STRING,
		allowNull: true
	},
	onlineBoxRate: {
		type: Sequelize.STRING,
		allowNull: true
	},
	refundViewInfo: {
		type: Sequelize.STRING,
		allowNull: true
	},
	refundViewRate: {
		type: Sequelize.STRING,
		allowNull: true
	},
	releaseInfo: {
		type: Sequelize.STRING,
		allowNull: true
	},
	releaseInfoColor: {
		type: Sequelize.STRING,
		allowNull: true
	},
	seatRate: {
		type: Sequelize.STRING,
		allowNull: true
	},
	showInfo: {
		type: Sequelize.STRING,
		allowNull: true
	},
	showRate: {
		type: Sequelize.STRING,
		allowNull: true
	},
	splitAvgViewBox: {
		type: Sequelize.STRING,
		allowNull: true
	},
	splitBoxInfo: {
		type: Sequelize.STRING,
		allowNull: true
	},
	splitBoxRate: {
		type: Sequelize.STRING,
		allowNull: true
	},
	splitSumBoxInfo: {
		type: Sequelize.STRING,
		allowNull: true
	},
	sumBoxInfo: {
		type: Sequelize.STRING,
		allowNull: true
	},
	viewInfo: {
		type: Sequelize.STRING,
		allowNull: true
	},
	viewInfoV2: {
		type: Sequelize.STRING,
		allowNull: true
	},
	// 详情字段



});

module.exports = MaoyanRecordsJson;
