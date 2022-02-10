const express = require('express')
const router = express.Router()
const authorize = require('middleware/authorize')
const AdminController = require('../controllers/AdminController')

// GET Barber Information
// router.get('/barber', authorize(), AdminController.getBarberData)

// POST Update BarberInfo
// router.post('/barber', authorize(), AdminController.updateBarberData)

// DELETE Update BarberInfo
// router.delete('/barber', authorize(), AdminController.deleteBarberData)

// GET All Users
//router.post('/users', authorize(), AdminController.updateUser)

// POST Update Users
//router.post('/users', authorize(), AdminController.updateUser)

// DELETE Users
//router.post('/users', authorize(), AdminController.deleteUser)



// GET Appointments
// router.get('/appointments', authorize(), AdminController.getAppointments)

// CREATE Appointments
// router.post('/appointments', authorize(), AdminController.createAppointments)

// PUT Update Appointments
// router.put('/appointments', authorize(), AdminController.updateAppointments)

// DELETE Appointments
// router.delete('/appointments', authorize(), AdminController.deleteAppointments)


module.exports = router
