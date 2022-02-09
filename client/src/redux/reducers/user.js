import {
	USER_STATE_CHANGE,
	USER_APPOINTMENTS_STATE_CHANGE,
	BARBER_STATE_CHANGE,
	CLEAR_DATA
} from '../constants'

const initialState = {
	currentUser: [],
	appointments: [],
	barber: []
}

export const user = (state = initialState, action) => {
	switch (action.type) {
		case USER_STATE_CHANGE:
			return {
				...state,
				currentUser: action.currentUser
			}
		case USER_APPOINTMENTS_STATE_CHANGE:
			return {
				...state,
				appointments: action.appointments
			}
		case BARBER_STATE_CHANGE:
			return {
				...state,
				barber: action.barber
			}
		case CLEAR_DATA:
			return {
				initialState
			}
		default:
			return state
	}
}
