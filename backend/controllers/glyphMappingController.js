const GlyphMappingModel = require('../models/GlyphMappingModel');
const uuidv1 = require('uuid/v1');

const getList = (req, res, next) => {
	let queryParam = req.query;
	let pagination = {};
	let where = {};
	if (queryParam.typeCode && queryParam.typeCode !== '') {
		where = {
			typeCode: queryParam.typeCode
		};
	}
	if (Object.keys(pagination).length > 0) {
		pagination = {
			limit: Number(queryParam.limit),
			offset: req.query.limit * (queryParam.page - 1)
		};
	}
	GlyphMappingModel.findAll({
		where: Object.assign(where, pagination)
	}).then(async data => {
		res.status(200).json({
			pagination: {
				total: await GlyphMappingModel.count()
			},
			data: data
		});
	}).catch(error => {
		res.status(500).json({
			error: {
				message: error,
			}
		});
	});
};

const createOrUpdate = (req, res, next) => {
	console.log('createOrUpdate', req.body);
	let mappingId = req.body.mappingId;
	let id = req.body.id;


	if (!id || id === '') {
		console.log('create');
		GlyphMappingModel.create({
			// mappingId: uuidv1(),
			unicode: req.body.unicode,
			number: req.body.number,
			value: req.body.value,
		}).then(data => {
			res.status(200).json({
				data: data
			});
		}).catch(error => {
			res.status(500).json({
				error: {
					message: error,
				}
			});
		});
	} else {
		console.log('update');
		GlyphMappingModel.findOne({
			where: {
				id: req.body.id
			}
		}).then(async data => {
			data.unicode = req.body.unicode;
			data.number = req.body.number;
			data.value = req.body.value;
			await data.save();
			res.status(200).json({
				data: data
			});
		}).catch(error => {
			res.status(500).json({
				error: {
					message: 'Failed',
					req: req.body,
					error: error.toString()
				}
			});
		});
	}

};

const deleteItem = (req, res, next) => {
	console.log(req.body);
	const idBody = req.body.id;
	console.log(idBody instanceof Array);
	if (idBody instanceof Array) {
		idBody.forEach((item, index) => {
			GlyphMappingModel.findOne({
				where: {
					id: item
				}
			}).then(async response => {
				console.log(response);
				const result = await response.destroy();
				if (index + 1 === idBody.length) {
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
			});
		});
	} else {
		GlyphMappingModel.findByPk(idBody).then(result => {
			console.log(result);
			result.destroy().then(() => {
				if (index + 1 === req.body.id.length) {
					res.status(200).json({
						message: 'Delete successful',
						body: result
					});
				}
			});
		}).catch(error => {
			res.status(400).json({
				message: 'Delete failed',
				error: error.toString()
			});
		});
	}
};

exports.getList = getList;
exports.createOrUpdate = createOrUpdate;
exports.deleteItem = deleteItem;
