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
import { MaterialCommunityIcons } from '@expo/vector-icons'

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

            <Card
                containerStyle={{
                    backgroundColor: '#E8BD70',
                    padding: 0,
                    margin: 0,
                    borderColor: '#E8BD70',
                }}
            >
                <Card.Title style={{ alignSelf: 'center' }}>
                    <Avatar
                        rounded
                        size='xlarge'
                        title={'N'}
                        source={{ uri: image }}
                    />
                </Card.Title>
            </Card>

            <View style={styles.container}>
                <ScrollView
                    style={{
                        backgroundColor: '#000',
                        borderTopLeftRadius: 15,
                        borderTopRightRadius: 15,
                    }}
                >
                    <View style={{}}>
                        <Card
                            containerStyle={{
                                borderRadius: 5,
                                backgroundColor: '#000',
                                borderColor: '#000',
                            }}
                        >
                            <Card.Title
                                style={{
                                    fontSize: 25,
                                    color: '#E8BD70',
                                }}
                            >
                                {barberData.name}
                            </Card.Title>
                            <View style={{ flex: 1 }}>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <View
                                        style={{
                                            flex: 1,
                                            alignItems: 'center',
                                            paddingBottom: 15,
                                        }}
                                    >
                                        <Text style={styles.text}>
                                            Fast fades in no time.
                                        </Text>
                                    </View>
                                </View>
                                <View
                                    style={{
                                        flex: 1,
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        backgroundColor: '#121212',
                                    }}
                                >
                                    <SocialIcon
                                        onPress={() => {
                                            navigation.navigate('Appointment')
                                        }}
                                        style={{
                                            backgroundColor: '#E8BD70',
                                        }}
                                        iconType='MaterialCommunityIcons'
                                        type='calendar-today'
                                    />
                                    <SocialIcon
                                        onPress={() =>
                                            Linking.openURL(
                                                `sms:${barberData?.phone}`
                                            ).catch(() => {
                                                Linking.openURL(
                                                    `sms:${barberData?.phone}`
                                                )
                                            })
                                        }
                                        style={{
                                            backgroundColor: '#E8BD70',
                                        }}
                                        iconType='MaterialCommunityIcons'
                                        type='sms'
                                    />
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
                                        style={{
                                            backgroundColor: '#E8BD70',
                                        }}
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
                                        style={{
                                            backgroundColor: '#E8BD70',
                                        }}
                                        type='google'
                                        title='test'
                                    />
                                </View>
                            </View>
                        </Card>
                        <Card
                            containerStyle={{
                                borderRadius: 5,
                                backgroundColor: '#121212',
                                borderColor: '#121212',
                            }}
                        >
                            <View style={{ flex: 1 }}>
                                <View style={{ flex: 1 }}>
                                    <Card.Title
                                        style={{
                                            alignSelf: 'flex-start',
                                            color: '#E8BD70',
                                        }}
                                    >
                                        ADDRESS & HOURS
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
                                                {barberData.location}
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
                                                        : ''}
                                                </Text>
                                            </TouchableOpacity>
                                            <Text></Text>
                                            <View
                                                style={{ flexDirection: 'row' }}
                                            >
                                                <Text style={styles.textTitle}>
                                                    Tuesday
                                                </Text>
                                                <Text style={styles.text}>
                                                    {' ' + barberData.Tuesday}
                                                </Text>
                                            </View>
                                            <View
                                                style={{ flexDirection: 'row' }}
                                            >
                                                <Text style={styles.textTitle}>
                                                    Wednesday
                                                </Text>
                                                <Text style={styles.text}>
                                                    {' ' + barberData.Wednesday}
                                                </Text>
                                            </View>
                                            <View
                                                style={{ flexDirection: 'row' }}
                                            >
                                                <Text style={styles.textTitle}>
                                                    Thursday
                                                </Text>
                                                <Text style={styles.text}>
                                                    {' ' + barberData.Thursday}
                                                </Text>
                                            </View>
                                            <View
                                                style={{ flexDirection: 'row' }}
                                            >
                                                <Text style={styles.textTitle}>
                                                    Friday
                                                </Text>
                                                <Text style={styles.text}>
                                                    {' ' + barberData.Friday}
                                                </Text>
                                            </View>
                                            <View
                                                style={{ flexDirection: 'row' }}
                                            >
                                                <Text style={styles.textTitle}>
                                                    Saturday
                                                </Text>
                                                <Text style={styles.text}>
                                                    {' ' + barberData.Saturday}
                                                </Text>
                                            </View>
                                        </View>
                                        <View
                                            style={{
                                                flex: 1,
                                                alignItems: 'flex-end',
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
                        <View style={{ flex: 1 }}>
                            <View style={{ flex: 1 }}>
                                <Card
                                    containerStyle={{
                                        borderRadius: 5,
                                        backgroundColor: '#121212',
                                        borderColor: '#121212',
                                        margin: 0,
                                    }}
                                >
                                    <Card.Title
                                        style={{
                                            color: '#E8BD70',
                                            fontSize: 18,
                                            alignSelf: 'flex-start',
                                        }}
                                    >
                                        Photos
                                    </Card.Title>
                                </Card>
                            </View>
                        </View>
                        <View style={{ flex: 1 }}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    margin: 20,
                                    justifyContent: 'space-between',
                                }}
                            >
                                <Image
                                    style={{
                                        flex: 1,
                                        width: 150,
                                        height: 150,
                                    }}
                                    source={{
                                        uri: haircutImages[0],
                                    }}
                                    onPress={() =>
                                        navigation.navigate('ViewImage', {
                                            selectedImage: haircutImages[0]
                                                ? haircutImages[0]
                                                : '',
                                        })
                                    }
                                    PlaceholderContent={<ActivityIndicator />}
                                />
                                <Image
                                    style={{
                                        flex: 1,
                                        width: 150,
                                        height: 150,
                                    }}
                                    source={{
                                        uri: haircutImages[1],
                                    }}
                                    onPress={() =>
                                        navigation.navigate('ViewImage', {
                                            selectedImage: haircutImages[1]
                                                ? haircutImages[1]
                                                : '',
                                        })
                                    }
                                    PlaceholderContent={<ActivityIndicator />}
                                />
                            </View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    margin: 20,
                                    justifyContent: 'space-between',
                                }}
                            >
                                <Image
                                    style={{
                                        flex: 1,
                                        width: 150,
                                        height: 150,
                                    }}
                                    source={{
                                        uri: haircutImages[2],
                                    }}
                                    onPress={() =>
                                        navigation.navigate('ViewImage', {
                                            selectedImage: haircutImages[2]
                                                ? haircutImages[2]
                                                : '',
                                        })
                                    }
                                    PlaceholderContent={<ActivityIndicator />}
                                />
                                <Image
                                    style={{
                                        flex: 1,
                                        width: 150,
                                        height: 150,
                                    }}
                                    source={{
                                        uri: haircutImages[3],
                                    }}
                                    onPress={() =>
                                        navigation.navigate('ViewImage', {
                                            selectedImage: haircutImages[3]
                                                ? haircutImages[3]
                                                : '',
                                        })
                                    }
                                    PlaceholderContent={<ActivityIndicator />}
                                />
                            </View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    margin: 20,
                                    justifyContent: 'space-between',
                                }}
                            >
                                <Image
                                    style={{
                                        flex: 1,
                                        width: 150,
                                        height: 150,
                                    }}
                                    source={{
                                        uri: haircutImages[4],
                                    }}
                                    onPress={() =>
                                        navigation.navigate('ViewImage', {
                                            selectedImage: haircutImages[4]
                                                ? haircutImages[4]
                                                : '',
                                        })
                                    }
                                    PlaceholderContent={<ActivityIndicator />}
                                />
                                <Image
                                    style={{
                                        flex: 1,
                                        width: 150,
                                        height: 150,
                                    }}
                                    source={{
                                        uri: haircutImages[5],
                                    }}
                                    onPress={() =>
                                        navigation.navigate('ViewImage', {
                                            selectedImage: haircutImages[5]
                                                ? haircutImages[5]
                                                : '',
                                        })
                                    }
                                    PlaceholderContent={<ActivityIndicator />}
                                />
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
        backgroundColor: '#E8BD70',
    },
    text: {
        fontSize: 13,
        fontWeight: 'normal',
        color: '#fff',
    },
    textTitle: {
        fontSize: 13,
        fontWeight: 'bold',
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
