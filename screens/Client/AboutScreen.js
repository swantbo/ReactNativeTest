import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Linking, ActivityIndicator } from 'react-native';
import { Card, SocialIcon, Avatar, Image } from 'react-native-elements'
import * as firebase from 'firebase';
import { formatPhoneNumber } from '../../utils/DataFormatting';

const AboutScreen = ({ navigation }) => {
    const [barberData, setBarberData] = useState({'Tuesday': '', 'Wednesday': '', 'Thursday': '',  'Friday': '', 'Saturday': '', 'instagram': '', 'location': '', 'name': '', 'phone': '', 'price': '', 'website': '' });
    const [image, setImage] = useState(null)
    const [haircutPictures1, setHaircutPictures1] = useState(null)
    const [haircutPictures2, setHaircutPictures2] = useState(null)
    const [haircutPictures3, setHaircutPictures3] = useState(null)
    const [haircutPictures4, setHaircutPictures4] = useState(null)
    const [haircutPictures5, setHaircutPictures5] = useState(null)
    const [haircutPictures6, setHaircutPictures6] = useState(null)

    async function getBarberData() {
        await firebase.firestore().collection('Barber').doc('Nate').get().then((barber) => {
            setBarberData({...barberData, ...barber.data()})
            console.log('barber.data()', barber.data())
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
        <View style={{flex: .3}}>
            <Card containerStyle={{ flex: 1, margin: 0, backgroundColor: '#E8BD70', borderColor: '#000', alignItems: 'center' }}>
                <Card.Title style={{alignSelf: 'center', marginTop: 30}}>
                    <Avatar rounded size="large" title={'N'} source={{ uri: image }} />
                </Card.Title>
                <Card.Title>
                    Nate_Kuts
                </Card.Title>
            </Card>
        </View>
        <View style={styles.container}>
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
        fontSize: 16,
        fontWeight: 'normal',
        color: '#fff'
      }
});


export default AboutScreen