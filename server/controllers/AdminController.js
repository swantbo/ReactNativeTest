const config = require('config.json')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const db = require('helpers/db')
const Joi = require('joi')
const validateRequest = require('middleware/validate-request')

const getBarberData = async (req, res) => {
	try {
		const barberData = await db.Barber
		if (!barberData) {
			res.status(500).json({message: 'Unable to get Barber data.'})
		} 
		// return barber data
	} catch (error) {
		console.log(error)
		res.status(500).json({message: 'Unable to get Barber data.'})
	}
}

const updateBarberData = async (req, res) => {
	const {barberData} = req.body
	try {
		await db.Barber.update(barberData)
	} catch (error) {
		console.log(error)
		res.status(500).json({message: 'Unable to update Barber data.'})
	}
}

const deleteBarberData = async (req, res) => {
	const {barberData} = req.body
	try {
		const foundBarberData = await db.Barber.findOne({where: {barberData: barberData}})
		
        if (!foundBarberData) {
            res.status(500).json({message: 'Unable to delete Barber data.'})
        }
		await foundBarberData.destroy().then(() => {
			res.json({message: 'Barber data deleted'})
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({message: 'Unable to delete Barber data.'})
	}
}

const getUsers = async (req, res, next) => {
	try {
		const getAllUsers = await db.User.all()
		if (!getAllUsers) {
			res.status(500).json({message: 'Unable to get user.'})
		} 
		// return users
	} catch (error) {
		console.log(error)
		res.status(500).json({message: 'Unable to get user.'})
	}
}

const updateUsers = async (req, res, next) => {
	const {id} = req.body
	try {
		const foundUser = await db.User.findByPk(id)
		if (!foundUser) {
			res.status(500).json({message: 'Unable to update account.'})
		} 
		// update user information
	} catch (error) {
		console.log(error)
		res.status(500).json({message: 'Unable to update account.'})
	}
}

const deleteUsers = async (req, res, next) => {
	const {id} = req.body
	try {
		const foundUser = await db.User.findByPk(id)
		if (!foundUser) {
			res.status(500).json({message: 'Unable to delete account.'})
		} 
		await user.destroy().then(() => {
			res.json({message: 'Account Deleted'})
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({message: 'Unable to delete account.'})
	}
}

const createAppointments = async (req, res, next) => {
	const {appointment} = req.body
	try {
		// add user appointment
	} catch (error) {
		console.log(error)
		res.status(500).json({message: 'Unable to create appoinment.'})
	}
}

const getAppointments = async (req, res, next) => {
	const {id} = req.body
	try {
		const getAllAppointments = await db.Appointments.all()
		if (!getAllAppointments) {
			res.status(500).json({message: 'Unable to get appointments.'})
		} 
		// find user appointments
		const findAppointments = []
	} catch (error) {
		console.log(error)
		res.status(500).json({message: 'Unable to get appointments.'})
	}
}

const updateAppointments = async (req, res, next) => {
	const {appointment} = req.body
	try {
		const findAppointments = await db.Appointments.findByPk(appointment)
		if (!findAppointments) {
			res.status(500).json({message: 'Unable to update appointment.'})
		} 
		// update appointment
	} catch (error) {
		console.log(error)
		res.status(500).json({message: 'Unable to update appointment.'})
	}
}

const deleteAppointments = async (req, res, next) => {
	const {id} = req.body
	try {
		const foundAppointment = await db.Appointment.findByPk(id)
		if (!foundAppointment) {
			res.status(500).json({message: 'Unable to delete appointment.'})
		} 
		// Delete appointment
	} catch (error) {
		console.log(error)
		res.status(500).json({message: 'Unable to delete appointment.'})
	}
}



// GET Appointments
// router.get('/appointments', authorize(), AdminController.getAppointments)

// CREATE Appointments
// router.post('/appointments', authorize(), AdminController.createAppointments)

// PUT Update Appointments
// router.put('/appointments', authorize(), AdminController.updateAppointments)

// DELETE Appointments
// router.delete('/appointments', authorize(), AdminController.deleteAppointments)


module.exports = {
	getBarberData,
    updateBarberData,
    deleteBarberData,
    getUsers,
    updateUsers,
    deleteUsers,
    createAppointments,
    getAppointments,
    updateAppointments,
    deleteAppointments
}
