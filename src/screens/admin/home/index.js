import React, {useEffect, useState} from 'react'
import {View, Text, StyleSheet, ScrollView, Linking, ActivityIndicator, SafeAreaView, ImageBackground, TouchableOpacity} from 'react-native'
import {Card, SocialIcon, Avatar, Image, PricingCard} from 'react-native-elements'
import * as firebase from 'firebase'
import * as ImagePicker from 'expo-image-picker'
import {formatPhoneNumber} from '../../../utils/DataFormatting'
import MapView from 'react-native-maps'

import createStyles from '../../../styles/base'

import {connect} from 'react-redux'

function HomeScreen(props) {
	const [barber, setBarber] = useState({})
	const [image, setImage] = useState(null)
	const [haircutImages, setHaircutImages] = useState([])

	async function getBarberData() {
		await firebase
			.firestore()
			.collection('Barber')
			.doc('Nate')
			.get()
			.then((barber) => {
				//setBarberData({...barberData, ...barber.data()})
			})
	}

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

	// async function uploadImageAsync(uri, type, id) {
	//     const response = await fetch(uri)
	//     const blob = await response.blob()
	//     type === 'Profile'
	//         ? await firebase.storage().ref('Barber/ProfilePicture').put(blob)
	//         : await firebase
	//               .storage()
	//               .ref('Barber/HaircutPictures/' + id)
	//               .put(blob)
	// }

	useEffect(() => {
		const {currentUser, barber} = props
		setBarber(barber)
		console.log('props', props)
		getBarberData()

		async function getBarberImage() {
			// await firebase
			//     .storage()
			//     .ref('Barber/ProfilePicture')
			//     .getDownloadURL()
			//     .then((ProfileImage) => {
			//         setImage(ProfileImage)
			//     })
			// const imageRefs = await firebase
			//     .storage()
			//     .ref('Barber/HaircutPictures/')
			//     .listAll()
			// const urls = await Promise.all(
			//     imageRefs.items.map((ref) => ref.getDownloadURL())
			// )
			const urls = []
			setHaircutImages(urls)
		}

		getBarberImage()
	}, [props])

	return (
		<>
			<SafeAreaView style={styles.cardHeader} />

			<Card containerStyle={styles.cardGold}>
				<Card.Title style={{alignSelf: 'center'}}>
					<Avatar containerStyle={styles.avatarBackground} rounded size='xlarge' title={'N'} source={{uri: image}} onPress={() => pickImage('Profile')} />
				</Card.Title>
			</Card>

			<View style={styles.container}>
				<ScrollView style={styles.scrollView}>
					<Card containerStyle={styles.cardBio}>
						<Card.Title style={styles.cardTitle} onPress={() => props.navigation.navigate('EditProfile')}>
							{barber.name}
						</Card.Title>
						<Card.Title style={styles.listItemSubTitle}>{barber.bio}</Card.Title>
					</Card>
					<View style={styles.row}>
						<View style={{flex: 1}}>
							<PricingCard
								containerStyle={styles.pricingCard}
								pricingStyle={styles.listItemSubTitle}
								color='#E8BD70'
								title={<Card.Title style={styles.cardTitle}>Men's Haircut</Card.Title>}
								price={<Card.Title style={styles.barberPricing}>{barber.price}</Card.Title>}
								info={['Includes Haircut, Eyebrows and Beard trim']}
								button={{
									title: 'Schedule Now'
								}}
								onButtonPress={() => {
									props.navigation.navigate('Appointment')
								}}
							/>
						</View>
						<View style={{flex: 1}}>
							<PricingCard
								containerStyle={styles.pricingCard}
								pricingStyle={styles.listItemSubTitle}
								color='#E8BD70'
								title={<Card.Title style={styles.cardTitle}>Kid's Haircut</Card.Title>}
								price={<Card.Title style={styles.barberPricing}>{barber.kidsHaircut}</Card.Title>}
								info={["Includes Full Haircut, for Kid's"]}
								button={{
									title: 'Schedule Now'
								}}
								onButtonPress={() => {
									props.navigation.navigate('Appointment')
								}}
							/>
						</View>
					</View>
					<View style={styles.barberSocialIcons}>
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
								Linking.openURL(`instagram://user?username=${barber.instagram}`).catch(() => {
									Linking.openURL(`https://www.instagram.com/${barber.instagram}`)
								})
							}
							style={styles.socialIcons}
							type='instagram'
						/>
						<SocialIcon
							onPress={() =>
								Linking.openURL(`${barber.website}`).catch(() => {
									Linking.openURL(`https://${barber.website}`)
								})
							}
							style={styles.socialIcons}
							type='google'
							title='test'
						/>
					</View>

					<Card containerStyle={styles.barberAddress}>
						<Card.Title style={styles.barberInfoTitles}>ADDRESS & HOURS</Card.Title>
						<View style={styles.row}>
							<View style={styles.rowStart}>
								<Text style={styles.addressText}>{barber.location}</Text>
								<TouchableOpacity
									onPress={() =>
										Linking.openURL(`sms:${barber?.phone}`).catch(() => {
											Linking.openURL(`sms:${barber?.phone}`)
										})
									}>
									<Text style={styles.addressText}>{barber.phone != '' ? formatPhoneNumber(barber.phone) : ''}</Text>
								</TouchableOpacity>
								<Text></Text>
								<View style={styles.row}>
									<Text style={styles.addressTitle}>Tuesday</Text>
									<Text style={styles.addressText}>{' ' + barber.Tuesday}</Text>
								</View>
								<View style={styles.row}>
									<Text style={styles.addressTitle}>Wednesday</Text>
									<Text style={styles.addressText}>{' ' + barber.Wednesday}</Text>
								</View>
								<View style={styles.row}>
									<Text style={styles.addressTitle}>Thursday</Text>
									<Text style={styles.addressText}>{' ' + barber.Thursday}</Text>
								</View>
								<View style={styles.row}>
									<Text style={styles.addressTitle}>Friday</Text>
									<Text style={styles.addressText}>{' ' + barber.Friday}</Text>
								</View>
								<View style={styles.row}>
									<Text style={styles.addressTitle}>Saturday</Text>
									<Text style={styles.addressText}>{' ' + barber.Saturday}</Text>
								</View>
							</View>
							<View style={styles.rowEnd}>
								<MapView
									style={{width: '100%', height: '100%'}}
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
							</View>
						</View>
					</Card>

					<Card containerStyle={styles.barberAddress}>
						<Card.Title style={styles.barberInfoTitles}>Photos</Card.Title>
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
						<View style={styles.containerGallery}>
							<View style={styles.containerImage}>
								<Image style={styles.image} source={{uri: haircutImages[4]}} PlaceholderContent={<ActivityIndicator />} onPress={() => pickImage('Haircut', 5)} />
							</View>
							<View style={styles.containerImage}>
								<Image style={styles.image} source={{uri: haircutImages[5]}} PlaceholderContent={<ActivityIndicator />} onPress={() => pickImage('Haircut', 6)} />
							</View>
						</View>
					</Card>
				</ScrollView>
			</View>
		</>
	)
}

const styles = createStyles()

const mapStateToProps = (store) => ({
	currentUser: store.userState.currentUser,
	appointments: store.userState.appointments,
	barber: store.userState.barber
})

export default connect(mapStateToProps, null)(HomeScreen)
