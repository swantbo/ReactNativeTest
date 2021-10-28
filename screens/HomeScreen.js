import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Card, ListItem, PricingCard } from 'react-native-elements'
import * as firebase from 'firebase';
import { ScrollView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';

import { formatPhoneNumber } from '../utils/DataFormatting';

import { IconButton } from '../components';
import Firebase from '../config/firebase';
import { AuthenticatedUserContext } from '../navigation/AuthenticatedUserProvider';

const auth = Firebase.auth();

export default function HomeScreen() {
  const { user } = useContext(AuthenticatedUserContext);
  const [userTestData, setUserData] = useState({'email': '', 'name': '', 'phone': '', 'previous': '', 'time': '', 'upcoming': '', 'points': ''});
  const [barberData, setBarberData] = useState({'location': '', 'price': '', 'phone': ''})
  const [userAppointments, setUserAppointments] = useState({})

  const handleSignOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    async function getUserInfo(){
      try {
        await firebase
          .firestore()
          .collection('users')
          .doc(user.uid)
          .get().then((doc) => {
            setUserData({...userTestData, ...doc.data()})
            console.log('dataObj.firstName', userTestData)
        })
        await firebase.firestore().collection('Barber').doc('Nate').get().then((barber) => {
          setBarberData({...barberData, ...barber.data()})
        })
        await firebase
          .firestore()
          .collection('users')
          .doc(user.uid)
          .collection('Haircuts')
          .get()
          .then(snapshot => {
            let data = {}
            snapshot.forEach(doc => {
                let newdata = {
                    [doc.id]: doc.data().time
                }
                data =  {...data, ...newdata}
            });
            setUserAppointments(data)
            console.log('userAppointments', data)
        })
      } catch (err){
      Alert.alert('There is an error.', err.message)
      }
    }
    getUserInfo();
  }, [])

  return(
    <View style={styles.container}>
        <Card containerStyle={{ flex: 1, margin: 0}}>
            <Card.Title style={{ fontSize: 20}}> {userTestData.name} </Card.Title>
            <Card.Title style={{ fontSize: 15}}>Goat Points</Card.Title>
            <Card.Title style={{ fontSize: 15}}>{userTestData.points}</Card.Title>
        </Card>
        <View style={{flex: 3}}>
            { userAppointments ?  
                <>  
                <ScrollView>
                    <ListItem bottomDivider >
                        <ListItem.Content>
                            <ListItem.Title style={{ fontWeight: 'bold', alignSelf: 'center' }}><Text>Appointments</Text></ListItem.Title>
                        </ListItem.Content>
                    </ListItem>
                    {Object.entries(userAppointments).map((onekey, i) => (
                        <ListItem bottomDivider key={i}>
                            <ListItem.Content>
                                <View style={{flex: 1, flexDirection: 'row'}}>
                                    <View style={{flex: 2, alignItems: 'flex-start' }}>
                                        <ListItem.Title>{onekey[0]}, {onekey[1].toString().toLowerCase()}</ListItem.Title>
                                    </View>
                                    <View style={{flex: 1, alignItems: 'flex-end'}}>
                                        <ListItem.Title >{barberData.price != '' ? barberData.price : '' }</ListItem.Title>
                                    </View>
                                </View>
                                <View style={{flex: 1, flexDirection: 'row'}}>
                                    <View style={{flex: 1, alignItems: 'flex-start' }}>
                                        <Text>{barberData.location != '' ? barberData.location : ''} </Text>
                                    </View>
                                    <View style={{flex: 1, alignItems: 'flex-end'}}>
                                        <Text>{barberData.phone != '' ? formatPhoneNumber(barberData.phone) : ''} </Text>
                                    </View>
                                </View>
                            </ListItem.Content>
                        </ListItem>
                    ))}
                </ScrollView>
                </>
            :
            <ListItem bottomDivider >
                <ListItem.Content>
                    <ListItem.Title style={{ fontWeight: 'bold' }}><Text>No Appointments</Text></ListItem.Title>
                </ListItem.Content>
            </ListItem>
            }
        </View>
    </View>
)
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingTop: 50,
    paddingHorizontal: 12
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff'
  },
  text: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#fff'
  }
});