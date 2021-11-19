import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Linking } from 'react-native';
import { Card, SocialIcon, Avatar, Image } from 'react-native-elements'


const ModalGoatPointScreen = () => {
    
    return (
        <View style={styles.container}>
            <Card containerStyle={{ flex: 1, backgroundColor: '#121212', borderColor: '#121212'}}>
                <Card.Title style={styles.text}>Goat Points</Card.Title>
                <Card.Divider/>
                <View>
                    <Text>Goat Points are a currency that can be used for Haircuts</Text>
                    <Text>1 Goat Point is equal to 1 cent</Text>
                    <Text>So 500 Goat Points is $5.00</Text>
                    <Text>When setting up an appointment you can use your Goat Points to get money off your haircut</Text>
                    <Text>To earn Goat Points talk to your Barber!</Text>
                </View>
            </Card>
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

export default ModalGoatPointScreen