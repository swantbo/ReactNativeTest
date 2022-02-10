import {
	USER_STATE_CHANGE,
	USER_APPOINTMENTS_STATE_CHANGE,
	BARBER_STATE_CHANGE,
	CLEAR_DATA
} from '../constants'

import axios from 'axios'
import Firebase from '../../config/firebase'

const auth = Firebase.auth()

export function clearData() {
	return (dispatch) => {
		dispatch({type: CLEAR_DATA})
	}
}

export function reload() {
	return (dispatch) => {
		dispatch(clearData())
		dispatch(fetchUser())
		dispatch(fetchUserAppointments())
		dispatch(fetchBarber())
	}
}

export function fetchUser() {
	return async (dispatch) => {
		const token =
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsImlhdCI6MTY0NDQ1MDE5MiwiZXhwIjoxNjQ1MDU0OTkyfQ.-kljIsOQaVcdHeOpDqSVWcrmf7fOPzndGfnOOWxShLY'
		const url = 'https://0e81-75-86-218-83.ngrok.io/users/current'
		const config = {
			headers: {
				Authorization: `Bearer ${token}`
			}
		}
		await axios
			.get(url, config)
			.then((response) => {
				const results = response.data
				if (results) {
					console.log('results2', results)
					dispatch({
						type: USER_STATE_CHANGE,
						currentUser: results
					})
				}
			})
			.catch((error) => {
				console.log('error', error)
			})
	}
}

export function fetchUserAppointments() {
	return async (dispatch) => {
		await Firebase.firestore()
			.collection('users')
			.doc(auth.currentUser.uid)
			.collection('Haircuts')
			.get()
			.then((snapshot) => {
				let appointments = snapshot.docs.map((doc) => {
					const data = doc.data()
					const id = doc.id
					return {id, ...data}
				})

				dispatch({
					type: USER_APPOINTMENTS_STATE_CHANGE,
					appointments
				})
			})
	}
}

export function fetchBarber() {
	return async (dispatch) => {
		await Firebase.firestore()
			.collection('Barber')
			.doc('Nate')
			.get()
			.then((barberData) => {
				if (barberData.exists) {
					dispatch({
						type: BARBER_STATE_CHANGE,
						barber: barberData.data()
					})
				} else {
					console.log('does not exist')
				}
			})
	}
}
