const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const GlyphMappings = sequelize.define('GlyphMapping', {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: true,
		primaryKey: true
	},
	unicode: {
		type: Sequelize.STRING,
		allowNull: true
	},
	number: {
		type: Sequelize.STRING,
		allowNull: false
	},
	value: {
		type: Sequelize.STRING,
		allowNull: false
	}

});

module.exports = GlyphMappings;
