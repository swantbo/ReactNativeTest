import React, {useEffect, useState, useContext} from 'react'
import {
	ScrollView,
	Linking,
	ActivityIndicator,
	View,
	Image,
	ImageBackground,
	TouchableOpacity,
	RefreshControl
} from 'react-native'
import {Card, SocialIcon, PricingCard, ListItem} from 'react-native-elements'
import MapView from 'react-native-maps'
import createStyles from '../../styles/base'
import {Avatar, Center, VStack, Heading, HStack, Box, Text} from 'native-base'

import {reload} from '../../redux/actions'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import {formatPhoneNumber} from '../../utils/DataFormatting'
import {AuthenticatedUserContext} from '../../navigation/AuthenticatedUserProvider'

import Firebase from '../../config/firebase'

function Barber(props) {
	const {user} = useContext(AuthenticatedUserContext)
	const [barber, setBarber] = useState({})
	const [image, setImage] = useState(null)
	const [haircutImages, setHaircutImages] = useState([])
	const [refreshing, setRefreshing] = useState(false)

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
			const imageRefs = await Firebase.storage()
				.ref('Barber/HaircutPictures/')
				.listAll()
			const urls = await Promise.all(
				imageRefs.items.map((ref) => ref.getDownloadURL())
			)
			//const urls = ['https://picsum.photos/200/300?random=1', 'https://picsum.photos/200/300?random=2', 'https://picsum.photos/200/300?random=3', 'https://picsum.photos/200/300?random=4']
			setHaircutImages(urls)
		}

		getBarberImage()
	}, [props])

	return (
		<VStack flex={1} bgColor={'#000'}>
			<VStack bg='#121212' borderBottomRadius={'25'} safeArea>
				<Center>
					<Avatar size='2xl' source={{uri: image}}></Avatar>
				</Center>
			</VStack>
			<ScrollView flex={1} bgColor={'#000'}>
				<Box>
					<Center m={'5'}>
						<Heading size={'lg'} color={'#E8BD70'}>
							{barber?.name}
						</Heading>
						<Text fontSize={'md'} bold>
							{barber?.bio}
						</Text>
					</Center>
				</Box>
				<HStack
					justifyContent={'space-between'}
					p={2}
					mx={2}
					my={2}
					borderRadius='20'
					bgColor='#121212'>
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
							Linking.openURL(`sms:${barber?.phone}`).catch(
								() => {
									Linking.openURL(`sms:${barber?.phone}`)
								}
							)
						}
						style={styles.socialIcons}
						iconType='MaterialCommunityIcons'
						type='sms'
					/>
					<SocialIcon
						onPress={() =>
							Linking.openURL(
								`instagram://user?username=${barber?.instagram}`
							).catch(() => {
								Linking.openURL(
									`https://www.instagram.com/${barber?.instagram}`
								)
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
				<VStack
					flex={1}
					p={2}
					mx={2}
					my={2}
					borderRadius='20'
					bgColor='#121212'>
					<Heading pb={'2'} color={'#E8BD70'} size={'sm'}>
						SERVICES & PRICING
					</Heading>
					<HStack space={2}>
						<VStack flex={1}>
							<Box
								p={1}
								borderWidth={0.5}
								borderColor={'grey'}
								borderRadius='20'>
								<Center>
									<Text fontSize={'md'} bold>
										Men's Haircut
									</Text>
									<Text fontSize={'md'} bold>
										{barber?.price}
									</Text>
									<Text
										mx={'2'}
										fontSize={'sm'}
										textAlign={'center'}>
										Full Haircut, Eyebrows, and Beard Trim
									</Text>
								</Center>
							</Box>
						</VStack>
						<VStack flex={1}>
							<Box
								p={1}
								borderWidth={0.5}
								borderColor={'grey'}
								borderRadius='20'>
								<Center>
									<Text fontSize={'md'} bold>
										Kid's Haircut
									</Text>
									<Text fontSize={'md'} bold>
										{barber?.kidsHaircut}
									</Text>
									<Text
										mx={'2'}
										fontSize={'sm'}
										textAlign={'center'}>
										Full Haircut, for Kid's {'\n'}(13 and
										under)
									</Text>
								</Center>
							</Box>
						</VStack>
					</HStack>
				</VStack>
				<HStack p={2} mx={2} my={2} borderRadius='20' bgColor='#121212'>
					<VStack flex={'1'}>
						<Heading pb={'2'} color={'#E8BD70'} size={'sm'}>
							ADDRESS & HOURS
						</Heading>
						<Text fontSize={'sm'}>{barber?.location}</Text>
						<TouchableOpacity
							onPress={() =>
								Linking.openURL(`sms:${barber?.phone}`).catch(
									() => {
										Linking.openURL(`sms:${barber?.phone}`)
									}
								)
							}>
							<Text fontSize={'sm'}>
								{barber?.phone != ''
									? formatPhoneNumber(barber?.phone)
									: ''}
							</Text>
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
							<Text fontSize={'sm'}>
								{' ' + barber?.Wednesday}
							</Text>
						</HStack>
						<HStack>
							<Text fontSize={'sm'} bold>
								Thursday
							</Text>
							<Text fontSize={'sm'}>
								{' ' + barber?.Thursday}
							</Text>
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
							<Text fontSize={'sm'}>
								{' ' + barber?.Saturday}
							</Text>
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
							Linking.openURL(
								'maps://app?saddr=&daddr=43.0218740049977+-87.9119389619647'
							).catch(() => {
								Linking.openURL(
									'google.navigation:q=43.0218740049977+-87.9119389619647'
								)
							})
						}>
						<MapView.Marker
							coordinate={{
								latitude: 43.0218740049977,
								longitude: -87.9119389619647
							}}
						/>
					</MapView>
				</HStack>
				<VStack p={2} mx={2} my={2} borderRadius='20' bgColor='#121212'>
					<Heading pb={'2'} color={'#E8BD70'} size={'sm'}>
						Photos
					</Heading>
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
				</VStack>
			</ScrollView>
		</VStack>
	)
}

const styles = createStyles()

const mapStateToProps = (store) => ({
	currentUser: store.userState.currentUser,
	appointments: store.userState.appointments,
	barber: store.userState.barber
})

const mapDispatchProps = (dispatch) => bindActionCreators({reload}, dispatch)

export default connect(mapStateToProps, mapDispatchProps)(Barber)
