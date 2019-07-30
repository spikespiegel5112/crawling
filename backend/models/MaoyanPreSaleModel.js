const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const MaoyanPreSaleModel = sequelize.define('MaoyanPreSale', {
  id: {
	type: Sequelize.INTEGER,
	autoIncrement: true,
	allowNull: false,
	primaryKey: true
  },
  movieId: {
	type: Sequelize.INTEGER,
	allowNull: false
  },
  timestamp: {
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
  premiereBoxInfo: {
	type: Sequelize.STRING,
	allowNull: true
  },
  premiereShowRate: {
	type: Sequelize.STRING,
	allowNull: true
  },
  premiereShowInfo: {
	type: Sequelize.STRING,
	allowNull: true
  }
});

module.exports = MaoyanPreSaleModel;
