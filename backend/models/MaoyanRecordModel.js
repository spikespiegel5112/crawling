const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const MaoyanRecordModel = sequelize.define("MaoyanRecords", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: true,
    primaryKey: true,
  },
  recordId: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  timestamp: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  // 详情数据
  movieId: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  titleChi: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  title: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  date: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  releaseDate: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  platformEngName: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  platformChineseName: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  platformType: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  // 详情数据更多部分
  description: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  // 评分数据
  numOfRating: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  rating: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  rating1To2: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  rating3To4: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  rating5To6: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  rating7To8: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  rating9To10: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  ratingByGenderMale: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  ratingByGenderFemale: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  ratingByAge20: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  ratingByAge20To24: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  ratingByAge25To29: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  ratingByAge30To34: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  ratingByAge35To39: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  ratingByAge40: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  ratingByTier1: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  ratingByTier2: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  ratingByTier3: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  ratingByTier4: {
    type: Sequelize.TEXT,
    allowNull: true,
  },

  // 想看数据
  numWantToSee: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  wantToSeeByGenderMale: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  wantToSeeByGenderFemale: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  wantToSeeByAge20: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  wantToSeeByAge20To24: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  wantToSeeByAge25To29: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  wantToSeeByAge30To34: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  wantToSeeByAge35To39: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  wantToSeeByAge40: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  wantToSeeByTier1: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  wantToSeeByTier2: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  wantToSeeByTier3: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  wantToSeeByTier4: {
    type: Sequelize.TEXT,
    allowNull: true,
  },

  // 票房

  // 上座率
  avgSeatView: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  // 场均人次
  avgShowView: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  //
  avgViewBox: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  // 综合票房（万）
  boxInfo: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  // 票房占比
  boxRate: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  //
  myRefundNumInfo: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  //
  myRefundRateInfo: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  //
  onlineBoxRate: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  //
  refundViewInfo: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  //
  refundViewRate: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  // 上映天数
  releaseInfo: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  //
  releaseInfoColor: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  // 上座率
  seatRate: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  // 拍片场次
  showInfo: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  // 排片占比
  showRate: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  //
  splitAvgViewBox: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  //
  splitBoxInfo: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  // 票房占比
  splitBoxRate: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  //
  splitSumBoxInfo: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  // 总票房
  sumBoxInfo: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  //
  viewInfo: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  //
  viewInfoV2: {
    type: Sequelize.TEXT,
    allowNull: true,
  },

  // 全球票房

  // 全球票房
  globalBoxInfo: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  // 北美票房
  northAmericaBoxInfo: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  // IMDB评分
  imdbRating: {
    type: Sequelize.TEXT,
    allowNull: true,
  },

  // 预售数据

  // 预售票房
  preSaleBoxInfo: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  // 预售排片占比
  preSaleShowRate: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  // 预售排片场次
  preSaleShowInfo: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  // 首日预售票房
  preSaleDayOneBoxInfo: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
});

module.exports = MaoyanRecordModel;
