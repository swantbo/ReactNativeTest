import React from 'react'
import {createStackNavigator} from '@react-navigation/stack'

import SignInScreen from '../screens/auth/Signin'
import SignUpScreen from '../screens/auth/Signup'
import ForgotPasswordScreen from '../screens/auth/Forgot'

const Stack = createStackNavigator()

export default function AuthStack() {
	return (
		<Stack.Navigator headerMode='none'>
			<Stack.Screen name='Login' component={SignInScreen} />
			<Stack.Screen name='Signup' component={SignUpScreen} />
			<Stack.Screen name='ForgotPassword' component={ForgotPasswordScreen} />
		</Stack.Navigator>
	)
}
