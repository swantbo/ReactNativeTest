import React, { useEffect, useState } from 'react'
import { Platform } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'

export default function TabTwoScreen() {
    const [image, setImage] = useState(null)

    useEffect(() => {
        ;(async () => {
            if (Platform.OS !== 'web') {
                const { status } =
                    await ImagePicker.requestMediaLibraryPermissionsAsync()
                if (status !== 'granted') {
                    alert(
                        'Sorry, we need camera roll permissions to make this work!'
                    )
                }
            }
        })()
    }, [])

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        })

        if (!result.cancelled) {
            setImage(result.uri)
        }
    }

    return (
        <MaterialCommunityIcons
            style={{ alignSelf: 'center' }}
            name={'camera-plus'}
            size={20}
            color={'#000'}
            onPress={() => pickImage()}
        />
        // {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
    )
}
