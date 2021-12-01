import React, { useEffect, useState, useContext } from 'react'
import {
    View,
    Text,
    Button,
    StyleSheet,
    TextInput,
    Alert,
    ActivityIndicator,
} from 'react-native'
import { ListItem } from 'react-native-elements'
import { ScrollView } from 'react-native-gesture-handler'

import * as firebase from 'firebase'

import Firebase from '../../config/firebase'
const auth = Firebase.auth()
import { AuthenticatedUserContext } from '../../navigation/AuthenticatedUserProvider'

const AdminEditProfileScreen = () => {
    const { user } = useContext(AuthenticatedUserContext)
    const [isLoading, setIsLoading] = useState(true)
    const [barberProfile, setBarberProfile] = useState({
        name: '',
        Tuesday: '',
        Wednesday: '',
        Thursday: '',
        Friday: '',
        Saturday: '',
        instagram: '',
        location: '',
        phone: '',
        price: '',
        website: '',
    })
    const [changeData, setChangeData] = useState('')
    const [barberDataType, setBarberDataType] = useState('')
    const [newBarberData, setNewBarberData] = useState('')
    const [userInfo, setUserInfo] = useState({ name: '', phone: '' })

    const handleSignOut = async () => {
        try {
            await auth.signOut()
        } catch (error) {
            Alert.alert('Error', `Unable to Logout, try again. ${error}`)
        }
    }
    const getBarberProfil = async () => {
        const data = await firebase
            .firestore()
            .collection('Barber')
            .doc('Nate')
            .get()
        setBarberProfile({ ...barberProfile, ...data.data() })
        setIsLoading(false)
    }

    const changeBarberData = (value, type) => {
        setChangeData(value.toString()), setBarberDataType(type.toLowerCase())
    }

    const setBarberData = () => {
        let barberData
        if (barberDataType === 'userphone' || 'username') {
            barberData = {
                [barberDataType.replace('user', '')]: newBarberData,
            }
        } else {
            barberData = {
                [barberDataType]: newBarberData,
            }
        }
        if (
            barberDataType !== 'username' &&
            barberDataType !== 'userphone' &&
            newBarberData !== ''
        ) {
            firebase
                .firestore()
                .collection('Barber')
                .doc('Nate')
                .set(barberData, { merge: true })
                .then(() => {
                    Alert.alert(
                        'Success',
                        `Your Barber data ${barberDataType} has been changed to ${newBarberData}`
                    )
                })
                .catch((error) => {
                    alert('Something went wrong try again')
                })
        }
        if (
            barberDataType === 'username' ||
            (barberDataType === 'userphone' && newBarberData !== '')
        ) {
            firebase
                .firestore()
                .collection('users')
                .doc(user.uid)
                .set(barberData, { merge: true })
                .then(() => {
                    Alert.alert(
                        'Success',
                        `Your Account ${barberDataType} has been changed to ${newBarberData}`
                    )
                })
                .catch((error) => {
                    alert('Something went wrong try again' + error)
                })
        }
    }

    function getUserData() {
        firebase
            .firestore()
            .collection('users')
            .doc(user.uid)
            .get()
            .then((userData) => {
                setUserInfo(userData.data())
            })
    }

    useEffect(() => {
        getUserData()
        getBarberProfil()
    }, [])

    return (
        <View style={styles.container}>
            <ScrollView>
                {changeData != '' ? (
                    <View>
                        <>
                            <TextInput
                                placeholder={changeData.toString()}
                                placeholderTextColor={'#fff'}
                                onChangeText={setNewBarberData}
                                value={newBarberData}
                                style={styles.textInput}
                            />
                            <Button
                                color={'#E8BD70'}
                                title={`Change ${barberDataType}: ${changeData}`}
                                onPress={() => setBarberData()}
                            />
                        </>
                    </View>
                ) : (
                    <Text></Text>
                )}
                {barberProfile && !isLoading ? (
                    <>
                        <ListItem
                            bottomDivider
                            containerStyle={styles.ListItem}
                        >
                            <ListItem.Content>
                                <ListItem.Title
                                    style={{
                                        fontWeight: 'bold',
                                        color: '#E8BD70',
                                    }}
                                >
                                    Info
                                </ListItem.Title>
                            </ListItem.Content>
                        </ListItem>
                        <ListItem
                            bottomDivider
                            containerStyle={styles.ListItem}
                            onPress={() =>
                                changeBarberData(barberProfile.price, 'price')
                            }
                        >
                            <ListItem.Content>
                                <ListItem.Title style={styles.text}>
                                    Price: {barberProfile.price}{' '}
                                </ListItem.Title>
                            </ListItem.Content>
                        </ListItem>
                        <ListItem
                            bottomDivider
                            containerStyle={styles.ListItem}
                            onPress={() =>
                                changeBarberData(
                                    barberProfile.website,
                                    'website'
                                )
                            }
                        >
                            <ListItem.Content>
                                <ListItem.Title style={styles.text}>
                                    Website: {barberProfile.website}{' '}
                                </ListItem.Title>
                            </ListItem.Content>
                        </ListItem>
                        <ListItem
                            bottomDivider
                            containerStyle={styles.ListItem}
                            onPress={() =>
                                changeBarberData(
                                    barberProfile.instagram,
                                    'instagram'
                                )
                            }
                        >
                            <ListItem.Content>
                                <ListItem.Title style={styles.text}>
                                    Instagram: {barberProfile.instagram}{' '}
                                </ListItem.Title>
                            </ListItem.Content>
                        </ListItem>
                        <ListItem
                            bottomDivider
                            containerStyle={styles.ListItem}
                            onPress={() =>
                                changeBarberData(barberProfile.phone, 'phone')
                            }
                        >
                            <ListItem.Content>
                                <ListItem.Title style={styles.text}>
                                    Phone: {barberProfile.phone}{' '}
                                </ListItem.Title>
                            </ListItem.Content>
                        </ListItem>
                        <ListItem
                            bottomDivider
                            containerStyle={styles.ListItem}
                        >
                            <ListItem.Content>
                                <ListItem.Title
                                    style={{
                                        fontWeight: 'bold',
                                        color: '#E8BD70',
                                    }}
                                >
                                    Address and Location
                                </ListItem.Title>
                            </ListItem.Content>
                        </ListItem>
                        <ListItem
                            bottomDivider
                            containerStyle={styles.ListItem}
                            onPress={() =>
                                changeBarberData(
                                    barberProfile.location,
                                    'location'
                                )
                            }
                        >
                            <ListItem.Content>
                                <ListItem.Title style={styles.text}>
                                    Address: {barberProfile.location}{' '}
                                </ListItem.Title>
                            </ListItem.Content>
                        </ListItem>
                        <ListItem
                            bottomDivider
                            containerStyle={styles.ListItem}
                            onPress={() =>
                                changeBarberData(
                                    barberProfile.Tuesday,
                                    'Tuesday'
                                )
                            }
                        >
                            <ListItem.Content>
                                <ListItem.Title style={styles.text}>
                                    Tuesday: {barberProfile.Tuesday}{' '}
                                </ListItem.Title>
                            </ListItem.Content>
                        </ListItem>
                        <ListItem
                            bottomDivider
                            containerStyle={styles.ListItem}
                            onPress={() =>
                                changeBarberData(
                                    barberProfile.Wednesday,
                                    'Wednesday'
                                )
                            }
                        >
                            <ListItem.Content>
                                <ListItem.Title style={styles.text}>
                                    Wednesday: {barberProfile.Wednesday}{' '}
                                </ListItem.Title>
                            </ListItem.Content>
                        </ListItem>
                        <ListItem
                            bottomDivider
                            containerStyle={styles.ListItem}
                            onPress={() =>
                                changeBarberData(
                                    barberProfile.Thursday,
                                    'Thursday'
                                )
                            }
                        >
                            <ListItem.Content>
                                <ListItem.Title style={styles.text}>
                                    Thursday: {barberProfile.Thursday}{' '}
                                </ListItem.Title>
                            </ListItem.Content>
                        </ListItem>
                        <ListItem
                            bottomDivider
                            containerStyle={styles.ListItem}
                            onPress={() =>
                                changeBarberData(barberProfile.Friday, 'Friday')
                            }
                        >
                            <ListItem.Content>
                                <ListItem.Title style={styles.text}>
                                    Friday: {barberProfile.Friday}{' '}
                                </ListItem.Title>
                            </ListItem.Content>
                        </ListItem>
                        <ListItem
                            bottomDivider
                            containerStyle={styles.ListItem}
                            onPress={() =>
                                changeBarberData(
                                    barberProfile.Saturday,
                                    'Saturday'
                                )
                            }
                        >
                            <ListItem.Content>
                                <ListItem.Title style={styles.text}>
                                    Saturday: {barberProfile.Saturday}{' '}
                                </ListItem.Title>
                            </ListItem.Content>
                        </ListItem>
                        <ListItem
                            bottomDivider
                            containerStyle={styles.ListItem}
                        >
                            <ListItem.Content>
                                <ListItem.Title
                                    style={{
                                        fontWeight: 'bold',
                                        color: '#E8BD70',
                                    }}
                                >
                                    Account Details
                                </ListItem.Title>
                            </ListItem.Content>
                        </ListItem>
                        <ListItem
                            bottomDivider
                            containerStyle={styles.ListItem}
                            onPress={() =>
                                changeBarberData(userInfo.name, 'userName')
                            }
                        >
                            <ListItem.Content>
                                <ListItem.Title style={styles.text}>
                                    Name: {userInfo.name}{' '}
                                </ListItem.Title>
                            </ListItem.Content>
                        </ListItem>
                        <ListItem
                            bottomDivider
                            containerStyle={styles.ListItem}
                            onPress={() =>
                                changeBarberData(userInfo.phone, 'userPhone')
                            }
                        >
                            <ListItem.Content>
                                <ListItem.Title style={styles.text}>
                                    Phone: {userInfo.phone}{' '}
                                </ListItem.Title>
                            </ListItem.Content>
                        </ListItem>
                        <ListItem
                            bottomDivider
                            containerStyle={styles.ListItem}
                            onPress={() => handleSignOut()}
                        >
                            <ListItem.Content>
                                <ListItem.Title
                                    style={{
                                        fontWeight: 'bold',
                                        color: '#E8BD70',
                                        alignSelf: 'center',
                                    }}
                                >
                                    SignOut
                                </ListItem.Title>
                            </ListItem.Content>
                        </ListItem>
                    </>
                ) : (
                    <ActivityIndicator color='#000' size='large' />
                )}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    text: {
        color: '#fff',
    },
    ListItem: {
        backgroundColor: '#121212',
    },
    textInput: {
        borderWidth: 1,
        borderColor: 'grey',
        padding: 10,
        margin: 10,
        borderRadius: 5,
        color: '#fff',
    },
})

export default AdminEditProfileScreen
