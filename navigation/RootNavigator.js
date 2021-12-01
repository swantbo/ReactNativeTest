import React, { useContext, useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { View, ActivityIndicator } from 'react-native'

import Firebase from '../config/firebase'
import { AuthenticatedUserContext } from './AuthenticatedUserProvider'
import AuthStack from './AuthStack'
import HomeStack from './HomeStack'
import AdminStack from './AdminStack'

import * as firebase from 'firebase'
const auth = Firebase.auth()

export default function RootNavigator() {
    const { user, setUser } = useContext(AuthenticatedUserContext)
    const [admin, setAdmin] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const unsubscribeAuth = auth.onAuthStateChanged(
            async (authenticatedUser) => {
                try {
                    await (authenticatedUser
                        ? setUser(authenticatedUser)
                        : setUser(null))
                    await firebase
                        .firestore()
                        .collection('users')
                        .doc(authenticatedUser.uid)
                        .get()
                        .then((doc) => {
                            doc.data()?.admin === true
                                ? setAdmin(true)
                                : setAdmin(false)
                        })
                    setIsLoading(false)
                } catch (error) {
                    Alert.alert(
                        'Error',
                        `Unable to Logout, try again. ${error}`
                    )
                }
            }
        )

        return unsubscribeAuth
    }, [])

    if (isLoading) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <ActivityIndicator size='large' />
            </View>
        )
    }
    //setAdmin(true)
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
