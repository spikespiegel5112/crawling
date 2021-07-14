const HeadersSettings = require('../models/HeadersSettings')
const uuidv1 = require('uuid/v1')

const getList = (req, res, next) => {
	let pagination = {
		limit: Number(req.query.limit),
		page: Number(req.query.page),
		offset: req.query.limit * (req.query.page - 1),
	}

	HeadersSettings.findAll({
		offset: pagination.offset,
		limit: pagination.limit,

		// order: ['DESC']
	})
		.then(async (data) => {
			res.status(200).json({
				pagination: {
					total: await HeadersSettings.count(),
				},
				data: data,
			})
		})
		.catch((error) => {
			res.status(500).json({
				error: error,
				req: pagination,
			})
		})
}

const createOrUpdate = (req, res, next) => {
	let headerId = req.body.headerId
	console.log('headerId++++createOrUpdate', req.body)
	if (!headerId || headerId === '') {
		HeadersSettings.create({
			headerId: uuidv1(),
			name: req.body.name,
			type: req.body.type,
			headerKeyName: req.body.headerKeyName,
			headerValueName: req.body.headerValueName,
		})
			.then((result) => {
				res.status(200).json({
					message: 'Created successful',
					result: result,
				})
			})
			.catch((error) => {
				res.status(400).json({
					message: 'Failed',
					error: error.toString(),
				})
			})
	} else {
		console.log('headerId', headerId)

		HeadersSettings.findOne({
			where: {
				headerId: headerId,
			},
		})
			.then(async (data) => {
				console.log(data)
				data.name = req.body.name
				data.type = req.body.type
				data.headerKeyName = req.body.headerKeyName
				data.headerValueName = req.body.headerValueName
				await data.save()
				res.status(200).json({
					message: 'Updated successful',
					result: data,
				})
			})
			.catch((error) => {
				console.log(error)
				res.status(400).json({
					message: 'Failed',
					req: req.body,
					error: error.toString(),
				})
			})
	}
}

const deleteItem = (req, res, next) => {
	console.log(req.body)
	console.log(req.params)
	const headerId = req.body.headerId
	console.log(idBody instanceof Array)
	if (idBody instanceof Array) {
		idBody.forEach((item, index) => {
			HeadersSettings.findAll({
				where: {
					headerId: headerId,
				},
			})
				.then(async (response) => {
					const result = await response.destroy()
					if (index + 1 === req.body.id.length) {
						res.status(200).json({
							message: 'Delete successful',
							body: result,
						})
					}
				})
				.catch((error) => {
					res.status(400).json({
						message: 'Delete failed',
						error: error.toString(),
					})
				})
		})
	} else {
		HeadersSettings.findByPk(idBody)
			.then((result) => {
				console.log(result)
				result.destroy().then(() => {
					if (index + 1 === req.body.id.length) {
						res.status(200).json({
							message: 'Delete successful',
							body: result,
						})
					}
				})
			})
			.catch((error) => {
				res.status(400).json({
					message: 'Delete failed',
					error: error.toString(),
				})
			})
	}
}

exports.createOrUpdate = createOrUpdate
exports.getList = getList
exports.deleteItem = deleteItem
