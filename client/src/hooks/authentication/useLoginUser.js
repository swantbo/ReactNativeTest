import axios from 'axios'
//import {getApiServer} from '../../utils/domain'
// import {getToken} from '../../utils/helpers'

export default async function useLoginUser() {
	const url = 'https://441e-75-86-218-83.ngrok.io/users/authenticate'
	const data = {
		username: 'jason',
		password: 'my-super-secret-password'
	}
	await axios
		.post(url, data)
		.then((response) => {
			const results = response.data
			console.log('results', results)
		})
		.catch((error) => {
			console.log('error', error)
		})
}

