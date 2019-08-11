const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
// const observe = require('object.observe');
const sequelize = require('./util/database');

const MaoyanRecords = require('./models/MaoyanBoxOfficeRecordModel');
const MaoyanBoxOfficeRecordModel = require('./models/MaoyanBoxOfficeRecordModel');
const Dictionaries = require('./models/Dictionaries');
const HeadersModel = require('./models/HeadersSettings');
const SettingsModel = require('./models/SettingsModel');
const MaoyanWantSeeModel = require('./models/MaoyanWantSeeModel');
const MaoyanPreSaleModel = require('./models/MaoyanPreSaleModel');
const MaoyanPreSaleBookingDetailsMappingModel = require('./models/MaoyanPreSaleBookingDetailsMappingModel');
const MaoyanPreSaleBookingDetailsModel = require('./models/MaoyanPreSaleBookingDetailsModel');


const errorController = require('./controllers/errorController');
const commonRoutes = require('./routers/commonRoutes');
const crawlerMaoyanBoxOfficeRoutes = require('./routers/crawlerMaoyanBoxOfficeRoutes');
const crawlerMaoyanPreSaleRoutes = require('./routers/crawlerMaoyanPreSaleRoutes');
const headerSettingsRoutes = require('./routers/headerSettings');
const crawlerMaoyanRankingListRoutes = require('./routers/crawlerMaoyanRankingListRoutes');
const settingsRoutes = require('./routers/settingsRoutes');
const dictionaryRoutes = require('./routers/dictionary');


app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.raw());
app.use(bodyParser.text());


app.use((err, req, res, next) => {
	let {origin} = req.headers;
	console.log('dsdsds');
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, HEAD, DELETE, OPTIONS");
	res.setHeader("X-Powered-By", "3.2.1");
	if (req.method.toUpperCase() === "OPTIONS") {
		res.statusCode = 204;
		res.end();
	} else {
		next();

	}
});
var corsOptions = {
	origin: '*', //只有百度可以访问
	optionsSuccessStatus: 200
};


app.use('/crawlerMaoyanRankingList', cors(corsOptions), crawlerMaoyanRankingListRoutes);
app.use('/crawlerMaoyanPreSale', cors(corsOptions), crawlerMaoyanPreSaleRoutes);
app.use('/crawlerMaoyanBoxOffice', cors(corsOptions), crawlerMaoyanBoxOfficeRoutes);
app.use('/headerSettings', cors(corsOptions), headerSettingsRoutes);
app.use('/settings', cors(corsOptions), settingsRoutes);
app.use('/dictionary', cors(corsOptions), dictionaryRoutes);
app.use('/common', cors(corsOptions), commonRoutes);

// app.use('*', errorController.get404);

sequelize.sync().then(result => {
	app.listen(3001);
}).catch(error => {
	console.log(error)
});

