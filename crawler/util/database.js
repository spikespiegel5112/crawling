const Sequelize = require('sequelize');

const sequelize = new Sequelize('sq_antisony', 'sq_antisony', 'z9v8e4h9', {
	dialect: 'mysql',
	host: 'mysql.sql143.cdncenter.net',
	timezone: '+08:00',
});

module.exports = sequelize;