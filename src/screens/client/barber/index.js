import React, { useEffect, useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Linking,
    ActivityIndicator,
    SafeAreaView,
    ImageBackground,
    TouchableOpacity,
} from 'react-native'
import { Card, SocialIcon, Avatar, Image } from 'react-native-elements'
import * as firebase from 'firebase'
import { formatPhoneNumber } from '../../../utils/DataFormatting'
import MapView from 'react-native-maps'

const BarberScreen = ({ navigation }) => {
    const [barberData, setBarberData] = useState({
        Tuesday: '',
        Wednesday: '',
        Thursday: '',
        Friday: '',
        Saturday: '',
        instagram: '',
        location: '',
        name: '',
        phone: '',
        price: '',
        website: '',
    })
    const [image, setImage] = useState(null)
    const [haircutImages, setHaircutImages] = useState([])

    async function getBarberData() {
        await firebase
            .firestore()
            .collection('Barber')
            .doc('Nate')
            .get()
            .then((barber) => {
                setBarberData({ ...barberData, ...barber.data() })
            })
    }

    useEffect(() => {
        getBarberData()

        async function getBarberImage() {
            await firebase
                .storage()
                .ref('Barber/ProfilePicture')
                .getDownloadURL()
                .then((ProfileImage) => {
                    setImage(ProfileImage)
                })
            const imageRefs = await firebase
                .storage()
                .ref('Barber/HaircutPictures/')
                .listAll()
            const urls = await Promise.all(
                imageRefs.items.map((ref) => ref.getDownloadURL())
            )
            setHaircutImages(urls)
        }

        getBarberImage()
    }, [])

    return (
        <>
            <SafeAreaView
                style={{
                    flex: 0,
                    backgroundColor: '#E8BD70',
                    borderColor: '#E8BD70',
                }}
            />

            <ImageBackground
                source={require('../../../assets/6347257.png')}
                style={{ flex: 0.3, backgroundColor: '#E8BD70' }}
                resizeMode='cover'
            >
                <Card.Title style={{ alignSelf: 'center' }}>
                    <Avatar
                        rounded
                        size='xlarge'
                        title={'N'}
                        source={{ uri: image }}
                    />
                </Card.Title>
            </ImageBackground>

            <View style={styles.container}>
                <ScrollView>
                    <View style={{ flex: 1 }}>
                        <Card
                            containerStyle={{
                                borderRadius: 5,
                                backgroundColor: '#121212',
                                borderColor: '#121212',
                            }}
                        >
                            <View style={{ flex: 1 }}>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <View
                                        style={{
                                            flex: 1,
                                            alignItems: 'flex-start',
                                            paddingBottom: 15,
                                        }}
                                    >
                                        <Card.Title
                                            style={{
                                                fontSize: 15,
                                                textAlign: 'left',
                                                color: '#E8BD70',
                                            }}
                                        >
                                            {' '}
                                            INFO{' '}
                                        </Card.Title>
                                        <Text style={styles.text}>
                                            {' '}
                                            Fast fades in no time.{' '}
                                        </Text>
                                        <TouchableOpacity
                                            onPress={() =>
                                                Linking.openURL(
                                                    `sms:${barberData?.phone}`
                                                ).catch(() => {
                                                    Linking.openURL(
                                                        `sms:${barberData?.phone}`
                                                    )
                                                })
                                            }
                                        >
                                            <Text style={styles.text}>
                                                {barberData.phone != ''
                                                    ? formatPhoneNumber(
                                                          barberData.phone
                                                      )
                                                    : ''}{' '}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    <SocialIcon
                                        onPress={() =>
                                            Linking.openURL(
                                                `instagram://user?username=${barberData.instagram}`
                                            ).catch(() => {
                                                Linking.openURL(
                                                    `https://www.instagram.com/${barberData.instagram}`
                                                )
                                            })
                                        }
                                        type='instagram'
                                    />
                                    <SocialIcon
                                        onPress={() =>
                                            Linking.openURL(
                                                `${barberData.website}`
                                            ).catch(() => {
                                                Linking.openURL(
                                                    `https://${barberData.website}`
                                                )
                                            })
                                        }
                                        type='google'
                                    />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Card.Title
                                        style={{
                                            alignSelf: 'flex-start',
                                            color: '#E8BD70',
                                        }}
                                    >
                                        {' '}
                                        ADDRESS & HOURS{' '}
                                    </Card.Title>
                                    <View
                                        style={{
                                            flex: 1,
                                            flexDirection: 'row',
                                        }}
                                    >
                                        <View
                                            style={{
                                                flex: 1.5,
                                                alignItems: 'flex-start',
                                            }}
                                        >
                                            <Text style={styles.text}>
                                                {' '}
                                                {barberData.location}{' '}
                                            </Text>
                                            <Text></Text>
                                            <Text style={styles.text}>
                                                {' '}
                                                Tuesday: {
                                                    barberData.Tuesday
                                                }{' '}
                                            </Text>
                                            <Text style={styles.text}>
                                                {' '}
                                                Wednesday:{' '}
                                                {barberData.Wednesday}{' '}
                                            </Text>
                                            <Text style={styles.text}>
                                                {' '}
                                                Thursday: {
                                                    barberData.Thursday
                                                }{' '}
                                            </Text>
                                            <Text style={styles.text}>
                                                {' '}
                                                Friday: {barberData.Friday}{' '}
                                            </Text>
                                            <Text style={styles.text}>
                                                {' '}
                                                Saturday: {
                                                    barberData.Saturday
                                                }{' '}
                                            </Text>
                                        </View>
                                        <View
                                            style={{
                                                flex: 1,
                                                alignItems: 'flex-end',
                                                backgroundColor: 'pink',
                                            }}
                                        >
                                            <MapView
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                }}
                                                region={{
                                                    latitude: 43.0218740049977,
                                                    longitude:
                                                        -87.9119389619647,
                                                    latitudeDelta: 0.005,
                                                    longitudeDelta: 0.005,
                                                }}
                                                pitchEnabled={false}
                                                rotateEnabled={false}
                                                scrollEnabled={false}
                                                zoomEnabled={false}
                                                onPress={() =>
                                                    Linking.openURL(
                                                        'maps://app?saddr=&daddr=43.0218740049977+-87.9119389619647'
                                                    ).catch(() => {
                                                        Linking.openURL(
                                                            'google.navigation:q=43.0218740049977+-87.9119389619647'
                                                        )
                                                    })
                                                }
                                            >
                                                <MapView.Marker
                                                    coordinate={{
                                                        latitude: 43.0218740049977,
                                                        longitude:
                                                            -87.9119389619647,
                                                    }}
                                                />
                                            </MapView>
                                        </View>
                                    </View>
                                    <Text></Text>
                                </View>
                            </View>
                        </Card>
                    </View>
                    <View
                        style={{
                            flex: 1,
                            margin: 15,
                            borderRadius: 10,
                            backgroundColor: '#121212',
                            borderColor: '#121212',
                        }}
                    >
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View
                                style={{
                                    flex: 1,
                                    alignItems: 'center',
                                    padding: 5,
                                }}
                            >
                                <Text
                                    style={{
                                        color: '#E8BD70',
                                        alignContent: 'center',
                                        fontWeight: 'bold',
                                        fontSize: 15,
                                    }}
                                >
                                    {' '}
                                    Photos{' '}
                                </Text>
                            </View>
                        </View>
                        <View style={{ flex: 1 }}>
                            {haircutImages.map((onekey, index) => (
                                <View
                                    style={{
                                        flex: 1,
                                        alignItems: 'center',
                                        backgroundColor: '#121212',
                                    }}
                                >
                                    <Card
                                        containerStyle={{
                                            backgroundColor: '#121212',
                                            borderColor: '#121212',
                                        }}
                                    >
                                        <Image
                                            style={{
                                                flex: 1,
                                                width: 200,
                                                height: 200,
                                            }}
                                            resizeMode='contain'
                                            source={{
                                                uri: onekey ? onekey : '',
                                            }}
                                            onPress={() =>
                                                navigation.navigate(
                                                    'ViewImage',
                                                    {
                                                        selectedImage: onekey
                                                            ? onekey
                                                            : '',
                                                    }
                                                )
                                            }
                                            PlaceholderContent={
                                                <ActivityIndicator />
                                            }
                                        />
                                    </Card>
                                </View>
                            ))}
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
        backgroundColor: '#000000',
    },
    text: {
        fontSize: 13,
        fontWeight: 'normal',
        color: '#fff',
    },
    image: {
        width: '100%',
        height: '100%',
        opacity: 0.5,
        resizeMode: 'cover',
    },
})

export default BarberScreen
