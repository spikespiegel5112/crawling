const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Dictionary = sequelize.define('Dictionary', {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: true,
		primaryKey: true
	},
	dictionaryTypeCode:{
		type: Sequelize.STRING,
		allowNull: false
	},
	typeId: {
		type: Sequelize.STRING,
		allowNull: false
	},
	typeCode: {
		type: Sequelize.STRING,
		allowNull: false
	},
	name: {
		type: Sequelize.STRING,
		allowNull: false
	},
	code: {
		type: Sequelize.STRING,
		allowNull: false
	}

});

module.exports = Dictionary;
