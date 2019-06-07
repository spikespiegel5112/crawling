const express = require('express');
const app = express();
const bodyParser = require('body-parser');
// const observe = require('object.observe');
const sequelize = require('./util/database');

const errorController = require('./controllers/error');
const crawlerRoutes = require('./routers/crawler');

const MaoYanModel = require('./models/MaoyanModel');

app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(express.json());


app.use('/crawler', crawlerRoutes);
app.use((err, req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-reqed-With, Content-Type, Accept, Authorization');
	if (req.method === 'OPTIONS') {
		res.header('Accept-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
		return res.status(200).json({})
	}
	res.status(err.status || 500);
	res.json({
		message: err.message,
		error: err
	});
	next();
});
app.use(errorController.get404);

sequelize.sync().then(result => {
	app.listen(3000);
}).catch(error => {
	console.log(error)
});

