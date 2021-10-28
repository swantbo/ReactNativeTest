import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Linking } from 'react-native';
import { Card, SocialIcon } from 'react-native-elements'
import * as firebase from 'firebase';
import { formatPhoneNumber } from '../utils/DataFormatting';

const AboutScreen = () => {
    const [barberData, setBarberData] = useState({'Tuesday': '', 'Wednesday': '', 'Thursday': '',  'Friday': '', 'Saturday': '', 'instagram': '', 'location': '', 'name': '', 'phone': '', 'price': '', 'website': '' });

    async function getBarberData() {
        await firebase.firestore().collection('Barber').doc('Nate').get().then((barber) => {
            setBarberData({...barberData, ...barber.data()})
            console.log('barber.data()', barber.data())
        })
    }

    useEffect(() => {
        getBarberData()
        }, [])

    return(
        <View style={styles.container}>
            <Card containerStyle={{ flex: .5, margin: 0 }}>
                    <Text>Licensed Barber/Goat Studio</Text>
            </Card>
            <ScrollView>
                <Card containerStyle={{ flex: 2.5, borderRadius: 5 }}>
                    <Card.Title style={{ fontSize: 15, textAlign:'left'}}> INFO </Card.Title>
                        <View style={{flex: 1, flexDirection: 'row'}}>
                            <View style={{flex: 2}} >
                                <Text> Fast fades in no time. </Text>
                                <Text> {barberData.phone != '' ? formatPhoneNumber(barberData.phone) : ''} </Text>
                            </View>
                            <View style={{flex:1,  alignItems: 'flex-end' }}>
                                <SocialIcon
                                    onPress={() => Linking.openURL(`instagram://user?username=${barberData.instagram}`)
                                    .catch(() => {
                                    Linking.openURL(`https://www.instagram.com/${barberData.instagram}`);
                                    })}
                                    type='instagram'
                                />
                            </View>
                            <View style={{  alignItems: 'flex-end'}}>
                                <SocialIcon
                                    onPress={() => Linking.openURL(`${barberData.website}`)
                                    .catch(() => {
                                    Linking.openURL(`https://${barberData.website}`);
                                    })}
                                    type='google'
                                />
                            </View>
                        </View>
                        <Text></Text>
                    <Card.Title style={{ fontSize: 15, textAlign:'left'}}> ADDRESS & HOURS </Card.Title>
                        <Text> {barberData.location} </Text>
                        <Text> Tuesday: {barberData.Tuesday} </Text>
                        <Text> Wednesday: {barberData.Wednesday} </Text>
                        <Text> Thursday: {barberData.Thursday} </Text>
                        <Text> Friday: {barberData.Friday} </Text>
                        <Text> Saturday: {barberData.Saturday} </Text>
                </Card>
                <Card containerStyle={{ flex: 1, marginTop: 10 }}>
                    <Card.Title style={{ fontSize: 15, textAlign:'left', borderRadius: 5}}> Photos </Card.Title>
                        <Text> Haircut Pictures </Text>
                </Card>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
      color: 'white'
    }
});


export default AboutScreen