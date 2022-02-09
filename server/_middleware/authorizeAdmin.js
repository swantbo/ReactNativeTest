const jwt = require('express-jwt')
const {secret} = require('config.json')
const db = require('_helpers/db')

module.exports = authorizeAdmin

function authorizeAdmin() {
	return [
		// authenticate JWT token and attach decoded token to request as req.user
		jwt({secret, algorithms: ['HS256']}),

		// attach full user record to request object
		async (req, res, next) => {
			// get user with id from token 'sub' (subject) property
			const user = await db.User.findByPk(req.user.sub)

			// check user still exists
			if (!user) return res.status(401).json({message: 'Unauthorized'})

			if (user.role === 'admin') {
				// authorization successful
				req.user = user.get()
				next()
			}
		}
	]
}
