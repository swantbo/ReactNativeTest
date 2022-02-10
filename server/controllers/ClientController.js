const config = require('config.json')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const db = require('helpers/db')
const Joi = require('joi')
const validateRequest = require('middleware/validate-request')

function authenticateSchema(req, res, next) {
	const schema = Joi.object({
		username: Joi.string().required(),
		password: Joi.string().required()
	})
	validateRequest(req, next, schema)
}

const authenticate = async (req, res) => {
	const {username, password} = req.body
	try {
		const user = await db.User.scope('withHash').findOne({
			where: {username}
		})

		if (!user || !(await bcrypt.compare(password, user.hash))) {
			res.status(500).json({message: 'Username or password is incorrect'})
		}

		const token = jwt.sign({sub: user.id}, config.secret, {expiresIn: '7d'})
		res.json({...omitHash(user.get()), token})
	} catch (error) {
		console.log(error)
		res.status(500).json({message: 'Unable to find user.'})
	}
}

const create = async (req, res) => {
	const {username, password} = req.params
	try {
		if (await db.User.findOne({where: {username: username}})) {
			res.status(500).json({message: 'Username already taken'})
		}

		// hash password
		if (password) {
			const hash = await bcrypt.hash(password, 10)

			// save user
			await db.User.create({username, password, hash}).then((user) =>
				res.json(user)
			)
		}
	} catch (error) {
		console.log(error)
		res.status(500).json({message: 'Unable to create account.'})
	}
}

function updateSchema(req, res, next) {
	const schema = Joi.object({
		firstName: Joi.string().empty(''),
		lastName: Joi.string().empty(''),
		username: Joi.string().empty(''),
		password: Joi.string().min(6).empty('')
	})
	validateRequest(req, next, schema)
}

const update = async (req, res, next) => {
	const {id} = req.params
	const {params} = req.body
	const user = await db.User.findByPk(id)

	// validate
	const usernameChanged = params.username && user.username !== params.username
	if (
		usernameChanged &&
		(await db.User.findOne({where: {username: params.username}}))
	) {
		throw 'Username "' + params.username + '" is already taken'
	}

	// hash password if it was entered
	if (params.password) {
		params.hash = await bcrypt.hash(params.password, 10)
	}

	// copy params to user and save
	Object.assign(user, params)
	await user.save()

	return omitHash(user.get())
}

const deleteUser = async (req, res, next) => {
	const {id} = req.params
	try {
		const user = await getUser(id)
		await user.destroy().then(() => {
			res.json({message: 'Account Deleted'})
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({message: 'Unable to delete account.'})
	}
}

// helper functions

async function getUser(id) {
	const user = await db.User.findByPk(id)
	if (!user) throw 'User not found'
	return user
}

function omitHash(user) {
	const {hash, ...userWithoutHash} = user
	return userWithoutHash
}

module.exports = {
	authenticateSchema,
	authenticate,
	deleteUser,
	update,
	create,
	updateSchema
}
