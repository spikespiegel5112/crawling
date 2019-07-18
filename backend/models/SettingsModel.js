const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Settings = sequelize.define('Settings', {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: true,
		primaryKey: true
	},
	settingId: {
		type: Sequelize.STRING,
		allowNull: true
	},
	name: {
		type: Sequelize.STRING,
		allowNull: true
	},
	code: {
		type: Sequelize.STRING,
		allowNull: false
	},
	type: {
		type: Sequelize.STRING,
		allowNull: false
	},
	value: {
		type: Sequelize.TEXT,
		allowNull: false
	}
});

module.exports = Settings;
