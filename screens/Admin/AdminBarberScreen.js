import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Linking } from 'react-native';
import { Card, SocialIcon, Avatar, Image } from 'react-native-elements'
import * as firebase from 'firebase';
import { formatPhoneNumber } from '../../utils/DataFormatting';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const AdminBarberScreen = () => {
    const [barberData, setBarberData] = useState({'Tuesday': '', 'Wednesday': '', 'Thursday': '',  'Friday': '', 'Saturday': '', 'instagram': '', 'location': '', 'name': '', 'phone': '', 'price': '', 'website': '' });
    const [image, setImage] = useState(null)
    const [haircutPictures, setHaircutPictures] = useState(null)

    async function getBarberData() {
        await firebase.firestore().collection('Barber').doc('Nate').get().then((barber) => {
            setBarberData({...barberData, ...barber.data()})
            console.log('barber.data()', barber.data())
        })
    }

    const pickImage = async (type) => {
        let result = await ImagePicker.launchImageLibraryAsync({
           mediaTypes: ImagePicker.MediaTypeOptions.All,
           allowsEditing: true,
           aspect: [4, 3],
           quality: 1,
         });
      
         console.log(result);
      
         if (!result.cancelled && type === 'Profile') {
           setImage(result.uri);
         } if (!result.cancelled && !type === 'Profile') {
            setHaircutPictures(result.uri);
          }
         uploadImageAsync(result.uri, type)
         result = null
       }

    async function uploadImageAsync(uri, type) {
        const response = await fetch(uri);
        const blob = await response.blob()
        type === 'Profile' ? await firebase.storage().ref('Barber/ProfilePicture').put(blob) : await firebase.storage().ref('Barber/HaircutPictures/1').put(blob)
    }

    useEffect(() => {
        getBarberData();
        (async () => {
            if (Platform.OS !== 'web') {
              const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
              if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
              }
            }
          })()
      
          async function getBarberImage() {
            await firebase.storage().ref('Barber/ProfilePicture').getDownloadURL().then((ProfileImage) => {
              setImage(ProfileImage)
              console.log('NewImage', ProfileImage)
            })
            await firebase.storage().ref('Barber/HaircutPictures/1').getDownloadURL().then((image) => {
                setHaircutPictures(image)
                console.log('NewImage', image)
              })
          }
          getBarberImage()
        }, [])

    return(
        <View style={styles.container}>
            <Card containerStyle={{ flex: 1, margin: 0, backgroundColor: '#E8BD70', borderColor: '#000', alignItems: 'center'}}>
                <Card.Title style={{alignSelf: 'center', marginTop: 10}}><Avatar rounded size="large" title={'N'} source={{ uri: image }} />
                <MaterialCommunityIcons
                  name={'camera-plus'}
                  size={20}
                  color={'#000'}
                  onPress={() => pickImage('Profile')}
                />
                </Card.Title>
                    <Text style={styles.text}>Licensed Barber/Goat Studio</Text>
            </Card>
            <ScrollView>
                <View style={{flex: 1 }}>
                    <Card containerStyle={{ borderRadius: 5, backgroundColor: '#121212', borderColor: '#121212' }}>
                        <View style={{flex: 1}}>
                            <View style={{flex: 1, flexDirection: 'row' }}>
                                <View style={{flex: 1, alignItems: 'flex-start', paddingBottom: 15}}>
                                    <Card.Title style={{ fontSize: 15, textAlign:'left', color: '#E8BD70'}}> INFO </Card.Title>
                                        <Text style={styles.text}> Fast fades in no time. </Text>
                                        <Text style={styles.text}> {barberData.phone != '' ? formatPhoneNumber(barberData.phone) : ''} </Text>
                                </View>
                                        <SocialIcon
                                            onPress={() => Linking.openURL(`instagram://user?username=${barberData.instagram}`)
                                            .catch(() => {
                                            Linking.openURL(`https://www.instagram.com/${barberData.instagram}`);
                                            })}
                                            type='instagram'
                                        />
                                        <SocialIcon
                                            onPress={() => Linking.openURL(`${barberData.website}`)
                                            .catch(() => {
                                            Linking.openURL(`https://${barberData.website}`);
                                            })}
                                            type='google'
                                        />
                            </View>
                            <View style={{flex: 1.5, alignItems: 'flex-start' }}>

                                <Card.Title style={{ alignItems: 'flex-start', color: '#E8BD70'}}> ADDRESS & HOURS </Card.Title>
                                    <Text style={styles.text}> {barberData.location} </Text>
                                    <Text style={styles.text}> Tuesday: {barberData.Tuesday} </Text>
                                    <Text style={styles.text}> Wednesday: {barberData.Wednesday} </Text>
                                    <Text style={styles.text}> Thursday: {barberData.Thursday} </Text>
                                    <Text style={styles.text}> Friday: {barberData.Friday} </Text>
                                    <Text style={styles.text}> Saturday: {barberData.Saturday} </Text>
                            </View>
                        </View>
                    </Card>
                </View>
                <Card containerStyle={{ borderRadius: 5, backgroundColor: '#121212', borderColor: '#121212'}}>
                    <View style={{ flex: 1, flexDirection: 'row'}}>
                        <View style={{flex: 1, alignItems: 'center'}}>
                            <Card.Title style={{color: '#E8BD70', alignContent: 'center'}}> Photos </Card.Title>
                        </View>
                        <Card.Title style={{ alignContent: 'flex-end'}}>
                            <MaterialCommunityIcons
                                name={'camera-plus'}
                                size={20}
                                color={'#E8BD70'}
                                onPress={() => pickImage('Haircut')}
                            />
                        </Card.Title>
                    </View>
                        {/* <Image
                            style={{ flex: 1, width: 100, height: 100,
                                resizeMode: 'contain' }}
                            resizeMode="cover"
                            source={{ uri: haircutPictures }}
                        /> */}
                </Card>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000'
      },
      text: {
        fontSize: 16,
        fontWeight: 'normal',
        color: '#fff'
      }
});


export default AdminBarberScreen