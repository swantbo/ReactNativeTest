import React, { useEffect, useState } from 'react'
import {
    View,
    StyleSheet,
    Alert,
    TouchableOpacity,
    Linking,
} from 'react-native'
import { ListItem, Button } from 'react-native-elements'
import { ScrollView } from 'react-native-gesture-handler'
import { formatPhoneNumber } from '../../../utils/DataFormatting'
import { InputField } from '../../../components'

import * as firebase from 'firebase'
import moment from 'moment'

const EditAccountScreen = ({ navigation }) => {
    const [userInfo, setUserInfo] = useState([])
    const [search, setSearch] = useState('')
    const [searchResults, setSearchResults] = useState([])

    async function getUsers() {
        let data = []
        const snapshot = await firebase.firestore().collection('users').get()
        snapshot.docs.map((doc) => {
            let tempData = doc.data()
            let id = doc.id
            data.push({ id, ...tempData })
        })
        setUserInfo(data)
    }

    const deleteUser = (user_id) => {
        firebase
            .firestore()
            .collection('users')
            .doc(user_id)
            .delete()
            .catch((e) => {
                alert('Unable to delete user try again')
            })
    }

    const removeStrike = (user_id, strikes) => {
        if (strikes > 0) {
            const strikesTotal = Number(strikes) - 1
            const newStikes = {
                strikes: strikesTotal.toString(),
            }
            firebase
                .firestore()
                .collection('users')
                .doc(user_id)
                .set(newStikes, { merge: true })
                .catch((e) => {
                    alert('Unable to remove Strikes to user, try again')
                })
        } else {
            alert('User must have strikes to remove them')
        }
    }

    const addStrike = (user_id, strikes) => {
        const strikesTotal = 1 + Number(strikes)

        const newStikes = {
            strikes: strikesTotal.toString(),
        }
        firebase
            .firestore()
            .collection('users')
            .doc(user_id)
            .set(newStikes, { merge: true })
            .catch((e) => {
                alert('Unable to add Strikes to user, try again')
            })
    }

    const searchAccounts = (text) => {
        setSearch(text)
        const tempArray = userInfo.filter(
            (o) =>
                o.name.toLowerCase().includes(text.toLowerCase()) ||
                o.phone.toLowerCase().includes(text.toLowerCase()) ||
                o.email.toLowerCase().includes(text.toLowerCase())
        )
        setSearchResults(tempArray)
    }

    useEffect(() => {
        getUsers()
    }, [])

    return (
        <View style={styles.container}>
            <ScrollView>
                <InputField
                    inputStyle={{
                        fontSize: 14,
                    }}
                    containerStyle={{
                        backgroundColor: '#fff',
                        marginBottom: 20,
                        borderColor: 'black',
                        borderWidth: 1,
                    }}
                    leftIcon='account-search'
                    placeholder='Search Name, Number, or Email'
                    autoCapitalize='none'
                    autoCorrect={false}
                    value={search}
                    onChangeText={(text) => searchAccounts(text)}
                />
                {userInfo &&
                    (search !== '' ? searchResults : userInfo).map(
                        (onekey, i) => (
                            <>
                                <ListItem.Swipeable
                                    bottomDivider
                                    containerStyle={styles.ListItem}
                                    key={i}
                                    rightContent={
                                        <Button
                                            title='Delete'
                                            icon={{
                                                name: 'delete',
                                                color: 'white',
                                            }}
                                            buttonStyle={{
                                                minHeight: '100%',
                                                backgroundColor: 'red',
                                            }}
                                            onPress={() =>
                                                Alert.alert(
                                                    'Delete',
                                                    `Are you sure you want to delete ${'\n'}Account Name: ${
                                                        onekey.name
                                                            ? onekey.name
                                                            : 'N/A'
                                                    } ${'\n'}Account Id: ${
                                                        onekey.id
                                                            ? onekey.id
                                                            : 'N/A'
                                                    }`,
                                                    [
                                                        {
                                                            text: 'Cancel',
                                                        },
                                                        {
                                                            text: 'Delete User',
                                                            onPress: () =>
                                                                deleteUser(
                                                                    onekey.id
                                                                ),
                                                        },
                                                    ]
                                                )
                                            }
                                        />
                                    }
                                    leftContent={
                                        <Button
                                            title='Add Points'
                                            icon={{
                                                name: 'add-circle',
                                                color: 'white',
                                            }}
                                            buttonStyle={{
                                                minHeight: '100%',
                                                backgroundColor: 'green',
                                            }}
                                            onPress={() =>
                                                navigation.navigate(
                                                    'PointsScreen',
                                                    {
                                                        name: onekey.name,
                                                        userId: onekey.id,
                                                        goatPoints:
                                                            onekey.points,
                                                    }
                                                )
                                            }
                                        />
                                    }
                                >
                                    <ListItem.Content>
                                        <View
                                            style={{
                                                flex: 1,
                                                flexDirection: 'row',
                                            }}
                                        >
                                            {onekey?.created &&
                                                moment(
                                                    onekey?.created
                                                ).toDate() <
                                                    moment().add(3, 'days') && (
                                                    <View style={{}}>
                                                        <ListItem.Title
                                                            style={{
                                                                fontWeight:
                                                                    'bold',
                                                                paddingBottom: 10,
                                                                color: 'red',
                                                            }}
                                                        >
                                                            New{' '}
                                                        </ListItem.Title>
                                                    </View>
                                                )}
                                            <View
                                                style={{
                                                    flex: 2,
                                                    alignItems: 'flex-start',
                                                }}
                                            >
                                                <ListItem.Title
                                                    style={{
                                                        fontWeight: 'bold',
                                                        paddingBottom: 10,
                                                        color: '#E8BD70',
                                                    }}
                                                >
                                                    {onekey.name}{' '}
                                                </ListItem.Title>
                                            </View>
                                            <View
                                                style={{
                                                    flex: 1,
                                                    alignItems: 'flex-end',
                                                }}
                                            >
                                                <ListItem.Title
                                                    style={{
                                                        fontWeight: 'bold',
                                                        paddingBottom: 10,
                                                        color: 'red',
                                                    }}
                                                    onPress={() =>
                                                        Alert.alert(
                                                            'Strikes',
                                                            `Would you like to add or remove strikes from ${'\n'}Account Name: ${
                                                                onekey.name
                                                                    ? onekey.name
                                                                    : 'N/A'
                                                            } ${'\n'}Account Id: ${
                                                                onekey.id
                                                                    ? onekey.id
                                                                    : 'N/A'
                                                            }`,
                                                            [
                                                                {
                                                                    text: 'Cancel',
                                                                },
                                                                {
                                                                    text: 'Remove Strike',
                                                                    onPress:
                                                                        () =>
                                                                            removeStrike(
                                                                                onekey.id,
                                                                                onekey.strikes
                                                                            ),
                                                                },
                                                                {
                                                                    text: 'Add Strike',
                                                                    onPress:
                                                                        () =>
                                                                            addStrike(
                                                                                onekey.id,
                                                                                onekey.strikes
                                                                            ),
                                                                },
                                                            ]
                                                        )
                                                    }
                                                >
                                                    Strikes:{' '}
                                                    {onekey.strikes
                                                        ? onekey.strikes
                                                        : 'N/A'}
                                                </ListItem.Title>
                                            </View>
                                        </View>
                                        <View
                                            style={{
                                                flex: 1,
                                                flexDirection: 'row',
                                            }}
                                        >
                                            <View
                                                style={{
                                                    flex: 1,
                                                    alignItems: 'flex-start',
                                                }}
                                            >
                                                <TouchableOpacity
                                                    onPress={() =>
                                                        Linking.openURL(
                                                            `sms:${onekey?.phone}`
                                                        ).catch(() => {
                                                            Linking.openURL(
                                                                `sms:${onekey?.phone}`
                                                            )
                                                        })
                                                    }
                                                >
                                                    <ListItem.Subtitle
                                                        style={styles.text}
                                                    >
                                                        {formatPhoneNumber(
                                                            onekey.phone
                                                        )
                                                            ? formatPhoneNumber(
                                                                  onekey.phone
                                                              )
                                                            : onekey.phone}
                                                    </ListItem.Subtitle>
                                                </TouchableOpacity>
                                            </View>
                                            <View
                                                style={{
                                                    flex: 2,
                                                    alignItems: 'flex-end',
                                                }}
                                            >
                                                <ListItem.Subtitle
                                                    style={styles.text}
                                                    onPress={() =>
                                                        searchAccounts(
                                                            onekey.referral
                                                        )
                                                    }
                                                >
                                                    {onekey.referral
                                                        ? 'Referral: ' +
                                                          onekey.referral
                                                        : 'No Referral'}
                                                </ListItem.Subtitle>
                                            </View>
                                        </View>
                                        <View
                                            style={{
                                                flex: 1,
                                                flexDirection: 'row',
                                            }}
                                        >
                                            <View
                                                style={{
                                                    flex: 2,
                                                    alignItems: 'flex-start',
                                                }}
                                            >
                                                <ListItem.Subtitle
                                                    style={styles.text}
                                                >
                                                    {onekey.email
                                                        ? onekey.email
                                                        : 'N/A'}
                                                </ListItem.Subtitle>
                                            </View>
                                            <View
                                                style={{
                                                    flex: 1,
                                                    alignItems: 'flex-end',
                                                }}
                                            >
                                                <ListItem.Subtitle
                                                    style={styles.text}
                                                >
                                                    Goat Points: {onekey.points}
                                                </ListItem.Subtitle>
                                            </View>
                                        </View>
                                        <ListItem.Subtitle style={styles.text}>
                                            {onekey.id ? onekey.id : 'N/A'}
                                        </ListItem.Subtitle>
                                    </ListItem.Content>
                                </ListItem.Swipeable>
                            </>
                        )
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
})

export default EditAccountScreen