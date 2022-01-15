import React, {useEffect, useState} from 'react'
import {Linking, ActivityIndicator, View, Image, TouchableOpacity} from 'react-native'
import {Card, SocialIcon, PricingCard, ListItem} from 'react-native-elements'
import {Avatar, Center, VStack, Heading, HStack, Box, Text, ScrollView} from 'native-base'

import * as ImagePicker from 'expo-image-picker'
import {formatPhoneNumber} from '../../utils/DataFormatting'
import MapView from 'react-native-maps'

import Firebase from '../../config/firebase'
import createStyles from '../../styles/base'

import {connect} from 'react-redux'

function Home(props) {
	const [barber, setBarber] = useState({})
	const [image, setImage] = useState(null)
	const [haircutImages, setHaircutImages] = useState([])

	const pickImage = async (type, id) => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1
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
			? await Firebase.storage().ref('Barber/ProfilePicture').put(blob)
			: await Firebase.storage()
					.ref('Barber/HaircutPictures/' + id)
					.put(blob)
	}

	useEffect(() => {
		const {barber} = props
		setBarber(barber)

		async function getBarberImage() {
			await Firebase.storage()
				.ref('Barber/ProfilePicture')
				.getDownloadURL()
				.then((ProfileImage) => {
					setImage(ProfileImage)
				})
			const imageRefs = await Firebase.storage().ref('Barber/HaircutPictures/').listAll()
			const urls = await Promise.all(imageRefs.items.map((ref) => ref.getDownloadURL()))
			setHaircutImages(urls)
		}
		getBarberImage()
	}, [props])

	return (
		<VStack flex={1} bgColor={'#000'}>
			<VStack bg='#121212' borderBottomRadius={'25'} safeArea>
				<Center>
					<Avatar size='2xl' source={{uri: image}} onPress={() => pickImage('Profile')}></Avatar>
				</Center>
			</VStack>
			<ScrollView flex={1} bgColor={'#000'}>
				<Box>
					<Center m={'5'}>
						<Heading size={'lg'} color={'#E8BD70'} onPress={() => props.navigation.navigate('EditProfile')}>
							{barber?.name}
						</Heading>
						<Text fontSize={'md'} bold>
							{barber?.bio}
						</Text>
					</Center>
				</Box>
				<HStack bgColor={'#121212'} justifyContent={'space-between'} m={'2'} borderRadius={'10'}>
					<SocialIcon
						onPress={() => {
							props.navigation.navigate('Appointment')
						}}
						style={styles.socialIcons}
						iconType='MaterialCommunityIcons'
						type='calendar-today'
					/>
					<SocialIcon
						onPress={() =>
							Linking.openURL(`sms:${barber?.phone}`).catch(() => {
								Linking.openURL(`sms:${barber?.phone}`)
							})
						}
						style={styles.socialIcons}
						iconType='MaterialCommunityIcons'
						type='sms'
					/>
					<SocialIcon
						onPress={() =>
							Linking.openURL(`instagram://user?username=${barber?.instagram}`).catch(() => {
								Linking.openURL(`https://www.instagram.com/${barber?.instagram}`)
							})
						}
						style={styles.socialIcons}
						type='instagram'
					/>
					<SocialIcon
						onPress={() =>
							Linking.openURL(`${barber?.website}`).catch(() => {
								Linking.openURL(`https://${barber?.website}`)
							})
						}
						style={styles.socialIcons}
						type='google'
					/>
				</HStack>

				<VStack bgColor={'#121212'} m={'2'} p={'3'} borderRadius={'10'}>
					<Heading pb={'2'} color={'#E8BD70'} size={'sm'}>
						SERVICES & PRICING
					</Heading>
					<Box borderWidth={'1'} borderTopColor={'grey'} borderBottomColor={'grey'}>
						<HStack ml={'2'} mr={'2'} justifyContent={'space-between'}>
							<Text fontSize={'md'}>Men's Haircut</Text>
							<Text fontSize={'md'}>{barber?.price}</Text>
						</HStack>
						<Text ml={'2'} mr={'2'} fontSize={'sm'}>
							Full Haircut, Eyebrows, and Beard Trim
						</Text>
					</Box>
					<Box borderWidth={'1'} borderBottomColor={'grey'}>
						<HStack ml={'2'} mr={'2'} justifyContent={'space-between'}>
							<Text fontSize={'md'}>Kid's Haircut</Text>
							<Text fontSize={'md'}>{barber?.kidsHaircut}</Text>
						</HStack>
						<Text ml={'2'} mr={'2'} fontSize={'sm'}>
							Full Haircut, for Kid's
						</Text>
					</Box>
				</VStack>
				<HStack bgColor={'#121212'} m={'2'} p={'3'} borderRadius={'10'}>
					<VStack flex={'1'}>
						<Heading pb={'2'} color={'#E8BD70'} size={'sm'}>
							ADDRESS & HOURS
						</Heading>
						<Text fontSize={'sm'}>{barber?.location}</Text>
						<TouchableOpacity
							onPress={() =>
								Linking.openURL(`sms:${barber?.phone}`).catch(() => {
									Linking.openURL(`sms:${barber?.phone}`)
								})
							}>
							<Text fontSize={'sm'}>{barber?.phone != '' ? formatPhoneNumber(barber?.phone) : ''}</Text>
						</TouchableOpacity>
						<HStack>
							<Text fontSize={'sm'} bold>
								Tuesday
							</Text>
							<Text fontSize={'sm'}>{' ' + barber?.Tuesday}</Text>
						</HStack>
						<HStack>
							<Text fontSize={'sm'} bold>
								Wednesday
							</Text>
							<Text fontSize={'sm'}>{' ' + barber?.Wednesday}</Text>
						</HStack>
						<HStack>
							<Text fontSize={'sm'} bold>
								Thursday
							</Text>
							<Text fontSize={'sm'}>{' ' + barber?.Thursday}</Text>
						</HStack>
						<HStack>
							<Text fontSize={'sm'} bold>
								Friday
							</Text>
							<Text fontSize={'sm'}>{' ' + barber?.Friday}</Text>
						</HStack>
						<HStack>
							<Text fontSize={'sm'} bold>
								Saturday
							</Text>
							<Text fontSize={'sm'}>{' ' + barber?.Saturday}</Text>
						</HStack>
					</VStack>
					<MapView
						style={{width: '35%', height: '100%'}}
						region={{
							latitude: 43.0218740049977,
							longitude: -87.9119389619647,
							latitudeDelta: 0.005,
							longitudeDelta: 0.005
						}}
						pitchEnabled={false}
						rotateEnabled={false}
						scrollEnabled={false}
						zoomEnabled={false}
						onPress={() =>
							Linking.openURL('maps://app?saddr=&daddr=43.0218740049977+-87.9119389619647').catch(() => {
								Linking.openURL('google.navigation:q=43.0218740049977+-87.9119389619647')
							})
						}>
						<MapView.Marker coordinate={{latitude: 43.0218740049977, longitude: -87.9119389619647}} />
					</MapView>
				</HStack>
				<VStack bgColor={'#121212'} m={'2'} p={'3'} borderRadius={'10'}>
					<Heading pb={'2'} color={'#E8BD70'} size={'sm'}>
						Photos
					</Heading>
					<View style={styles.containerGallery}>
						<View style={styles.containerImage}>
							<Image style={styles.image} source={{uri: haircutImages[0]}} PlaceholderContent={<ActivityIndicator />} onPress={() => pickImage('Haircut', 1)} />
						</View>
						<View style={styles.containerImage}>
							<Image style={styles.image} source={{uri: haircutImages[1]}} PlaceholderContent={<ActivityIndicator />} onPress={() => pickImage('Haircut', 2)} />
						</View>
					</View>
					<View style={styles.containerGallery}>
						<View style={styles.containerImage}>
							<Image style={styles.image} source={{uri: haircutImages[2]}} PlaceholderContent={<ActivityIndicator />} onPress={() => pickImage('Haircut', 3)} />
						</View>
						<View style={styles.containerImage}>
							<Image style={styles.image} source={{uri: haircutImages[3]}} PlaceholderContent={<ActivityIndicator />} onPress={() => pickImage('Haircut', 4)} />
						</View>
					</View>
				</VStack>
			</ScrollView>
		</VStack>
	)
}

const styles = createStyles()

const mapStateToProps = (store) => ({
	barber: store.userState.barber
})

export default connect(mapStateToProps, null)(Home)
