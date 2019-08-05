const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const MaoyanPreSaleBookingDetailsMappingModel = sequelize.define('MaoyanPreSaleBookingDetailsMapping', {
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
	movieId: {
		type: Sequelize.STRING,
		allowNull: false
	},
	timestamp: {
		type: Sequelize.STRING,
		allowNull: false
	},
});

module.exports = MaoyanPreSaleBookingDetailsMappingModel;
