import React, {useContext, useEffect, useState} from 'react'
import {NavigationContainer} from '@react-navigation/native'
import {View, ActivityIndicator, Alert} from 'react-native'

import Firebase from '../config/firebase'
import {AuthenticatedUserContext} from './AuthenticatedUserProvider'
import AuthStack from './AuthStack'
import HomeStack from './HomeStack'
import AdminStack from './AdminStack'

import axios from 'axios'
import * as firebase from 'firebase'
const auth = Firebase.auth()

export default function RootNavigator() {
	const {user, setUser} = useContext(AuthenticatedUserContext)
	const [admin, setAdmin] = useState(false)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const token =
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsImlhdCI6MTY0NDQ1MDE5MiwiZXhwIjoxNjQ1MDU0OTkyfQ.-kljIsOQaVcdHeOpDqSVWcrmf7fOPzndGfnOOWxShLY'
		const url = 'https://0e81-75-86-218-83.ngrok.io/users/current'
		const config = {
			headers: {
				Authorization: `Bearer ${token}`
			}
		}
		axios
			.get(url, config)
			.then((response) => {
				const results = response.data
				console.log('navigationResults', results)
				setUser(results)
				user?.role === 'admin' ? setAdmin(true) : setAdmin(false)
				setIsLoading(false)
			})
			.catch((error) => {
				console.log('error1', error)
				setIsLoading(false)
			})
	}, [])

	if (isLoading) {
		return (
			<View
				style={{
					flex: 1,
					justifyContent: 'center',
					alignItems: 'center'
				}}>
				<ActivityIndicator size='large' />
			</View>
		)
	}

	return (
		<NavigationContainer>
			{user && admin !== true ? (
				<HomeStack />
			) : user && admin === true ? (
				<AdminStack />
			) : (
				<AuthStack />
			)}
		</NavigationContainer>
	)
}
