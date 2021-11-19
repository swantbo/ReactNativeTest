import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Linking, ActivityIndicator, SafeAreaView, ImageBackground } from 'react-native';
import { Card, SocialIcon, Avatar, Image } from 'react-native-elements'
import * as firebase from 'firebase';
import { formatPhoneNumber } from '../../utils/DataFormatting';
import MapView from 'react-native-maps';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const AboutScreen = ({ navigation }) => {
    const [barberData, setBarberData] = useState({'Tuesday': '', 'Wednesday': '', 'Thursday': '',  'Friday': '', 'Saturday': '', 'instagram': '', 'location': '', 'name': '', 'phone': '', 'price': '', 'website': '' });
    const [image, setImage] = useState(null)
    const [haircutPictures1, setHaircutPictures1] = useState(null)
    const [haircutPictures2, setHaircutPictures2] = useState(null)
    const [haircutPictures3, setHaircutPictures3] = useState(null)
    const [haircutPictures4, setHaircutPictures4] = useState(null)
    const [haircutPictures5, setHaircutPictures5] = useState(null)
    const [haircutPictures6, setHaircutPictures6] = useState(null)
    const markers = [
        {
          latitude: 43.0218740049977,
          longitude: -87.9119389619647,
          title: 'Foo Place',
          subtitle: '1234 Foo Drive'
        }
      ];

    async function getBarberData() {
        await firebase.firestore().collection('Barber').doc('Nate').get().then((barber) => {
            setBarberData({...barberData, ...barber.data()})
        })
    }

    useEffect(() => {
        getBarberData()

        async function getBarberImage() {
            await firebase.storage().ref('Barber/ProfilePicture').getDownloadURL().then((ProfileImage) => {
                setImage(ProfileImage)
            })
            await firebase.storage().ref('Barber/HaircutPictures/1').getDownloadURL().then((image) => {
                setHaircutPictures1(image)
            })
            await firebase.storage().ref('Barber/HaircutPictures/2').getDownloadURL().then((image) => {
                setHaircutPictures2(image)
            })
            await firebase.storage().ref('Barber/HaircutPictures/3').getDownloadURL().then((image) => {
                setHaircutPictures3(image)
            })
            await firebase.storage().ref('Barber/HaircutPictures/4').getDownloadURL().then((image) => {
                setHaircutPictures4(image)
            })
            await firebase.storage().ref('Barber/HaircutPictures/5').getDownloadURL().then((image) => {
                setHaircutPictures5(image)
            })
            await firebase.storage().ref('Barber/HaircutPictures/6').getDownloadURL().then((image) => {
                setHaircutPictures6(image)
            })
          }

        getBarberImage()
        }, [])

    return(
        <>
        <SafeAreaView style={{ flex:0, backgroundColor: '#E8BD70', borderColor: '#E8BD70' }} />

        {/* <View style={{flex: .3, backgroundColor: '#E8BD70', borderColor: '#E8BD70'}}> */}
            <ImageBackground source={require('../../assets/6347257.png')} style={{flex: .3, backgroundColor: '#E8BD70'}} resizeMode='cover'> 
                {/* <Card containerStyle={{ flex: 1, margin: 0, backgroundColor: '#E8BD70', borderColor: '#E8BD70', alignItems: 'center' }}> */}
                    
                        <Card.Title style={{alignSelf: 'center'}}>
                            <Avatar rounded size="xlarge" title={'N'} source={{ uri: image }} />
                        </Card.Title>
                    
                {/* </Card> */}
            </ImageBackground>
        {/* </View> */}
        <View style={styles.container}>
            <ScrollView>
                <View style={{flex: 1 }}>
                    <Card containerStyle={{ borderRadius: 5, backgroundColor: '#121212', borderColor: '#121212' }}>
                        <View style={{flex: 1}}>
                            <View style={{flex: 1, flexDirection: 'row' }}>
                                <View style={{flex: 1, alignItems: 'flex-start', paddingBottom: 15}}>
                                    <Card.Title style={{ fontSize: 15, textAlign:'left', color: '#E8BD70'}}> INFO </Card.Title>
                                        <Text style={styles.text}> Fast fades in no time. </Text>
                                        <Text style={styles.text}> 
                                            {barberData.phone != '' ? formatPhoneNumber(barberData.phone) + '' : ''}
                                            <MaterialCommunityIcons
                                                style={{margin: 50}}
                                                name={'cellphone-message'}
                                                size={20}
                                                color={'#fff'}
                                                onPress={() => Linking.openURL("sms:123456789")
                                                    .catch(() => {
                                                        Linking.openURL("sms:123456789");
                                                })}
                                            />
                                        </Text>
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
                            <View style={{flex: 1 }}>

                                <Card.Title style={{ alignSelf: 'flex-start', color: '#E8BD70'}}> ADDRESS & HOURS </Card.Title>
                                <View style={{flex: 1, flexDirection: 'row'}}>
                                    <View style={{flex: 1.5, alignItems: 'flex-start'}}>
                                        <Text style={styles.text}> {barberData.location} </Text>
                                        <Text></Text>
                                        <Text style={styles.text}> Tuesday: {barberData.Tuesday} </Text>
                                        <Text style={styles.text}> Wednesday: {barberData.Wednesday} </Text>
                                        <Text style={styles.text}> Thursday: {barberData.Thursday} </Text>
                                        <Text style={styles.text}> Friday: {barberData.Friday} </Text>
                                        <Text style={styles.text}> Saturday: {barberData.Saturday} </Text>
                                    </View>
                                    <View style={{ flex: 1, alignItems: 'flex-end', backgroundColor: 'pink' }}>
                                        <MapView
                                            style={{ width: '100%', height: '100%'}}
                                            region={{latitude: 43.0218740049977,
                                                longitude: -87.9119389619647,
                                                latitudeDelta: 0.005,
                                                longitudeDelta: 0.005}}
                                            pitchEnabled={false}
                                            rotateEnabled={false}
                                            scrollEnabled={false}
                                            zoomEnabled={false}
                                            onPress={() => Linking.openURL('maps://app?saddr=&daddr=43.0218740049977+-87.9119389619647')
                                                .catch(() => {
                                                    Linking.openURL('google.navigation:q=43.0218740049977+-87.9119389619647')
                                                })}
                                        >
                                        <MapView.Marker
                                            coordinate={{latitude: 43.0218740049977,
                                            longitude: -87.9119389619647}}
                                        />
                                        </MapView>
                                    </View>
                                </View>
                                <Text></Text>
                                    
                            </View>
                        </View>
                    </Card>
                </View>
                <View style={{ flex: 1, margin: 15, borderRadius: 10, backgroundColor: '#121212', borderColor: '#121212'}}>
                    <View style={{ flex: 1, flexDirection: 'row'}}>
                        <View style={{flex: 1, alignItems: 'center', padding: 5 }}>
                            <Text style={{color: '#E8BD70', alignContent: 'center', fontWeight: 'bold', fontSize: 15}}> Photos </Text>
                        </View>
                    </View>
                    <View style={{flex: 1, flexDirection: 'row'}}>
                        <View style={{flex: 1, alignItems: 'flex-start', backgroundColor: '#121212' }}>
                            <Card containerStyle={{ backgroundColor: '#121212', borderColor: '#121212'}}>
                                <Image
                                    style={{ flex: 1, width: 150, height: 150,
                                        resizeMode: 'contain' }}
                                    resizeMode="cover"
                                    source={{ uri: haircutPictures1 }}
                                    onPress={() => navigation.navigate('ViewImage', {
                                        selectedImage: haircutPictures1
                                    })}
                                    PlaceholderContent={<ActivityIndicator />}
                                />
                                <Card.Title style={{color: '#fff'}}>Haircut 1</Card.Title>
                            </Card>
                        </View>
                        <View style={{flex: 1, alignItems: 'flex-end', backgroundColor: '#121212'}}>
                            <Card containerStyle={{ backgroundColor: '#121212', borderColor: '#121212'}}>
                                <Image
                                    style={{ flex: 1, width: 150, height: 150,
                                        resizeMode: 'contain' }}
                                    resizeMode="cover"
                                    source={{ uri: haircutPictures2 }}
                                    onPress={() => navigation.navigate('ViewImage', {
                                        selectedImage: haircutPictures2
                                    })}
                                    PlaceholderContent={<ActivityIndicator />}
                                />
                                <Card.Title style={{color: '#fff'}}>Haircut 2</Card.Title>
                            </Card>
                        </View>
                        
                    </View>
                    <View style={{flex: 1, flexDirection: 'row'}}>
                        <View style={{flex: 1, alignItems: 'flex-start', backgroundColor: '#121212' }}>
                            <Card containerStyle={{ backgroundColor: '#121212', borderColor: '#121212'}}>
                                <Image
                                    style={{ flex: 1, width: 150, height: 150,
                                        resizeMode: 'contain' }}
                                    resizeMode="cover"
                                    source={{ uri: haircutPictures3 }}
                                    onPress={() => navigation.navigate('ViewImage', {
                                        selectedImage: haircutPictures3
                                    })}
                                    PlaceholderContent={<ActivityIndicator />}
                                />
                                <Card.Title style={{color: '#fff'}}>Haircut 3</Card.Title>
                            </Card>
                        </View>
                        <View style={{flex: 1, alignItems: 'flex-end', backgroundColor: '#121212'}}>
                            <Card containerStyle={{ backgroundColor: '#121212', borderColor: '#121212'}}>
                                <Image
                                    style={{ flex: 1, width: 150, height: 150,
                                        resizeMode: 'contain' }}
                                    resizeMode="cover"
                                    source={{ uri: haircutPictures4 }}
                                    onPress={() => navigation.navigate('ViewImage', {
                                        selectedImage: haircutPictures4
                                    })}
                                    PlaceholderContent={<ActivityIndicator />}
                                />
                                <Card.Title style={{color: '#fff'}}>Haircut 4</Card.Title>
                            </Card>
                        </View>
                        
                    </View>
                    <View style={{flex: 1, flexDirection: 'row'}}>
                        <View style={{flex: 1, alignItems: 'flex-start', backgroundColor: '#121212' }}>
                            <Card containerStyle={{ backgroundColor: '#121212', borderColor: '#121212'}}>
                                <Image
                                    style={{ flex: 1, width: 150, height: 150,
                                        resizeMode: 'contain' }}
                                    resizeMode="cover"
                                    source={{ uri: haircutPictures5 }}
                                    onPress={() => navigation.navigate('ViewImage', {
                                        selectedImage: haircutPictures5
                                    })}
                                    PlaceholderContent={<ActivityIndicator />}
                                />
                                <Card.Title style={{color: '#fff'}}>Haircut 5</Card.Title>
                            </Card>
                        </View>
                        <View style={{flex: 1, alignItems: 'flex-end', backgroundColor: '#121212'}}>
                            <Card containerStyle={{ backgroundColor: '#121212', borderColor: '#121212'}}>
                                <Image
                                    style={{ flex: 1, width: 150, height: 150,
                                        resizeMode: 'contain' }}
                                    resizeMode="cover"
                                    source={{ uri: haircutPictures6 }}
                                    onPress={() => navigation.navigate('ViewImage', {
                                        selectedImage: haircutPictures6
                                    })}
                                    PlaceholderContent={<ActivityIndicator />}
                                />
                                <Card.Title style={{color: '#fff'}}>Haircut 6</Card.Title>
                            </Card>
                        </View>
                        
                    </View>
                </View>
            </ScrollView>
        </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000'
      },
      text: {
        fontSize: 13,
        fontWeight: 'normal',
        color: '#fff'
      },
    image: {
        width: '100%',
        height: '100%',
        opacity:0.5,
        resizeMode: 'cover'
    }
});


export default AboutScreen