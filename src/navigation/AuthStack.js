import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import SignInScreen from '../screens/login/signin'
import SignUpScreen from '../screens/login/signup'
import ForgotPasswordScreen from '../screens/login/ForgotPassword'

const Stack = createStackNavigator()

export default function AuthStack() {
    return (
        <Stack.Navigator headerMode='none'>
            <Stack.Screen name='Login' component={SignInScreen} />
            <Stack.Screen name='Signup' component={SignUpScreen} />
            <Stack.Screen
                name='ForgotPassword'
                component={ForgotPasswordScreen}
            />
        </Stack.Navigator>
    )
}
