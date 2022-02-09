require('rootpath')()
const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const errorHandler = require('_middleware/error-handler')
const fs = require('fs')
const https = require('https')

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(cors())

// api routes
app.use('/users', require('./users/users.controller'))

// global error handler
app.use(errorHandler)

// start server
const port =
	process.env.NODE_ENV === 'production' ? process.env.PORT || 80 : 4000
app.listen(port, () => console.log('Server listening on port ' + port))

// const options = {
// 	key: fs.readFileSync('server.key'),
// 	cert: fs.readFileSync('server.cert')
// }

// https.createServer(options, app).listen(4000, function (req, res) {
// 	console.log('Server started at port 4000')
// })
