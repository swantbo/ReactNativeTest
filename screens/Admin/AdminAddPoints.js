import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput, Alert } from 'react-native';
import { Card, ListItem } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import * as firebase from 'firebase';

import { AuthenticatedUserContext } from '../../navigation/AuthenticatedUserProvider'

const AdminAddPointsScreen = ({ route }) => {
    const { user } = useContext(AuthenticatedUserContext);
    const { name, userId, goatPoints } = route.params
    const [points, onChangePoints] = useState('')

    useEffect(() => {
    
    }, [])

    const addPointsToUser = async () => {
        const pointsTotal = Number(points) + Number(goatPoints)

        const newPoints = {
            points: pointsTotal.toString()
        }
        await firebase.firestore().collection('users').doc(userId).set( newPoints, {merge: true}).then(() => {
            Alert.alert('Points Added',`${name}, now has ${pointsTotal} Goat Points`,
            [
                {
                  text: "Okay"
                }
              ])
        })
    }

    return(
        <View style={styles.container}>
          <Card containerStyle={{ flex: 2, borderRadius: 15 }}>
                        <Card.Title style={{ fontSize: 15 }}>{name}</Card.Title>
                        <Card.Divider />
                        <Text>User's Current Goat Points: {goatPoints}</Text>
                        <Text>Enter the amount of points to add to the client</Text>
                        <TextInput
                            onChangeText={onChangePoints}
                            value={points}
                            placeholder="Add Goat Points" />
                        <Button onPress={() => addPointsToUser()} title='Add Points' />
                    </Card> 
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      justifyContent: 'center',
      alignContent: 'center',
      padding: 10
    },
    textInput: {
      borderWidth: 1,
      borderColor: 'grey',
      padding: 10,
      marginBottom: 20,
      borderRadius: 5,
  },
  });

export default AdminAddPointsScreen