const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Logs = sequelize.define('Logs', {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: true,
		primaryKey: true
	},
	crawlerType: {
		type: Sequelize.STRING,
		allowNull: true
	},
	crawlerDate: {
		type: Sequelize.STRING,
		allowNull: true
	}
});

module.exports = Logs;
