import React, {useContext, useEffect, useState} from 'react'
import {Alert, Linking, ScrollView} from 'react-native'
import {
	Avatar,
	Center,
	View,
	VStack,
	Heading,
	HStack,
	Pressable,
	Box,
	Text
} from 'native-base'
import {Ionicons as Icon} from '@expo/vector-icons'

import * as FileSystem from 'expo-file-system'
import * as ImagePicker from 'expo-image-picker'
import * as Calendar from 'expo-calendar'

import {reload} from '../../redux/actions'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import moment from 'moment'
import {
	subtractDiscount,
	formatPhoneNumber,
	convertTime12to24
} from '../../utils/DataFormatting'

import {AuthenticatedUserContext} from '../../navigation/AuthenticatedUserProvider'
import Firebase from '../../config/firebase'

function Home(props) {
	const {user} = useContext(AuthenticatedUserContext)
	const [userData, setTestUser] = useState({})
	const [barberData, setTestBarber] = useState({})
	const [upcomingAppointments, setUpcomingAppointments] = useState([])
	const [previousAppointments, setPreviousAppointments] = useState([])

	function formatAppointments(data) {
		let [upcomingData, previousData, removeDates] = [[], [], []]
		if (data) {
			Object.entries(data).map((onekey, i) => {
				if (onekey[1].id > moment().format('YYYY-MM-DD')) {
					upcomingData.push(onekey[1])
				} else {
					previousData.push(onekey[1])
					removeDates.push(onekey[1].id.split(' ')[0])
				}
			})
			if (Object.keys(previousData).length > 1) {
				removeDates.splice(removeDates.length - 1, 1)
				const docRef = Firebase.firestore()
					.collection('users')
					.doc(user.uid)
					.collection('Haircuts')
				removeDates.map((date) => docRef.doc(date).delete())
			}
			setUpcomingAppointments(upcomingData)
			setPreviousAppointments(previousData)
		}
	}

	async function pickImage() {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1
		})

		let cameraImageUri = ''
		if (result) {
			const fileName = result.uri.split('/').pop()
			cameraImageUri = FileSystem.documentDirectory + fileName
			try {
				await FileSystem.moveAsync({
					from: result.uri,
					to: cameraImageUri
				})
				const picture = {
					profilePicture: cameraImageUri
				}
				await Firebase.firestore()
					.collection('users')
					.doc(user.uid)
					.set(picture, {merge: true})
			} catch (err) {
				throw new Error('Something went wrong on moving image file!')
			}
		}
	}

	async function createCalendar(
		appointmentDate,
		appointmentTime,
		address,
		phone
	) {
		const newTime = convertTime12to24(appointmentTime)
		let [hours, minutes] = newTime.split(':')
		try {
			const defaultCalendar = await Calendar.getDefaultCalendarAsync()

			await Calendar.createEventAsync(defaultCalendar.id, {
				title: 'Haircut',
				startDate: new moment.utc(appointmentDate)
					.hour(6 + Number(hours))
					.minute(Number(minutes))
					.toDate(),
				endDate: new moment.utc(appointmentDate)
					.hour(6 + Number(hours))
					.minute(Number(minutes) + 30)
					.toDate(),
				timeZone: 'America/Chicago',
				location: address,
				notes: `If you are unable to attend your appointment call Nate. Nate's Phone Number: ${phone}`,
				alarms: [{relativeOffset: -1440}, {relativeOffset: -30}]
			})
			Alert.alert(
				'Haircut Added To Calendar',
				`Haircut Appointment on ${appointmentDate} at ${appointmentTime} has been added to your Calendar`
			)
		} catch (e) {
			Alert.alert(
				'Error Adding Haircut to Calendar',
				`Unable to add Appointment to Calendar. Try Again. ${'\n'} Error: ${
					e.message
				}`
			)
		}
	}

	async function deleteAppointment(date, time) {
		if (date > moment().format('YYYY-MM-DD')) {
			await Firebase.firestore()
				.collection('users')
				.doc(user.uid)
				.collection('Haircuts')
				.doc(moment(date).format('YYYY-MM-DD'))
				.delete()
				.then(() => {
					Alert.alert('Success', 'Appointment Deleted')
				})
				.catch((e) => {
					Alert.alert(
						'Error',
						`Unable to delete appointment. Try again. ${e}`
					)
				})

			const userRef = Firebase.firestore()
				.collection('Calendar')
				.doc(moment(date).format('MMM YY'))
				.collection('OverView')
				.doc('data')
			const increment = Firebase.firestore.FieldValue.increment(-1)
			userRef.update({
				haircuts: increment
			})

			await Firebase.firestore()
				.collection('Calendar')
				.doc(moment(date).format('MMM YY'))
				.collection(moment(date).format('YYYY-MM-DD'))
				.doc(time)
				.delete()
				.catch((e) => {
					Alert.alert(
						'Error',
						`Unable to delete appointment. Try again. ${e}`
					)
				})
		} else {
			Alert.alert(
				'Unable To Delete Appointment',
				'The Appointment date has already passed, or is to close to Appoinment Time. Please contact Nate'
			)
		}
	}

	useEffect(() => {
		const {currentUser, barber, appointments} = props
		setTestUser(currentUser)
		console.log('currentUser', currentUser)
		setTestBarber(barber)
		formatAppointments(appointments),
			(async () => {
				const {status} =
					await Calendar.requestCalendarPermissionsAsync()
				if (status === 'granted') {
					await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT)
				}
			})(),
			(async () => {
				if (Platform.OS !== 'web') {
					const {status} =
						await ImagePicker.requestMediaLibraryPermissionsAsync()
					if (status !== 'granted') {
						alert(
							'Sorry, we need camera roll permissions to make this work!'
						)
					}
				}
			})()
	}, [props])

	return (
		<View flex={1} bgColor={'#000'}>
			<HStack
				space={5}
				alignItems='center'
				bg='#121212'
				pl={'4'}
				pr={'4'}
				borderBottomRadius={'25'}
				safeArea>
				<Box>
					<Pressable onPress={() => pickImage()}>
						<Avatar
							size='xl'
							source={{uri: userData?.profilePicture}}></Avatar>
					</Pressable>
				</Box>

				<VStack space={2} pl={'10'} alignItems='center'>
					<Heading
						size='lg'
						color='#E8BD70'
						onPress={() =>
							props.navigation.navigate('SettingScreen')
						}>
						{userData?.name}
					</Heading>
					<Heading
						size='md'
						onPress={() =>
							Alert.alert(
								'Goat Points',
								`Goat Points are a currency that can be used for discounts on Haircuts. 100 Goat Points is equal to $1. Talk to your Barber about how to earn Goat Points.`,
								[
									{
										text: 'Okay'
									}
								]
							)
						}>
						{userData?.points}
					</Heading>
					<Heading size='sm'>Goat Points</Heading>
				</VStack>
			</HStack>
			<ScrollView bgColor={'#000'}>
				<Heading size={'md'} p={2} mx={2} my={2} color={'#E8BD70'}>
					Upcoming Appoinments
				</Heading>
				{upcomingAppointments.length > 0 ? (
					upcomingAppointments.map((upcomingApp, index) => (
						<Box
							p={2}
							mx={2}
							my={2}
							borderRadius='20'
							bgColor='#121212'
							key={index}>
							<Center>
								<HStack></HStack>
								<Heading
									size={'md'}
									p={'2'}
									onPress={() =>
										Alert.alert(
											'Add Haircut To Calendar',
											`Would you like to add your Appointment on ${moment(
												upcomingApp.id.split(' ')[0]
											).format(
												'ddd, MMM Do YYYY'
											)} at ${upcomingApp.time
												.toString()
												.toLowerCase()} to your calendar?`,
											[
												{
													text: 'Cancel'
												},
												{
													text: 'Add Appointment',
													onPress: () =>
														createCalendar(
															onekey[0],
															onekey[1].time.toString(),
															barberData?.location,
															barberData?.phone
														)
												}
											]
										)
									}>
									{moment(
										upcomingApp.id.split(' ')[0]
									).format('ddd, MMM Do YYYY')}
									,{' '}
									{upcomingApp.time.toString().toLowerCase()}
								</Heading>
								<Heading size='md'>
									{upcomingApp.points != ''
										? subtractDiscount(
												upcomingApp?.haircutType,
												upcomingApp?.haircutType ===
													'kids'
													? barberData?.kidsHaircut
													: barberData?.price,
												upcomingApp.points
										  )
										: barberData?.price}
								</Heading>
								{upcomingApp.points !== '' && (
									<Text color='#fff'>
										GP's: {upcomingApp.points}
									</Text>
								)}
							</Center>
							<HStack flex={1}>
								<VStack flex={3}>
									<Text
										color='warmGray.200'
										onPress={() =>
											Linking.openURL(
												`sms:${barberData?.phone}`
											).catch(() => {
												Linking.openURL(
													`sms:${barberData?.phone}`
												)
											})
										}>
										{formatPhoneNumber(barberData.phone)}
									</Text>
									<Text
										color='warmGray.200'
										onPress={() =>
											Linking.openURL(
												'maps://app?saddr=&daddr=43.0218740049977+-87.9119389619647'
											).catch(() => {
												Linking.openURL(
													'google.navigation:q=43.0218740049977+-87.9119389619647'
												)
											})
										}>
										{barberData?.location}
									</Text>
								</VStack>
								<Pressable
									flex={1}
									alignItems={'flex-end'}
									alignSelf={'flex-end'}
									onPress={() =>
										Alert.alert(
											'Delete Appointment',
											`Would you like to delete this Appointment on ${moment(
												upcomingApp.id.split(' ')[0]
											).format(
												'ddd, MMM Do YYYY'
											)} at ${upcomingApp.time
												.toString()
												.toLowerCase()}`,
											[
												{
													text: 'Cancel'
												},
												{
													text: 'Delete Appointment',
													onPress: () =>
														deleteAppointment(
															moment(
																upcomingApp.id.split(
																	' '
																)[0]
															).format(
																'ddd, MMM Do YYYY'
															),
															upcomingApp.time
														)
												}
											]
										)
									}>
									<Icon
										name={'pencil'}
										color={'#fff'}
										size={25}
									/>
								</Pressable>
							</HStack>
						</Box>
					))
				) : (
					<Box
						p={2}
						mx={2}
						my={2}
						borderRadius='20'
						bgColor='#121212'>
						<Center>
							<Heading size={'md'}>
								No Upcoming Appointments
							</Heading>
						</Center>
					</Box>
				)}
				<Heading size={'md'} m={'3'} color={'#E8BD70'}>
					Previous Appoinments
				</Heading>
				{previousAppointments.length > 0 ? (
					previousAppointments.map((prevApp, index) => (
						<Box
							p={2}
							mx={2}
							my={2}
							borderRadius='20'
							bgColor='#121212'
							key={index}>
							<Center>
								<Heading size={'md'} p={'2'}>
									{moment(prevApp.id.split(' ')[0]).format(
										'ddd, MMM Do YYYY'
									)}
									, {prevApp.time.toString().toLowerCase()}
								</Heading>
								<Heading size='md'>
									{prevApp.points != ''
										? subtractDiscount(
												prevApp?.haircutType,
												prevApp?.haircutType === 'kids'
													? barberData?.kidsHaircut
													: barberData?.price,
												prevApp.points
										  )
										: barberData?.price}
								</Heading>
								{prevApp.points !== '' && (
									<Text color='#fff'>
										GP's: {prevApp.points}
									</Text>
								)}
							</Center>
						</Box>
					))
				) : (
					<Box
						p={2}
						mx={2}
						my={2}
						borderRadius='20'
						bgColor='#121212'>
						<Center>
							<Heading size={'md'}>
								No Previous Appointments
							</Heading>
						</Center>
					</Box>
				)}
			</ScrollView>
		</View>
	)
}

const mapStateToProps = (store) => ({
	currentUser: store.userState.currentUser,
	appointments: store.userState.appointments,
	barber: store.userState.barber
})

const mapDispatchProps = (dispatch) => bindActionCreators({reload}, dispatch)

export default connect(mapStateToProps, mapDispatchProps)(Home)
