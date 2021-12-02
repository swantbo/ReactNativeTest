import React, { useEffect, useState, useContext } from 'react'
import {
    View,
    StyleSheet,
    TextInput,
    Alert,
    TouchableOpacity,
} from 'react-native'
import { ListItem, Button } from 'react-native-elements'
import * as firebase from 'firebase'
import { formatPhoneNumber } from '../../../utils/DataFormatting'

import Firebase from '../../../config/firebase'

import { AuthenticatedUserContext } from '../../../navigation/AuthenticatedUserProvider'

const auth = Firebase.auth()

const SettingScreen = () => {
    const { user } = useContext(AuthenticatedUserContext)
    const [userInfo, setUserInfo] = useState({})
    const [changeUserInfo, setChangeUserInfo] = useState()
    const [newUserInfo, setNewUserInfo] = useState('')
    const [userDataType, setUserDataType] = useState('')

    const handleSignOut = async () => {
        try {
            await auth.signOut()
        } catch (error) {
            Alert.alert('Error', `Unable to Logout, try again. ${error}`)
        }
    }

    const changeInfo = (onekey) => {
        setChangeUserInfo(onekey[1])
        setUserDataType(onekey[0].toLowerCase())
    }

    const setUserData = (newUserInfo) => {
        const updateUserData = {
            [`${userDataType}`]: newUserInfo,
        }
        try {
            firebase
                .firestore()
                .collection('users')
                .doc(user.uid)
                .update(updateUserData)
            Alert.alert(
                'Success',
                `Your ${userDataType} has been changed to ${newUserInfo}`
            )
        } catch (error) {
            Alert.alert('There is an error.', err.message)
        }
    }

    function getUserData() {
        firebase
            .firestore()
            .collection('users')
            .doc(user.uid)
            .get()
            .then((userData) => {
                const userInfo = {
                    Name: userData.data().name,
                    Phone: formatPhoneNumber(userData.data().phone)
                        ? formatPhoneNumber(userData.data().phone)
                        : userData.data().phone,
                }
                setUserInfo(userInfo)
            })
    }

    useEffect(() => {
        getUserData()
    }, [])

    return (
        <View style={styles.container}>
            <ListItem
                bottomDivider
                containerStyle={{ backgroundColor: '#000' }}
            >
                <ListItem.Content>
                    <ListItem.Title
                        style={{
                            fontWeight: 'bold',
                            alignSelf: 'center',
                            color: '#fff',
                        }}
                    >
                        My Account Details
                    </ListItem.Title>
                </ListItem.Content>
            </ListItem>
            {changeUserInfo && (
                <View>
                    <TextInput
                        placeholder={changeUserInfo}
                        placeholderTextColor='#fff'
                        onChangeText={setNewUserInfo}
                        value={newUserInfo}
                        style={styles.textInput}
                    />
                    <TouchableOpacity
                        style={{
                            backgroundColor: '#E8BD70',
                            borderRadius: 5,
                            padding: 10,
                            margin: 5,
                        }}
                        onPress={() => setUserData(newUserInfo)}
                    >
                        <ListItem.Title
                            style={{ color: '#000', alignSelf: 'center' }}
                        >
                            {`Change ${
                                userDataType.charAt(0).toUpperCase() +
                                userDataType.slice(1)
                            }`}
                        </ListItem.Title>
                    </TouchableOpacity>
                </View>
            )}
            {Object.entries(userInfo).map((onekey, index) => (
                <ListItem
                    key={index}
                    containerStyle={{ backgroundColor: '#121212' }}
                    bottomDivider
                    onPress={() => changeInfo(onekey)}
                >
                    <ListItem.Content>
                        <ListItem.Title style={styles.text}>
                            {' '}
                            {onekey[0]}: {onekey[1]}{' '}
                        </ListItem.Title>
                    </ListItem.Content>
                </ListItem>
            ))}
            <ListItem
                bottomDivider
                containerStyle={{ backgroundColor: '#121212' }}
                onPress={() => handleSignOut()}
            >
                <ListItem.Content>
                    <ListItem.Title
                        style={{
                            fontWeight: 'bold',
                            alignSelf: 'center',
                            color: '#E8BD70',
                        }}
                    >
                        Sign Out
                    </ListItem.Title>
                </ListItem.Content>
            </ListItem>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    text: {
        fontSize: 16,
        fontWeight: 'normal',
        color: '#fff',
    },
    textInput: {
        borderWidth: 1,
        borderColor: 'grey',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
        color: '#fff',
    },
})

export default SettingScreen
