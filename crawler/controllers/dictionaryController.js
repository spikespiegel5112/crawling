const DictionaryModel = require('../models/DictionaryModel');
const uuidv1 = require('uuid/v1');

const getListByIdOrCode = (req, res, next) => {
	const queryParam = req.query.typeId ? 'typeId' : 'typeCode';

	DictionaryModel.findAll({
		where: {
			[queryParam]: req.query[queryParam]
		}
	}).then(async data => {
		res.status(200).json({
			data: data
		})
	}).catch(error => {
		res.status(500).json({
			error: {
				message: error,
				req: pagination
			}
		})
	})
};

const createOrUpdate = (req, res, next) => {
	DictionaryModel.create({
		typeId: uuidv1(),
		typeCode: req.body.typeCode,
		code: req.body.code,
		name: req.body.name,
	}).then(async data => {
		res.status(200).json({
			data: {
				typeCode: req.body.typeCode,
				name: req.body.name,
				code: req.body.code
			}
		})
	}).catch(error => {
		res.status(500).json({
			error: {
				message: error,
			}
		})
	})
};


exports.getList = getListByIdOrCode;
exports.create = createOrUpdate;
