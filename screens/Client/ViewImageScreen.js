import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Linking } from 'react-native';
import { Card, SocialIcon, Avatar, Image } from 'react-native-elements'


const ViewImageScreen = ({ route }) => {
    const { selectedImage } = route.params

    console.log( 'selectedImage', selectedImage)

    return (
        <View style={styles.container}>
            <Image
                style={{ flex: 1, width: 150, height: 150,
                    resizeMode: 'contain' }}
                resizeMode="cover"
                source={{ uri: selectedImage }}
            />
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