const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const MaoyanRecordModel = sequelize.define('MaoyanRecord', {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: true,
		primaryKey: true
	},
	recordId:{
		type: Sequelize.STRING,
		allowNull: false
	},
	timestamp: {
		type: Sequelize.STRING,
		allowNull: false
	},
	// 详情数据
	movieId: {
		type: Sequelize.STRING,
		allowNull: false
	},
	titleChi: {
		type: Sequelize.STRING,
		allowNull: true
	},
	title: {
		type: Sequelize.STRING,
		allowNull: true
	},
	date: {
		type: Sequelize.STRING,
		allowNull: true
	},
	releaseDate: {
		type: Sequelize.STRING,
		allowNull: true
	},
	platformEngName: {
		type: Sequelize.STRING,
		allowNull: true
	},
	platformChineseName: {
		type: Sequelize.STRING,
		allowNull: true
	},
	platformType: {
		type: Sequelize.STRING,
		allowNull: true
	},
	description: {
		type: Sequelize.STRING,
		allowNull: true
	},
	// 评分数据
	rating: {
		type: Sequelize.STRING,
		allowNull: true
	},
	rating1To2: {
		type: Sequelize.STRING,
		allowNull: true
	},
	rating3To4: {
		type: Sequelize.STRING,
		allowNull: true
	},
	rating5To6: {
		type: Sequelize.STRING,
		allowNull: true
	},
	rating7To8: {
		type: Sequelize.STRING,
		allowNull: true
	},
	rating9To10: {
		type: Sequelize.STRING,
		allowNull: true
	},
	// 想看数据
	numWantToSee: {
		type: Sequelize.STRING,
		allowNull: true
	},
	wantToSeeByGenderMale: {
		type: Sequelize.STRING,
		allowNull: true
	},
	wantToSeeByGenderFemale: {
		type: Sequelize.STRING,
		allowNull: true
	},
	wantToSeeByAge20: {
		type: Sequelize.STRING,
		allowNull: true
	},
	wantToSeeByAge20To24: {
		type: Sequelize.STRING,
		allowNull: true
	},
	wantToSeeByAge25To29: {
		type: Sequelize.STRING,
		allowNull: true
	},
	wantToSeeByAge30To34: {
		type: Sequelize.STRING,
		allowNull: true
	},
	wantToSeeByAge35To39: {
		type: Sequelize.STRING,
		allowNull: true
	},
	wantToSeeByAge40: {
		type: Sequelize.STRING,
		allowNull: true
	},
	wantToSeeByTier1: {
		type: Sequelize.STRING,
		allowNull: true
	},
	wantToSeeByTier2: {
		type: Sequelize.STRING,
		allowNull: true
	},
	wantToSeeByTier3: {
		type: Sequelize.STRING,
		allowNull: true
	},
	wantToSeeByTier4: {
		type: Sequelize.STRING,
		allowNull: true
	},




	// 内地票房
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


});

module.exports = MaoyanRecordModel;
