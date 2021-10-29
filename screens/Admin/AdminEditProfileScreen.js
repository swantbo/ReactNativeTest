import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput, Alert, ActivityIndicator } from 'react-native';
import { ListItem } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';

import * as firebase from 'firebase';

const AdminEditProfileScreen = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [barberProfile, setBarberProfile] = useState({'name': '', 'Tuesday': '', 'Wednesday': '', 'Thursday': '', 'Friday': '', 'Saturday': '', 'instagram': '', 'location': '', 'phone': '', 'price': '', 'website': '' })
    const [changeData, setChangeData] = useState('')
    const [barberDataType, setBarberDataType] = useState('')
    const [newBarberData, setNewBarberData] = useState('')

      const getBarberProfil = async () => {
        const data = await firebase.firestore()
        .collection('Barber')
        .doc('Nate')
        .get()
        setBarberProfile({...barberProfile, ...data.data()})
        setIsLoading(false)
      }

      const changeBarberData = (value, type) => {
        setChangeData(value.toString()),
        setBarberDataType(type.toLowerCase())
      }

      const setBarberData = () => {
        const barberData = {
            [barberDataType]: newBarberData
        }
        firebase.firestore()
        .collection('Barber')
        .doc('Nate')
        .set(barberData, {merge: true})
        .then(() => {
          Alert.alert('Success', 'Data has been changed')
        })
        .catch((error) => {
          alert('Something went wrong try again')
      }); 
      }

      useEffect(() => {
        getBarberProfil()
      }, [])

    return(
        <View style={styles.container}>
          <ScrollView>
            { changeData != '' ?
                <View>
                <><TextInput
                    placeholder={changeData.toString()}
                    onChangeText={setNewBarberData}
                    value={newBarberData}
                    style={styles.textInput} />
                    <Button title={`Change ${barberDataType}: ${changeData}`} onPress={() => setBarberData()}/>
                </>
            </View>
            : <Text></Text>
            } 
            { barberProfile && !isLoading ?
              <>
                <ListItem bottomDivider >
                  <ListItem.Content>
                      <ListItem.Title style={{fontWeight: 'bold'}}>Info</ListItem.Title>
                  </ListItem.Content>
                </ListItem>
                <ListItem bottomDivider onPress={() => changeBarberData(barberProfile.price, 'price')} >
                  <ListItem.Content>
                      <ListItem.Title>Price: {barberProfile.price} </ListItem.Title>
                  </ListItem.Content>
                </ListItem>
                <ListItem bottomDivider onPress={() => changeBarberData(barberProfile.website, 'website')} >
                  <ListItem.Content>
                      <ListItem.Title>Website: {barberProfile.website} </ListItem.Title>
                  </ListItem.Content>
                </ListItem>
                <ListItem bottomDivider onPress={() => changeBarberData(barberProfile.instagram, 'instagram')} >
                  <ListItem.Content>
                      <ListItem.Title>Instagram: {barberProfile.instagram} </ListItem.Title>
                  </ListItem.Content>
                </ListItem>
                <ListItem bottomDivider onPress={() => changeBarberData(barberProfile.phone, 'phone')} >
                  <ListItem.Content>
                      <ListItem.Title>Phone: {barberProfile.phone} </ListItem.Title>
                  </ListItem.Content>
                </ListItem>
                <ListItem bottomDivider >
                  <ListItem.Content>
                      <ListItem.Title style={{fontWeight: 'bold'}}>Address and Location</ListItem.Title>
                  </ListItem.Content>
                </ListItem>
                <ListItem bottomDivider onPress={() => changeBarberData(barberProfile.location, 'location')} >
                  <ListItem.Content>
                      <ListItem.Title>Address: {barberProfile.location} </ListItem.Title>
                  </ListItem.Content>
                </ListItem>
                <ListItem bottomDivider onPress={() => changeBarberData(barberProfile.Tuesday, 'Tuesday')} >
                    <ListItem.Content>
                        <ListItem.Title>Tuesday: {barberProfile.Tuesday} </ListItem.Title>
                    </ListItem.Content>
                </ListItem>
                <ListItem bottomDivider onPress={() => changeBarberData(barberProfile.Wednesday, 'Wednesday')} >
                  <ListItem.Content>
                      <ListItem.Title>Wednesday: {barberProfile.Wednesday} </ListItem.Title>
                  </ListItem.Content>
                </ListItem>
                <ListItem bottomDivider onPress={() => changeBarberData(barberProfile.Thursday, 'Thursday')} >
                  <ListItem.Content>
                      <ListItem.Title>Thursday: {barberProfile.Thursday} </ListItem.Title>
                  </ListItem.Content>
                </ListItem>
                <ListItem bottomDivider onPress={() => changeBarberData(barberProfile.Friday, 'Friday')} >
                  <ListItem.Content>
                      <ListItem.Title>Friday: {barberProfile.Friday} </ListItem.Title>
                  </ListItem.Content>
                </ListItem>
                <ListItem bottomDivider onPress={() => changeBarberData(barberProfile.Saturday, 'Saturday')} >
                  <ListItem.Content>
                      <ListItem.Title>Saturday: {barberProfile.Saturday} </ListItem.Title>
                  </ListItem.Content>
                </ListItem>
              </>
              : 
              <ActivityIndicator color='#000' size='large'/>
            }
            </ScrollView>
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

export default AdminEditProfileScreen