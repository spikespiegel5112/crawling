const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Users = sequelize.define('User', {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: true,
		primaryKey: true
	},
	userId: {
		type: Sequelize.STRING,
		allowNull: true
	},
	loginName: {
		type: Sequelize.STRING,
		allowNull: false
	},
	password:{
		type: Sequelize.STRING,
		allowNull: false
	},
	phone: {
		type: Sequelize.STRING,
		allowNull: false
	},
	email: {
		type: Sequelize.STRING,
		allowNull: false
	},
	address: {
		type: Sequelize.STRING,
		allowNull: false
	}
});

module.exports = Users;
