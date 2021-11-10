import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Linking } from 'react-native';
import { Card, SocialIcon, Avatar, Image } from 'react-native-elements'


const ViewImageScreen = ({ route }) => {
    const { selectedImage } = route.params

    console.log( 'selectedImage', selectedImage)

    return (
        <View style={styles.container}>
            <Card containerStyle={{ flex: 1, backgroundColor: '#121212', borderColor: '#121212'}}>
                <Card.Title style={styles.text}>Image Title</Card.Title>
                <Card.Divider/>
                <View>
                    <Image
                        style={{ width: '100%', height: '75%', marginBottom: 10 }}
                        source={{ uri: selectedImage }}
                        resizeMode={'contain'}
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

export default ViewImageScreen