const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const csrf = require("csurf");
const session = require("express-session");
// const observe = require('object.observe');
const sequelize = require("./util/database");

const MaoyanRecords = require("./models/MaoyanBoxOfficeRecordModel");
const MaoyanBoxOfficeRecordModel = require("./models/MaoyanBoxOfficeRecordModel");
const Dictionaries = require("./models/Dictionaries");
const HeadersModel = require("./models/HeadersSettings");
const LogsModel = require("./models/LogsModel");
const SettingsModel = require("./models/SettingsModel");
const MaoyanWantWatchModel = require("./models/MaoyanWantWatchModel");
const MaoyanPreSaleModel = require("./models/MaoyanPreSaleModel");
const MaoyanPreSaleBookingDetailsMappingModel = require("./models/MaoyanPreSaleBookingDetailsMappingModel");
const MaoyanPreSaleBookingDetailsModel = require("./models/MaoyanPreSaleBookingDetailsModel");
const RedNoteHomepageModel = require("./models/RedNoteHomepageModel");

const errorController = require("./controllers/errorController");
const commonRoutes = require("./routers/commonRoutes");
const crawlerRedNoteRoutes = require("./routers/crawlerRedNoteRoutes");
const crawlerMaoyanBoxOfficeRoutes = require("./routers/crawlerMaoyanBoxOfficeRoutes");
const crawlerMaoyanPreSaleRoutes = require("./routers/crawlerMaoyanPreSaleRoutes");
const headerSettingsRoutes = require("./routers/headerSettings");
const crawlerMaoyanRankingListRoutes = require("./routers/crawlerMaoyanRankingListRoutes");
const settingsRoutes = require("./routers/settingsRoutes");
const dictionaryRoutes = require("./routers/dictionary");
const glyphMappingRoutes = require("./routers/glyphMappingRoutes");
const userRoutes = require("./routers/userRoutes");
const testRoutes = require("./routers/testRoutes");

const csrfProtection = csrf({
  cookie: true,
});
app.use(
  session({
    secret: "my secret",
    reserve: false,
    saveUninitialized: false,
  })
);

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.raw());
app.use(bodyParser.text());

app.use((err, req, res, next) => {
  let { origin } = req.headers;
  console.log("dsdsds");
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, HEAD, DELETE, OPTIONS"
  );
  res.setHeader("X-Powered-By", "3.2.1");
  if (req.method.toUpperCase() === "OPTIONS") {
    res.statusCode = 204;
    res.end();
  } else {
    next();
  }
});
var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};

app.use("/crawlerRedNoteRoutes", cors(corsOptions), crawlerRedNoteRoutes);
app.use(
  "/crawlerMaoyanRankingList",
  cors(corsOptions),
  crawlerMaoyanRankingListRoutes
);
app.use(
  "/crawlerMaoyanRankingList",
  cors(corsOptions),
  crawlerMaoyanRankingListRoutes
);
app.use("/crawlerMaoyanPreSale", cors(corsOptions), crawlerMaoyanPreSaleRoutes);
app.use(
  "/crawlerMaoyanBoxOffice",
  cors(corsOptions),
  crawlerMaoyanBoxOfficeRoutes
);
app.use("/headerSettings", cors(corsOptions), headerSettingsRoutes);
app.use("/settings", cors(corsOptions), settingsRoutes);
app.use("/dictionary", cors(corsOptions), dictionaryRoutes);
app.use("/glyphMapping", cors(corsOptions), glyphMappingRoutes);
app.use("/common", cors(corsOptions), commonRoutes);
app.use("/user", cors(corsOptions), userRoutes);
app.use("/test", cors(corsOptions), testRoutes);

// app.use('*', errorController.get404);

sequelize
  .sync()
  .then((result) => {
    app.listen(3000);
  })
  .catch((error) => {
    console.log(error);
  });
