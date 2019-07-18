const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const HeadersSettings = sequelize.define('HeadersSettings', {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: true,
		primaryKey: true
	},
	headerId:{
		type: Sequelize.STRING,
		allowNull: true
	},
	name:{
		type: Sequelize.STRING,
		allowNull: true
	},
	type:{
		type: Sequelize.STRING,
		allowNull: false
	},
	headerKeyName:{
		type: Sequelize.STRING,
		allowNull: false
	},
	headerValueName:{
		type: Sequelize.STRING,
		allowNull: false
	},
});

module.exports = HeadersSettings;
