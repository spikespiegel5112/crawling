const SettingsModel = require('../models/SettingsModel');
const uuidv1 = require('uuid/v1');

const getList = (req, res, next) => {
	let pagination = {};
	let query = {};
	if (Object.keys(pagination).length > 0) {
		pagination = {
			limit: Number(req.query.limit),
			page: Number(req.query.page),
			offset: req.query.limit * (req.query.page - 1)
		};
	}
	if (req.query.type) {
		query = {
			where: {
				type: req.query.type
			}
		};
	}


	SettingsModel.findAll(Object.assign(query, pagination)).then(async data => {
		res.status(200).json({
			pagination: {
				total: await SettingsModel.count(),
			},
			data: data
		})
	}).catch(error => {
		res.status(500).json({
			error: error,
			req: pagination
		})
	})
};

const createOrUpdate = (req, res, next) => {
	let settingId = req.body.settingId;
	console.log('settingId', req.body);
	if (!settingId || settingId === '') {
		SettingsModel.create({
			settingId: uuidv1(),
			name: req.body.name,
			type: req.body.type,
			code: req.body.code,
			value: req.body.value,
		}).then(result => {
			res.status(200).json({
				message: 'Created successful',
				result: result
			})
		}).catch(error => {
			res.status(400).json({
				message: 'Failed',
				error: error.toString()
			});
		})
	} else {
		console.log('settingId', settingId);

		SettingsModel.findOne({
			where: {
				settingId: settingId
			}
		}).then(async data => {
			console.log(data);
			data.name = req.body.name;
			data.type = req.body.type;
			data.code = req.body.code;
			data.value = req.body.value;
			await data.save();
			res.status(200).json({
				message: 'Updated successful',
				result: data
			})
		}).catch(error => {
			console.log(error);
			res.status(400).json({
				message: 'Failed',
				req: req.body,
				error: error.toString()
			});
		})
	}


};

const deleteItem = (req, res, next) => {
	console.log(req.body);
	console.log(req.params);
	const settingId = req.body.settingId;
	console.log(idBody instanceof Array);
	if (idBody instanceof Array) {
		idBody.forEach((item, index) => {
			SettingsModel.findAll({
				where: {
					settingId: settingId
				}
			}).then(async response => {
				const result = await response.destroy();
				if (index + 1 === req.body.id.length) {
					res.status(200).json({
						message: 'Delete successful',
						body: result
					});
				}
			}).catch(error => {
				res.status(400).json({
					message: 'Delete failed',
					error: error.toString()
				});
			})
		})
	} else {
		SettingsModel.findByPk(idBody).then(result => {
			console.log(result);
			result.destroy().then(() => {
				if (index + 1 === req.body.id.length) {
					res.status(200).json({
						message: 'Delete successful',
						body: result
					});
				}
			})
		}).catch(error => {
			res.status(400).json({
				message: 'Delete failed',
				error: error.toString()
			});
		})
	}
};


exports.createOrUpdate = createOrUpdate;
exports.getList = getList;
exports.deleteItem = deleteItem;
