import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import LoginScreen from '../screens/login/LoginScreen'
import SignupScreen from '../screens/login/SignupScreen'
import ForgotPasswordScreen from '../screens/login/ForgotPasswordScreen'

const Stack = createStackNavigator()

export default function AuthStack() {
    return (
        <Stack.Navigator headerMode='none'>
            <Stack.Screen name='Login' component={LoginScreen} />
            <Stack.Screen name='Signup' component={SignupScreen} />
            <Stack.Screen
                name='ForgotPassword'
                component={ForgotPasswordScreen}
            />
        </Stack.Navigator>
    )
}
