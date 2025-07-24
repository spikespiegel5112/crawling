const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const MaoyanWantWatchModel = sequelize.define('MaoyanWantWatch', {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: true,
		primaryKey: true
	},
	timestamp:{
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
	numWantToSee: {
		type: Sequelize.STRING,
		allowNull: true
	},
	rating: {
		type: Sequelize.STRING,
		allowNull: true
	},
	byGenderMale: {
		type: Sequelize.STRING,
		allowNull: true
	},
	byGenderFemale: {
		type: Sequelize.STRING,
		allowNull: true
	},
	byAge20: {
		type: Sequelize.STRING,
		allowNull: true
	},
	byAge20To24: {
		type: Sequelize.STRING,
		allowNull: true
	},
	byAge25To29: {
		type: Sequelize.STRING,
		allowNull: true
	},
	byAge30To34: {
		type: Sequelize.STRING,
		allowNull: true
	},
	byAge35To39: {
		type: Sequelize.STRING,
		allowNull: true
	},
	byAge40: {
		type: Sequelize.STRING,
		allowNull: true
	},
	byTier1: {
		type: Sequelize.STRING,
		allowNull: true
	},
	byTier2: {
		type: Sequelize.STRING,
		allowNull: true
	},
	byTier3: {
		type: Sequelize.STRING,
		allowNull: true
	},
	byTier4: {
		type: Sequelize.STRING,
		allowNull: true
	}
});

module.exports = MaoyanWantWatchModel;
