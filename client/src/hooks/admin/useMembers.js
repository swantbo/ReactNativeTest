import {useQuery} from 'react-query'
import request from 'superagent'
//import {getApiServer} from '../../utils/domain'
// import {getToken} from '../../utils/helpers'

export default function useMembers() {
	// const token = getToken()
	// const token = getToken()
	fetch(`http://localhost:4000/users`, {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		}
	})
		.then((response) => response.json())
		.then((data) => {
			console.log('newDate', data)
		})
		.catch((err) => console.error(err))
}
