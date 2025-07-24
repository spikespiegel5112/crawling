const Sequelize = require("sequelize");

const sequelize = new Sequelize("crawler", "crawler", "ZWCFPzATzhm48nAC", {
  dialect: "mysql",
  host: "baobaojs.com",
  timezone: "+08:00",
});

module.exports = sequelize;
