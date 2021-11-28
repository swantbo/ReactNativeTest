import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Linking } from 'react-native';
import { Card, SocialIcon, Avatar, Image } from 'react-native-elements'
import { InputField } from '../../components';


const ModalGoatPointScreen = ({ route }) => {
    const { userGoatPoints } = route.params
    const [ goatPoints, setGoatPoints ] = useState('')
    const [ convertGoatPoints, setConvertGoatPoints ] = useState('0')
    const [ convertedGoatPoints, setConvertedGoatPoints ] = useState('0.00')

    function ConvertGoatPoints(changedGoatPoints) {
        setConvertGoatPoints(changedGoatPoints)
        const tempNum = (changedGoatPoints / 100).toFixed(2);
        setConvertedGoatPoints(tempNum)
    }
    
    useEffect(() => {
    	setGoatPoints(userGoatPoints)
  	}, [])

    return (
        <View style={styles.container}>
            <Card containerStyle={{ backgroundColor: '#121212', borderColor: '#121212'}}>
                <Card.Title style={styles.text}>Goat Points</Card.Title>
                <Card.Divider/>
                <View>
                    <Text style={styles.text}>Goat Points are a currency that can be used for Haircuts. When setting up an appointment you can use your Goat Points to get money off your haircut.</Text>
                    <Text style={styles.text}>To earn Goat Points talk to your Barber!</Text>
                </View>
            </Card>
            <Card containerStyle={{ backgroundColor: '#121212', borderColor: '#121212'}}>
                <Card.Title style={styles.text}>Goat Points Conversion</Card.Title>
                <Card.Divider/>
                <View style={{alignItems: 'center'}}>
                    <Text style={styles.text}>1 Goat Point is equal to 1 cent.</Text>
                    <Text style={styles.text}>Your {goatPoints} GP's = ${(goatPoints / 100).toFixed(2)}</Text>
                    <Text></Text>
                        <InputField
                            inputStyle={{
                            fontSize: 14,
                            }}
                            containerStyle={{
                            backgroundColor: '#fff',
                            marginBottom: 20,
                            borderColor: 'black', 
                            borderWidth: 1
                            }}
                            placeholder='Enter Goat Points'
                            value={convertGoatPoints}
                            onChangeText={text => ConvertGoatPoints(text)}
                        />
                        <InputField
                            inputStyle={{
                            fontSize: 14,
                            }}
                            containerStyle={{
                            backgroundColor: '#fff',
                            marginBottom: 20,
                            borderColor: 'black', 
                            borderWidth: 1
                            }}
                            placeholder='Convereted Goat Points'
                            value={'$' + convertedGoatPoints}
                        />
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