import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Linking } from 'react-native';
import { Card, SocialIcon } from 'react-native-elements'
import * as firebase from 'firebase';
import { formatPhoneNumber } from '../../utils/DataFormatting';

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
            <Card containerStyle={{ flex: 1, margin: 0, backgroundColor: '#000', borderColor: '#000'}}>
                    <Text style={styles.text}>Licensed Barber/Goat Studio</Text>
            </Card>
            <ScrollView>
                <View style={{flex: 1 }}>
                    <Card containerStyle={{ borderRadius: 5, backgroundColor: '#121212', borderColor: '#121212' }}>
                        <View style={{flex: 1}}>
                            <View style={{flex: 1, flexDirection: 'row' }}>
                                <View style={{flex: 1, alignItems: 'flex-start', paddingBottom: 15}}>
                                    <Card.Title style={{ fontSize: 15, textAlign:'left', color: '#fff'}}> INFO </Card.Title>
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

                                <Card.Title style={{ alignItems: 'flex-start', color: '#fff'}}> ADDRESS & HOURS </Card.Title>
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
                <Card containerStyle={{ borderRadius: 5, backgroundColor: '#121212', borderColor: '#121212' }}>
                    <Card.Title style={styles.text}> Photos </Card.Title>
                        <Text style={styles.text}> Haircut Pictures </Text>
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


export default AboutScreen