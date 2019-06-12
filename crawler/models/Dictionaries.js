const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Dictionaries = sequelize.define('Dictionaries', {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: true,
		primaryKey: true
	},
	dictionaryId: {
		type: Sequelize.STRING,
		allowNull: true
	},
	name: {
		type: Sequelize.STRING,
		allowNull: false
	},
	code: {
		type: Sequelize.STRING,
		allowNull: false
	},
	typeName: {
		type: Sequelize.STRING,
		allowNull: false
	},
	typeCode: {
		type: Sequelize.STRING,
		allowNull: false
	}

});

module.exports = Dictionaries;
