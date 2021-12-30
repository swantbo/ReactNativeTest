import React, {useEffect, useState, useContext} from 'react'
import {View, Text, ScrollView, Linking, ActivityIndicator, SafeAreaView, ImageBackground, TouchableOpacity, SectionList, Item} from 'react-native'
import {Card, SocialIcon, Avatar, Image, PricingCard, ListItem} from 'react-native-elements'
import MapView from 'react-native-maps'
import createStyles from '../../styles/base'

import {connect} from 'react-redux'

import {formatPhoneNumber} from '../../utils/DataFormatting'
import {AuthenticatedUserContext} from '../../navigation/AuthenticatedUserProvider'

import Firebase from '../../config/firebase'

function Barber(props) {
	const {user} = useContext(AuthenticatedUserContext)
	const [barber, setBarber] = useState({})
	const [image, setImage] = useState(null)
	const [haircutImages, setHaircutImages] = useState([])

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
			//const urls = ['https://picsum.photos/200/300?random=1', 'https://picsum.photos/200/300?random=2', 'https://picsum.photos/200/300?random=3', 'https://picsum.photos/200/300?random=4']
			setHaircutImages(urls)
		}

		getBarberImage()
	}, [props])

	return (
		<>
			<SafeAreaView style={styles.cardHeader}>
				<Avatar containerStyle={styles.avatarBackground} rounded size='xlarge' title={'N'} source={{uri: image}} />
			</SafeAreaView>
			<View style={styles.container}>
				<ScrollView style={styles.scrollView}>
					<Card containerStyle={styles.cardBio}>
						<Card.Title style={styles.cardTitle}>{barber.name}</Card.Title>
						<Card.Title style={styles.listItemSubTitle}>{barber.bio}</Card.Title>
					</Card>

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
						/>
					</View>

					<Card containerStyle={styles.barberInfoView}>
						<Card.Title style={styles.barberInfoTitles}>SERVICES & PRICING</Card.Title>
						<ListItem topDivider bottomDivider containerStyle={styles.listItemContainer}>
							<ListItem.Content>
								<View style={styles.row}>
									<View style={styles.rowStart}>
										<ListItem.Title style={styles.listItemSubTitle}>Men's Haircut</ListItem.Title>
									</View>
									<View style={styles.rowEnd}>
										<ListItem.Title style={styles.listItemSubTitle}>{barber.price}</ListItem.Title>
									</View>
								</View>
								<ListItem.Subtitle style={styles.listItemSubTitle}>Full Haircut, Eyebrows, and Beard Trim</ListItem.Subtitle>
							</ListItem.Content>
						</ListItem>
						<ListItem bottomDivider containerStyle={styles.listItemContainer}>
							<ListItem.Content>
								<View style={styles.row}>
									<View style={styles.rowStart}>
										<ListItem.Title style={styles.listItemSubTitle}>Kid's Haircut</ListItem.Title>
									</View>
									<View style={styles.rowEnd}>
										<ListItem.Title style={styles.listItemSubTitle}>{barber.kidsHaircut}</ListItem.Title>
									</View>
								</View>
								<ListItem.Subtitle style={styles.listItemSubTitle}>Full Haircut, for Kid's</ListItem.Subtitle>
							</ListItem.Content>
						</ListItem>
					</Card>

					<Card containerStyle={styles.barberInfoView}>
						<Card.Title style={styles.barberInfoTitles}>ADDRESS & HOURS</Card.Title>
						<View style={styles.row}>
							<View style={styles.rowStart}>
								<Text style={styles.addressTitle}>{barber.location}</Text>
								<TouchableOpacity
									onPress={() =>
										Linking.openURL(`sms:${barber?.phone}`).catch(() => {
											Linking.openURL(`sms:${barber?.phone}`)
										})
									}>
									<Text style={styles.addressTitle}>{barber.phone != '' ? formatPhoneNumber(barber.phone) : ''}</Text>
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

					<Card containerStyle={styles.barberInfoView}>
						<Card.Title style={styles.barberInfoTitles}>Photos</Card.Title>
						<View style={styles.containerGallery}>
							<View style={styles.containerImage}>
								<Image
									style={styles.image}
									source={{uri: haircutImages[0]}}
									PlaceholderContent={<ActivityIndicator />}
									onPress={() =>
										props.navigation.navigate('ViewImage', {
											selectedImage: haircutImages[0]
										})
									}
								/>
							</View>
							<View style={styles.containerImage}>
								<Image
									style={styles.image}
									source={{uri: haircutImages[1]}}
									PlaceholderContent={<ActivityIndicator />}
									onPress={() =>
										props.navigation.navigate('ViewImage', {
											selectedImage: haircutImages[1]
										})
									}
								/>
							</View>
						</View>
						<View style={styles.containerGallery}>
							<View style={styles.containerImage}>
								<Image
									style={styles.image}
									source={{uri: haircutImages[2]}}
									PlaceholderContent={<ActivityIndicator />}
									onPress={() =>
										props.navigation.navigate('ViewImage', {
											selectedImage: haircutImages[2]
										})
									}
								/>
							</View>
							<View style={styles.containerImage}>
								<Image
									style={styles.image}
									source={{uri: haircutImages[3]}}
									PlaceholderContent={<ActivityIndicator />}
									onPress={() =>
										props.navigation.navigate('ViewImage', {
											selectedImage: haircutImages[3]
										})
									}
								/>
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

export default connect(mapStateToProps, null)(Barber)
