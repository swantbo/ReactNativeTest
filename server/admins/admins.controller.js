const express = require('express')
const router = express.Router()
const Joi = require('joi')
const validateRequest = require('middleware/validate-request')
const authorizeAdmin = require('middleware/authorizeAdmin')
const adminService = require('./admin.service')

// routes
router.post('/authenticate', authenticateSchema, authenticate)
router.get('/users', getAll)
router.get('/current', authorizeAdmin(), getCurrent)
router.get('/:id', authorizeAdmin(), getById)
router.put('/:id', authorizeAdmin(), updateSchema, update)
router.delete('/:id', authorizeAdmin(), _delete)

module.exports = router

function authenticateSchema(req, res, next) {
	const schema = Joi.object({
		email: Joi.string().required(),
		password: Joi.string().required()
	})
	validateRequest(req, next, schema)
}

function authenticate(req, res, next) {
	adminService
		.authenticate(req.body)
		.then((user) => res.json(user))
		.catch(next)
}

function getAll(req, res, next) {
	adminService
		.getAll()
		.then((users) => res.json(users))
		.catch(next)
}

function getCurrent(req, res, next) {
	res.json(req.user)
}

function getById(req, res, next) {
	adminService
		.getById(req.params.id)
		.then((user) => res.json(user))
		.catch(next)
}

function updateSchema(req, res, next) {
	const schema = Joi.object({
		firstName: Joi.string().empty(''),
		lastName: Joi.string().empty(''),
		email: Joi.string().empty(''),
		password: Joi.string().min(6).empty('')
	})
	validateRequest(req, next, schema)
}

function update(req, res, next) {
	adminService
		.update(req.params.id, req.body)
		.then((user) => res.json(user))
		.catch(next)
}

function _delete(req, res, next) {
	adminService
		.delete(req.params.id)
		.then(() => res.json({message: 'User deleted successfully'}))
		.catch(next)
}
