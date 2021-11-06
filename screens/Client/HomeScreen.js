import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, Image } from 'react-native';
import { Card, ListItem, PricingCard, Avatar } from 'react-native-elements'
import * as firebase from 'firebase';
import { ScrollView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import moment from 'moment';
import Colors from '../../constants/Colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Camera } from 'expo-camera';
//import ImagePicker from '../../components/ImagePicker'
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { formatPhoneNumber } from '../../utils/DataFormatting';

import { IconButton } from '../../components';
import Firebase from '../../config/firebase';
import { AuthenticatedUserContext } from '../../navigation/AuthenticatedUserProvider';

const auth = Firebase.auth();

export default function HomeScreen() {
  const { user } = useContext(AuthenticatedUserContext);
  const [userTestData, setUserData] = useState({'email': '', 'name': '', 'phone': '', 'previous': '', 'time': '', 'upcoming': '', 'points': ''});
  const [barberData, setBarberData] = useState({'location': '', 'price': '', 'phone': ''})
  const [userAppointments, setUserAppointments] = useState({})
  const [image, setImage] = useState(null);

  function subtractDiscount(goatPoints) {
    const discount = Number(barberData.price.replace(/[$.]+/g, '')) - Number(goatPoints)
    return (discount / 100).toFixed(2)
 }
 
 async function deleteAppointment(date, time) {
	if (date > moment().format('YYYY-MM-DD')) {
		await firebase.firestore()
			.collection('users')
			.doc(user.uid)
			.collection('Haircuts').doc(moment(date).format('YYYY-MM-DD')).delete().then(() => {
				Alert.alert('Success', 'Appointment Deleted')
				}).catch((e) => {
					Alert.alert('Error', `Unable to delete appointment. Try again. ${e}`)
				})
		await firebase.firestore()
			.collection('Calendar')
			.doc(moment(date).format('MMM YY'))
			.collection(moment(date).format('YYYY-MM-DD')).doc(time).delete().then(() => {
				}).catch((e) => {
					Alert.alert('Error', `Unable to delete appointment. Try again. ${e}`)
				})
		await firebase.firestore()
			.collection('user')
			.doc(user.uid)
			.collection('Haircuts').doc(moment(date).format('YYYY-MM-DD')).delete().then(() => {
				Alert.alert('Success', 'Appointment Deleted')
				}).catch((e) => {
					Alert.alert('Error', `Unable to delete appointment. Try again. ${e}`)
				})
	}
 }

 const pickImage = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
     mediaTypes: ImagePicker.MediaTypeOptions.All,
     allowsEditing: true,
     aspect: [4, 3],
     quality: 1,
   });

   console.log(result);

   if (!result.cancelled) {
     setImage(result.uri);
   }
   uploadImageAsync(result.uri)
 }


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
                    [doc.id]: doc.data(),
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
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })()

    async function getUserImage() {
      await firebase.storage().ref('Users/' + user.uid).getDownloadURL().then((image) => {
        setImage(image)
        console.log('NewImage', image)
      })
    }
    getUserImage()
  }, [])

  async function uploadImageAsync(uri) {
    const response = await fetch(uri);
    const blob = await response.blob()
    await firebase.storage().ref('Users/' + user.uid).put(blob)
  }

  return(
    <View style={styles.container}>
        <Card containerStyle={{flex: 1, margin: 0, backgroundColor: '#E8BD70', borderColor: '#000'}}>
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 1,}}>
              <Card.Title style={{alignSelf: 'flex-start'}}><Avatar rounded size="large" title={userTestData.name[0]} source={{ uri: image }} />
                <MaterialCommunityIcons
                  name={'camera-plus'}
                  size={20}
                  color={'#000'}
                  onPress={() => pickImage()}
                />
              </Card.Title>
            </View>
            <View style={{flex: 3, alignItems: 'center'}}>
              <Card.Title style={{ fontSize: 20, color: '#fff' }}> {userTestData.name} </Card.Title>
              <Card.Title style={{ fontSize: 15, color: '#fff' }}>Goat Points: {userTestData.points}</Card.Title>
            </View>
          </View>
        </Card>
        <View style={{flex: 4}}>
            { userAppointments ?  
                <>  
                <ScrollView>
                    <ListItem bottomDivider containerStyle={{ backgroundColor: '#000' }}>
                        <ListItem.Content>
                            <ListItem.Title style={{ fontWeight: 'bold', color: '#E8BD70' }}><Text>Appointments</Text></ListItem.Title>
                        </ListItem.Content>
                    </ListItem>
                    {Object.entries(userAppointments).map((onekey, i) => (
                        <ListItem bottomDivider key={i} onPress={() =>deleteAppointment(onekey[0], onekey[1].time)} containerStyle={{ backgroundColor: '#121212' }}>
                            <ListItem.Content>
                                <View style={{flex: 1, flexDirection: 'row'}}>
                                    <View style={{flex: 2, alignItems: 'flex-start' }}>
                                        <ListItem.Title style={{ color: '#fff'}}>{onekey[0]}, {onekey[1].time.toString().toLowerCase()}</ListItem.Title>
                                    </View>
                                    { onekey[1].points ?
                                      <>
                                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                          <ListItem.Title style={{ color: '#fff'}}>{onekey[1].points != '' ? '$' + subtractDiscount(onekey[1].points) : ''}</ListItem.Title>
                                        </View>
                                      </>
                                        :
                                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                          <ListItem.Title style={{ color: '#fff'}}>{barberData.price != '' ? barberData.price : ''}</ListItem.Title>
                                        </View>
                                    }
                                </View>
                                <View style={{flex: 1, flexDirection: 'row'}}>
                                    <View style={{flex: 1, alignItems: 'flex-start' }}>
                                        <Text style={{ color: '#fff'}}>{barberData.phone != '' ? formatPhoneNumber(barberData.phone) : ''} </Text>
                                    </View>
                                    <View style={{flex: 1, alignItems: 'flex-end'}}>
                                        <Text style={{ color: '#fff'}}>{onekey[1].points ? 'Goat Points: ' + onekey[1].points : 'Goat Points: 0'} </Text>
                                    </View>
                                </View>
                                <View style={{flex: 1, flexDirection: 'row'}}>
                                    <View style={{flex: 1, alignItems: 'flex-start' }}>
                                        <Text style={{ color: '#fff'}}>{barberData.location != '' ? barberData.location : ''} </Text>
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
    backgroundColor: '#000000'
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