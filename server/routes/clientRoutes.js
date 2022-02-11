const express = require('express')
const router = express.Router()
const authorize = require('middleware/authorize')
const ClientController = require('../controllers/ClientController')

// CREATE User
router.post('/create-user', ClientController.registerSchema, ClientController.createUser)

// POST Login/Authenticate User
router.post('/authenticate', ClientController.authenticateSchema, ClientController.authenticate)

// POST Forgot Password
router.post('/forgot-password', ClientController.forgotPassword)

// POST Logout User
router.post('/logout', ClientController.logout)

// DELETE User
router.delete('/:id', authorize(), ClientController.deleteUser)

// UPDATE User Data
router.put('/:id', authorize(), ClientController.updateUser)


// GET User Appointments
router.get('/appointments', authorize(), ClientController.getUserAppointments)

// CREATE User Appointments
router.post('/appointments', authorize(), ClientController.createUserAppointments)

// DELETE User Appointments
router.delete('/appointments', authorize(), ClientController.deleteUserAppointments)


// GET Barber Information
router.get('/barber', authorize(), ClientController.getBarber)

module.exports = router
