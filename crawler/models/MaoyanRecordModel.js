const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const MaoyanRecordModel = sequelize.define('MaoyanRecords', {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: true,
		primaryKey: true
	},
	recordId: {
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
	numOfRating: {
		type: Sequelize.STRING,
		allowNull: true
	},
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
	ratingByGenderMale: {
		type: Sequelize.STRING,
		allowNull: true
	},
	ratingByGenderFemale: {
		type: Sequelize.STRING,
		allowNull: true
	},
	ratingByAge20: {
		type: Sequelize.STRING,
		allowNull: true
	},
	ratingByAge20To24: {
		type: Sequelize.STRING,
		allowNull: true
	},
	ratingByAge25To29: {
		type: Sequelize.STRING,
		allowNull: true
	},
	ratingByAge30To34: {
		type: Sequelize.STRING,
		allowNull: true
	},
	ratingByAge35To39: {
		type: Sequelize.STRING,
		allowNull: true
	},
	ratingByAge40: {
		type: Sequelize.STRING,
		allowNull: true
	},
	ratingByTier1: {
		type: Sequelize.STRING,
		allowNull: true
	},
	ratingByTier2: {
		type: Sequelize.STRING,
		allowNull: true
	},
	ratingByTier3: {
		type: Sequelize.STRING,
		allowNull: true
	},
	ratingByTier4: {
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


	// 票房

	// 上座率
	avgSeatView: {
		type: Sequelize.STRING,
		allowNull: true
	},
	// 场均人次
	avgShowView: {
		type: Sequelize.STRING,
		allowNull: true
	},
	//
	avgViewBox: {
		type: Sequelize.STRING,
		allowNull: true
	},
	// 综合票房（万）
	boxInfo: {
		type: Sequelize.STRING,
		allowNull: true
	},
	// 票房占比
	boxRate: {
		type: Sequelize.STRING,
		allowNull: true
	},
	//
	myRefundNumInfo: {
		type: Sequelize.STRING,
		allowNull: true
	},
	//
	myRefundRateInfo: {
		type: Sequelize.STRING,
		allowNull: true
	},
	//
	onlineBoxRate: {
		type: Sequelize.STRING,
		allowNull: true
	},
	//
	refundViewInfo: {
		type: Sequelize.STRING,
		allowNull: true
	},
	//
	refundViewRate: {
		type: Sequelize.STRING,
		allowNull: true
	},
	// 上映天数
	releaseInfo: {
		type: Sequelize.STRING,
		allowNull: true
	},
	//
	releaseInfoColor: {
		type: Sequelize.STRING,
		allowNull: true
	},
	// 上座率
	seatRate: {
		type: Sequelize.STRING,
		allowNull: true
	},
	// 拍片场次
	showInfo: {
		type: Sequelize.STRING,
		allowNull: true
	},
	// 排片占比
	showRate: {
		type: Sequelize.STRING,
		allowNull: true
	},
	//
	splitAvgViewBox: {
		type: Sequelize.STRING,
		allowNull: true
	},
	//
	splitBoxInfo: {
		type: Sequelize.STRING,
		allowNull: true
	},
	// 票房占比
	splitBoxRate: {
		type: Sequelize.STRING,
		allowNull: true
	},
	//
	splitSumBoxInfo: {
		type: Sequelize.STRING,
		allowNull: true
	},
	// 总票房
	sumBoxInfo: {
		type: Sequelize.STRING,
		allowNull: true
	},
	//
	viewInfo: {
		type: Sequelize.STRING,
		allowNull: true
	},
	//
	viewInfoV2: {
		type: Sequelize.STRING,
		allowNull: true
	},

	// 预售数据

	// 预售票房
	preSaleBoxInfo: {
		type: Sequelize.STRING,
		allowNull: true
	},
	// 预售排片占比
	preSaleShowRate: {
		type: Sequelize.STRING,
		allowNull: true
	},
	// 预售排片场次
	preSaleShowInfo: {
		type: Sequelize.STRING,
		allowNull: true
	},
	// 首日预售票房
	preSaleDayOneBoxInfo: {
		type: Sequelize.STRING,
		allowNull: true
	},


});

module.exports = MaoyanRecordModel;
