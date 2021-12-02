import React from 'react'
import { View, StyleSheet, SafeAreaView } from 'react-native'
import { Card, Image } from 'react-native-elements'
import ImageViewer from 'react-native-image-zoom-viewer'

const ImageScreen = ({ route }) => {
    const { selectedImage } = route.params
    console.log('selectedImage', selectedImage)

    const images = [
        {
            url: selectedImage,
        },
    ]
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <ImageViewer imageUrls={images} renderIndicator={() => null} />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
})

export default ImageScreen
