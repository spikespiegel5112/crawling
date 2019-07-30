const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const MaoyanPreSaleBookingDetailsModel = sequelize.define('MaoyanPreSaleBookingDetails', {
  id: {
	type: Sequelize.INTEGER,
	autoIncrement: true,
	allowNull: true,
	primaryKey: true
  },
  movieId: {
	type: Sequelize.STRING,
	allowNull: true
  },
  timestamp: {
	type: Sequelize.STRING,
	allowNull: false
  },
  title: {
	type: Sequelize.STRING,
	allowNull: true
  },
  date: {
	type: Sequelize.STRING,
	allowNull: true
  },
  accumulatedFirstDayPreSale: {
	type: Sequelize.STRING,
	allowNull: true
  },
  dailyAdditionalPreSale: {
	type: Sequelize.STRING,
	allowNull: true
  },
  accumulatedOpenVenues: {
	type: Sequelize.STRING,
	allowNull: true
  },
  dailyAdditionalVenue: {
	type: Sequelize.STRING,
	allowNull: true
  },
});

module.exports = MaoyanPreSaleBookingDetailsModel;
