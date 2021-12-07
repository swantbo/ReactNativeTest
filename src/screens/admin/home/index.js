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
import {
    Card,
    SocialIcon,
    Avatar,
    Image,
    PricingCard,
} from 'react-native-elements'
import * as firebase from 'firebase'
import * as ImagePicker from 'expo-image-picker'
import { formatPhoneNumber } from '../../../utils/DataFormatting'
import MapView from 'react-native-maps'
import { MaterialCommunityIcons } from '@expo/vector-icons'

const HomeScreen = ({ navigation }) => {
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
        kidsHaircut: '',
        bio: '',
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

    const pickImage = async (type, id) => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        })

        if (!result.cancelled && type === 'Profile') {
            setImage(result.uri)
        }
        if (!result.cancelled && !type === 'Profile') {
            setHaircutPictures(result.uri)
        }
        uploadImageAsync(result.uri, type, id)
        result = null
    }

    async function uploadImageAsync(uri, type, id) {
        const response = await fetch(uri)
        const blob = await response.blob()
        type === 'Profile'
            ? await firebase.storage().ref('Barber/ProfilePicture').put(blob)
            : await firebase
                  .storage()
                  .ref('Barber/HaircutPictures/' + id)
                  .put(blob)
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
                        onPress={() => pickImage('Profile')}
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
                        <View style={{ flex: 1 }}>
                            <Card
                                containerStyle={{
                                    borderRadius: 5,
                                    backgroundColor: '#000',
                                    borderColor: '#000',
                                    margin: 5,
                                    padding: 5,
                                }}
                            >
                                <Card.Title
                                    style={{
                                        fontSize: 30,
                                        color: '#E8BD70',
                                    }}
                                    onPress={() =>
                                        navigation.navigate('EditProfile')
                                    }
                                >
                                    {barberData.name}
                                </Card.Title>
                                <Card.Title style={{ color: '#fff' }}>
                                    {barberData.bio}
                                </Card.Title>
                            </Card>
                            <View
                                style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    margin: 0,
                                }}
                            >
                                <View style={{ flex: 1 }}>
                                    <PricingCard
                                        containerStyle={{
                                            backgroundColor: '#121212',
                                            margin: 0,
                                            borderColor: '#000',
                                            color: '#E8BD70',
                                        }}
                                        pricingStyle={{ color: '#fff' }}
                                        titleStyle={{ fontSize: 20 }}
                                        color='#E8BD70'
                                        title={"Men's Haircut"}
                                        price={
                                            <Card.Title
                                                style={{
                                                    fontSize: 20,
                                                    color: '#fff',
                                                }}
                                            >
                                                {barberData.price}
                                            </Card.Title>
                                        }
                                        info={[
                                            'Includes Haircut, Eyebrows and Beard trim',
                                        ]}
                                        button={{
                                            title: 'Schedule Now',
                                        }}
                                        onButtonPress={() => {}}
                                    />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <PricingCard
                                        containerStyle={{
                                            backgroundColor: '#121212',
                                            margin: 0,
                                            borderColor: '#000',
                                            color: '#E8BD70',
                                        }}
                                        pricingStyle={{ color: '#fff' }}
                                        titleStyle={{ fontSize: 20 }}
                                        color='#E8BD70'
                                        title={"Kids's Haircut"}
                                        price={
                                            <Card.Title
                                                style={{
                                                    fontSize: 20,
                                                    color: '#fff',
                                                }}
                                            >
                                                {barberData.kidsHaircut}
                                            </Card.Title>
                                        }
                                        info={[
                                            "Includes Full Haircut, for Kid's",
                                        ]}
                                        button={{
                                            title: 'Schedule Now',
                                        }}
                                        onButtonPress={() => {
                                            ''
                                        }}
                                    />
                                </View>
                            </View>
                            <View
                                style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    backgroundColor: '#121212',
                                    margin: 0,
                                    marginLeft: 15,
                                    marginRight: 15,
                                    padding: 5,
                                }}
                            >
                                <SocialIcon
                                    onPress={() => {
                                        ''
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
                                        padding: 0,
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
                                    margin: 10,
                                    justifyContent: 'space-between',
                                }}
                            >
                                <Image
                                    style={{
                                        flex: 1,
                                        width: 175,
                                        height: 175,
                                    }}
                                    source={{
                                        uri: haircutImages[0],
                                    }}
                                    onPress={() => pickImage('Haircut', 1)}
                                    PlaceholderContent={<ActivityIndicator />}
                                />
                                <Image
                                    style={{
                                        flex: 1,
                                        width: 175,
                                        height: 175,
                                    }}
                                    source={{
                                        uri: haircutImages[1],
                                    }}
                                    onPress={() => pickImage('Haircut', 2)}
                                    PlaceholderContent={<ActivityIndicator />}
                                />
                            </View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    margin: 10,
                                    justifyContent: 'space-between',
                                }}
                            >
                                <Image
                                    style={{
                                        flex: 1,
                                        width: 175,
                                        height: 175,
                                    }}
                                    source={{
                                        uri: haircutImages[2],
                                    }}
                                    onPress={() => pickImage('Haircut', 3)}
                                    PlaceholderContent={<ActivityIndicator />}
                                />
                                <Image
                                    style={{
                                        flex: 1,
                                        width: 175,
                                        height: 175,
                                    }}
                                    source={{
                                        uri: haircutImages[3],
                                    }}
                                    onPress={() => pickImage('Haircut', 4)}
                                    PlaceholderContent={<ActivityIndicator />}
                                />
                            </View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    margin: 10,
                                    justifyContent: 'space-between',
                                }}
                            >
                                <Image
                                    style={{
                                        flex: 1,
                                        width: 175,
                                        height: 175,
                                    }}
                                    source={{
                                        uri: haircutImages[4],
                                    }}
                                    onPress={() => pickImage('Haircut', 5)}
                                    PlaceholderContent={<ActivityIndicator />}
                                />
                                <Image
                                    style={{
                                        flex: 1,
                                        width: 175,
                                        height: 175,
                                    }}
                                    source={{
                                        uri: haircutImages[5],
                                    }}
                                    onPress={() => pickImage('Haircut', 6)}
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

export default HomeScreen
