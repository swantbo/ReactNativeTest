import React, { useContext, useEffect, useState } from 'react'
import { View, Text, Button, StyleSheet, TextInput, Alert } from 'react-native'
import { Card } from 'react-native-elements'
import * as firebase from 'firebase'

import { AuthenticatedUserContext } from '../../../navigation/AuthenticatedUserProvider'

const PointsScreen = ({ route }) => {
    const { user } = useContext(AuthenticatedUserContext)
    const { name, userId, goatPoints } = route.params
    const [points, onChangePoints] = useState('')

    useEffect(() => {}, [])

    const addPointsToUser = async () => {
        const pointsTotal = Number(points) + Number(goatPoints)

        const newPoints = {
            points: pointsTotal.toString(),
        }
        await firebase
            .firestore()
            .collection('users')
            .doc(userId)
            .set(newPoints, { merge: true })
            .then(() => {
                Alert.alert(
                    'Points Added',
                    `${name}, now has ${pointsTotal} Goat Points`,
                    [
                        {
                            text: 'Okay',
                        },
                    ]
                )
            })
    }

    return (
        <View style={styles.container}>
            <Card containerStyle={styles.ListItem}>
                <Card.Title style={styles.text}>{name}</Card.Title>
                <Card.Divider />
                <Text style={styles.text}>
                    Current Goat Points: {goatPoints}
                </Text>
                <TextInput
                    style={styles.textInput}
                    onChangeText={onChangePoints}
                    value={points}
                    placeholder='Goat Points'
                    placeholderTextColor={'#fff'}
                />
                <Button onPress={() => addPointsToUser()} title='Add Points' />
            </Card>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#fff',
        padding: 10,
        marginBottom: 20,
        borderRadius: 5,
        color: '#fff',
        backgroundColor: '#121212',
        margin: 10,
    },
    text: {
        color: '#fff',
    },
    ListItem: {
        backgroundColor: '#121212',
    },
})

export default PointsScreen
