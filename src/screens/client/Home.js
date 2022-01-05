import React, {useContext, useEffect, useState} from 'react'
import {View, Alert, Linking, SafeAreaView, TouchableOpacity, RefreshControl, ScrollView} from 'react-native'
import {Card, ListItem, Button, PricingCard} from 'react-native-elements'
import {Avatar, Center, VStack, Heading, HStack, FlatList, Box, Text} from 'native-base'
import createStyles from '../../styles/base'

import * as FileSystem from 'expo-file-system'
import { reload } from '../../redux/actions'
import {connect} from 'react-redux'
import moment from 'moment'
import * as ImagePicker from 'expo-image-picker'
import * as Calendar from 'expo-calendar'
import {subtractDiscount, formatPhoneNumber, convertTime12to24} from '../../utils/DataFormatting'

import {AuthenticatedUserContext} from '../../navigation/AuthenticatedUserProvider'
import Firebase from '../../config/firebase'
import { bindActionCreators } from 'redux'

function Home(props) {
	const {user} = useContext(AuthenticatedUserContext)
	const [userData, setTestUser] = useState({})
	const [refreshing, setRefreshing] = useState(false)

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
		if (Object.keys(previousData).length > 2) {
			removeDates.splice(removeDates.length - 2, 2)
			const docRef = Firebase.firestore().collection('users').doc(user.uid).collection('Haircuts')
			removeDates.map((date) => docRef.doc(date).delete())
		}
		setUpcomingAppointments(upcomingData)
		setPreviousAppointments(previousData)
		}
		
	}

	const pickImage = async () => {
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
				await FileSystem.moveAsync({from: result.uri, to: cameraImageUri})
				const picture = {
					profilePicture: cameraImageUri
				}
				await Firebase.firestore().collection('users').doc(user.uid).set(picture, {merge: true})
			} catch (err) {
				throw new Error('Something went wrong on moving image file!')
			}
		}
	}

	async function createCalendar(appointmentDate, appointmentTime, address, phone) {
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
			Alert.alert('Haircut Added To Calendar', `Haircut Appointment on ${appointmentDate} at ${appointmentTime} has been added to your Calendar`)
		} catch (e) {
			Alert.alert('Error Adding Haircut to Calendar', `Unable to add Appointment to Calendar. Try Again. ${'\n'} Error: ${e.message}`)
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
					Alert.alert('Error', `Unable to delete appointment. Try again. ${e}`)
				})

			const userRef = Firebase.firestore().collection('Calendar').doc(moment(date).format('MMM YY')).collection('OverView').doc('data')
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
					Alert.alert('Error', `Unable to delete appointment. Try again. ${e}`)
				})
		} else {
			Alert.alert('Unable To Delete Appointment', 'The Appointment date has already passed, or is to close to Appoinment Time. Please contact Nate')
		}
	}

	useEffect(() => {
		const {currentUser, barber, appointments} = props
		setTestUser(currentUser)
		setTestBarber(barber)
		formatAppointments(appointments)
		,
			(async () => {
				const {status} = await Calendar.requestCalendarPermissionsAsync()
				if (status === 'granted') {
					await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT)
				}
			})(),
			(async () => {
				if (Platform.OS !== 'web') {
					const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync()
					if (status !== 'granted') {
						alert('Sorry, we need camera roll permissions to make this work!')
					}
				}
			})()
	}, [props])

	return (
		<>
			<HStack space={5} alignItems="center" bg="#000" safeArea>
				<Avatar size='xl' source={{uri: userData?.profilePicture}} onPress={() => pickImage()} >
					{userData?.name?.[0]}
				</Avatar>	
				<VStack space={4} alignItems="center">
					<Heading size='xl' color="#E8BD70" onPress={() => props.navigation.navigate('SettingScreen')}>
						{userData?.name}
					</Heading>
					<Heading
						size='lg'
						onPress={() =>
							Alert.alert('Goat Points', `Goat Points are a currency that can be used for discounts on Haircuts. 100 Goat Points is equal to $1. Talk to your Barber about how to earn Goat Points.`, [
								{
									text: 'Okay'
								}
							])
						}>
						{userData?.points}
					</Heading>
					<Heading size='md'>Goat Points</Heading>
				</VStack>
			</HStack>
			<FlatList data={previousAppointments}
				renderItem={({ item }) => (
					<Box
						borderBottomWidth="1"
						bg='#121212'
						borderColor="#121212"
					>
						<HStack bg='#121212' >
							<VStack>
								<Heading bg='#121212' size='sm'>{item.id}</Heading>
								<Text bg='#121212' size='sm'>{barberData.location}</Text>
								<Text bg='#121212' size='sm'>{barberData.phone}</Text>
							</VStack>
							
							<VStack>
								<Text bg='#121212' size='sm'>{barberData.price}</Text>
								<Text bg='#121212' size='sm'>{barberData.price}</Text>
							</VStack>
							
						</HStack>
					</Box>
				)} keyExtractor={(item) => item.id} />
			<ScrollView style={styles.scrollView} refreshControl={
				<RefreshControl
				color={'#E8BD70'}
				tintColor={'#E8BD70'}
					refreshing={refreshing}
					onRefresh={() => {
						setRefreshing(true)
						props.reload()
						setRefreshing(false)
					}}
				/>
			}>
				<View>
					<ListItem bottomDivider >
						<ListItem.Content>
							<ListItem.Title style={styles.goldTitle}>Upcoming Appointments</ListItem.Title>
						</ListItem.Content>
					</ListItem>{console.log('upcomingAppointments', upcomingAppointments)}
					{/* {Object.keys(upcomingAppointments).length > 0 ? (
						<>
							{Object.entries(upcomingAppointments)
								.map((onekey, i) => (
									<ListItem.Swipeable
										bottomDivider
										containerStyle={styles.listItemContainer}
										key={i}
										rightContent={
											<Button
												title='Delete'
												icon={{
													name: 'delete',
													color: 'white'
												}}
												buttonStyle={styles.listItemButton}
												onPress={() =>
													Alert.alert('Delete Appointment', `Are you sure you want to delete this ${'\n'}Appointment on ${onekey[0]} ${'\n'} at ${onekey[1].time}`, [
														{
															text: 'Cancel'
														},
														{
															text: 'Delete Appointment',
															onPress: () => deleteAppointment(onekey[0], onekey[1].time)
														}
													])
												}
											/>
										}>
										<ListItem.Content>
											<View style={styles.row}>
												<View style={styles.rowStart}>
													<TouchableOpacity
														onPress={() =>
															Alert.alert('Add Haircut To Calendar', `Would you like to add your Appointment on ${onekey[0]} at ${onekey[1].time} to your calendar?`, [
																{
																	text: 'Cancel'
																},
																{
																	text: 'Add Appointment',
																	onPress: () => createCalendar(onekey[0], onekey[1].time.toString(), barberData?.location, barberData?.phone)
																}
															])
														}>
														<ListItem.Title style={styles.subtitle}>
															{moment(onekey[1].id.split(' ')[0]).format('ddd, MMM Do YYYY')}, {onekey[1].time.toString().toLowerCase()}
														</ListItem.Title>
													</TouchableOpacity>
												</View>
												<View style={styles.rowEnd}>
													{onekey[1].points ? (
														<>
															<ListItem.Title style={styles.subtitle}>
																{onekey[1].points != ''
																	? '$' + subtractDiscount(onekey[1]?.haircutType, onekey[1]?.haircutType === 'kids' ? barberData?.kidsHaircut : barberData?.price, onekey[1].points)
																	: '$' + barberData?.price}
															</ListItem.Title>
														</>
													) : (
														<ListItem.Title style={styles.subtitle}>{barberData?.price != '' && onekey[1]?.haircutType === 'kids' ? barberData?.kidsHaircut : barberData?.price}</ListItem.Title>
													)}
												</View>
											</View>
											<View style={styles.row}>
												<View style={styles.rowStart}>
													<ListItem.Subtitle
														style={styles.subtitle}
														onPress={() =>
															Linking.openURL(`sms:${barberData?.phone}`).catch(() => {
																Linking.openURL(`sms:${barberData?.phone}`)
															})
														}>
														{barberData?.phone != '' ? formatPhoneNumber(barberData?.phone) : ''}{' '}
													</ListItem.Subtitle>
												</View>
												<View style={styles.rowEnd}>
													<Text style={styles.subtitle}>{onekey[1].points ? 'Goat Points: ' + onekey[1].points : 'Goat Points: 0'} </Text>
												</View>
											</View>
											<View style={styles.row}>
												<View style={styles.rowStart}>
													<ListItem.Subtitle
														style={styles.subtitle}
														onPress={() =>
															Linking.openURL('maps://app?saddr=&daddr=43.0218740049977+-87.9119389619647').catch(() => {
																Linking.openURL('google.navigation:q=43.0218740049977+-87.9119389619647')
															})
														}>
														{barberData?.location != '' ? barberData?.location : ''}
													</ListItem.Subtitle>
												</View>
											</View>
											<View style={styles.row}>
												{onekey[1]?.friend && (
													<View style={styles.rowStart}>
														<ListItem.Subtitle style={styles.subtitle}>Friend: {onekey[1]?.friend}</ListItem.Subtitle>
													</View>
												)}
											</View>
										</ListItem.Content>
									</ListItem.Swipeable>
								))
								.reverse()}
						</>
					) : (
						<ListItem bottomDivider containerStyle={styles.listItemContainer}>
							<ListItem.Title style={styles.titleCenter}>No Upcoming Appointments</ListItem.Title>
						</ListItem>
					)}
					<ListItem bottomDivider containerStyle={styles.listItemContainer}>
						<ListItem.Title style={styles.goldTitle}>Previous Appointments</ListItem.Title>
					</ListItem>
					{Object.keys(previousAppointments).length > 0 ? (
						<>
							{Object.entries(previousAppointments)
								.map((onekey, i) => (
									<ListItem bottomDivider key={i} containerStyle={styles.listItemContainer}>
										<ListItem.Content>
											<View style={styles.row}>
												<View style={styles.rowStart}>
													<ListItem.Title style={styles.subtitle}>
														{moment(onekey[1].id.split(' ')[0]).format('ddd, MMM Do YYYY')}, {onekey[1].time.toString().toLowerCase()}
													</ListItem.Title>
												</View>
												<View style={styles.rowEnd}>
													{onekey[1].points ? (
														<ListItem.Title style={styles.subtitle}>{onekey[1].points != '' ? '$' + subtractDiscount(onekey[1]?.haircutType, barberData?.price, onekey[1].points) : ''}</ListItem.Title>
													) : (
														<ListItem.Title style={styles.subtitle}>{barberData?.price != '' ? barberData?.price : ''}</ListItem.Title>
													)}
												</View>
											</View>
											<View style={styles.row}>
												<View style={styles.rowEnd}>
													{onekey[1].points ? <ListItem.Subtitle style={styles.subtitle}>{onekey[1].points ? 'Goat Points: ' + onekey[1].points : 'Goat Points: 0'} </ListItem.Subtitle> : null}
												</View>
											</View>
											<View style={styles.row}>
												<View style={styles.rowStart}>
													<ListItem.Subtitle style={styles.subtitle}>{onekey[1]?.friend && 'Friend: ' + onekey[1]?.friend}</ListItem.Subtitle>
												</View>
											</View>
										</ListItem.Content>
									</ListItem>
								))
								.reverse()}
						</>
					) : (
						<ListItem bottomDivider containerStyle={styles.listItemContainer}>
							<ListItem.Title style={styles.titleCenter}>No Previous Appointments</ListItem.Title>
						</ListItem>
					)} */}
				</View>
			</ScrollView>
		</>
	)
}

const styles = createStyles()

const mapStateToProps = (store) => ({
	currentUser: store.userState.currentUser,
	appointments: store.userState.appointments,
	barber: store.userState.barber
})

const mapDispatchProps = (dispatch) => bindActionCreators({reload}, dispatch)

export default connect(mapStateToProps, mapDispatchProps)(Home)
