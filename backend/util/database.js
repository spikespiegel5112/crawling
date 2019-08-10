const Sequelize = require('sequelize');

const sequelize = new Sequelize('sq_antisony', 'sq_antisony', 'D3C4N6B8', {
	dialect: 'mysql',
	host: 'mysql.sql143.cdncenter.net',
	timezone: '+08:00',
});

module.exports = sequelize;
