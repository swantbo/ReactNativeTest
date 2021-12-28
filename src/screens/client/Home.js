import React, {useContext, useEffect, useState} from 'react'
import {View, Text, StyleSheet, Alert, Linking, TouchableOpacity, SafeAreaView, Image} from 'react-native'
import {Card, ListItem, Button, Avatar, PricingCard} from 'react-native-elements'
import {ScrollView} from 'react-native-gesture-handler'
import createStyles from '../../styles/base'

import {connect} from 'react-redux'
import moment from 'moment'
import * as ImagePicker from 'expo-image-picker'
import * as Calendar from 'expo-calendar'
import {subtractDiscount, formatPhoneNumber, convertTime12to24} from '../../utils/DataFormatting'

import {AuthenticatedUserContext} from '../../navigation/AuthenticatedUserProvider'
import Firebase from '../../config/firebase'

function Home(props) {
	const {user} = useContext(AuthenticatedUserContext)
	const [image, setImage] = useState(null)
	const [userData, setTestUser] = useState({})
	const [barberData, setTestBarber] = useState({})
	const [upcomingAppointments, setUpcomingAppointments] = useState({})
	const [previousAppointments, setPreviousAppointments] = useState({})

	function formatAppointments(data) {
		let [upcomingData, previousData, removeDates] = [{}, {}, []]
		Object.entries(data).map((onekey, i) => {
			if (onekey[1].id > moment().format('YYYY-MM-DD')) {
				upcomingData = {
					...upcomingData,
					...{[onekey[1].id]: onekey[1]}
				}
			} else {
				previousData = {
					...previousData,
					...{[onekey[1].id]: onekey[1]}
				}
				removeDates.push(onekey[1].id)
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

	async function getUserInfo() {
		try {
			await Firebase.storage()
				.ref('Users/' + user.uid)
				.getDownloadURL()
				.then((image) => {
					setImage(image)
				})
				.catch((error) => {
					console.log('error', error)
				})
		} catch (err) {
			Alert.alert('There is an error.', err.message)
		}
	}

	const pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1
		})

		if (!result.cancelled) {
			setImage(result.uri)
			uploadImageAsync(result.uri)
		}
	}

	async function uploadImageAsync(uri) {
		const response = await fetch(uri)
		const blob = await response.blob()
		await Firebase.storage()
			.ref('Users/' + user.uid)
			.put(blob)
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
		getUserInfo()
		formatAppointments(appointments),
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
			<SafeAreaView style={styles.cardHeader}>
				<Avatar containerStyle={styles.avatarBackground} rounded size='xlarge' title={userData.name?.[0]} source={{uri: image}} onPress={() => pickImage()} />
			</SafeAreaView>
			<View style={styles.container}>
				<ScrollView style={styles.scrollView}>
					<Card containerStyle={styles.cardBio}>
						<Card.Title style={styles.cardTitle} onPress={() => props.navigation.navigate('SettingScreen')}>
							{userData.name}
						</Card.Title>
						<Card.Title
							style={styles.title}
							onPress={() =>
								Alert.alert('Goat Points', `Goat Points are a currency that can be used for discounts on Haircuts. 100 Goat Points is equal to $1. Talk to your Barber about how to earn Goat Points.`, [
									{
										text: 'Okay'
									}
								])
							}>
							{userData.points}
						</Card.Title>
						<Card.Title style={styles.listItemSubTitle}>Goat Points</Card.Title>
					</Card>
					<View>
						<ListItem bottomDivider containerStyle={styles.listItemContainer}>
							<ListItem.Content>
								<ListItem.Title style={styles.listItemTitle}>Upcoming Appointments</ListItem.Title>
							</ListItem.Content>
						</ListItem>
						{Object.keys(upcomingAppointments).length > 0 ? (
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
																		onPress: () => createCalendar(onekey[0], onekey[1].time.toString(), barberData.location, barberData.phone)
																	}
																])
															}>
															<ListItem.Title style={styles.listItemSubTitle}>
																{moment(onekey[1].id).format('ddd, MMM Do YYYY')}, {onekey[1].time.toString().toLowerCase()}
															</ListItem.Title>
														</TouchableOpacity>
													</View>
													<View style={styles.rowEnd}>
														{onekey[1].points ? (
															<>
																<ListItem.Title style={styles.listItemSubTitle}>
																	{onekey[1].points != ''
																		? '$' + subtractDiscount(onekey[1]?.haircutType, onekey[1]?.haircutType === 'kids' ? barberData?.kidsHaircut : barberData?.price, onekey[1].points)
																		: '$' + barberData.price}
																</ListItem.Title>
															</>
														) : (
															<ListItem.Title style={styles.listItemSubTitle}>{barberData.price != '' && onekey[1]?.haircutType === 'kids' ? barberData?.kidsHaircut : barberData?.price}</ListItem.Title>
														)}
													</View>
												</View>
												<View style={styles.row}>
													<View style={styles.rowStart}>
														<ListItem.Subtitle
															style={styles.listItemSubTitle}
															onPress={() =>
																Linking.openURL(`sms:${barberData?.phone}`).catch(() => {
																	Linking.openURL(`sms:${barberData?.phone}`)
																})
															}>
															{barberData.phone != '' ? formatPhoneNumber(barberData.phone) : ''}{' '}
														</ListItem.Subtitle>
													</View>
													<View style={styles.rowEnd}>
														<Text style={styles.listItemSubTitle}>{onekey[1].points ? 'Goat Points: ' + onekey[1].points : 'Goat Points: 0'} </Text>
													</View>
												</View>
												<View style={styles.row}>
													<View style={styles.rowStart}>
														<ListItem.Subtitle
															style={styles.listItemSubTitle}
															onPress={() =>
																Linking.openURL('maps://app?saddr=&daddr=43.0218740049977+-87.9119389619647').catch(() => {
																	Linking.openURL('google.navigation:q=43.0218740049977+-87.9119389619647')
																})
															}>
															{barberData.location != '' ? barberData.location : ''}
														</ListItem.Subtitle>
													</View>
												</View>
												<View style={styles.row}>
													{onekey[1]?.friend && (
														<View style={styles.rowStart}>
															<ListItem.Subtitle style={styles.listItemSubTitle}>Friend: {onekey[1]?.friend}</ListItem.Subtitle>
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
								<ListItem.Title style={styles.listItemNoAppointments}>No Upcoming Appointments</ListItem.Title>
							</ListItem>
						)}
						<ListItem bottomDivider containerStyle={styles.listItemContainer}>
							<ListItem.Title style={styles.listItemTitle}>Previous Appointments</ListItem.Title>
						</ListItem>
						{Object.keys(previousAppointments).length > 0 ? (
							<>
								{Object.entries(previousAppointments)
									.map((onekey, i) => (
										<ListItem bottomDivider key={i} containerStyle={styles.listItemContainer}>
											<ListItem.Content>
												<View style={styles.row}>
													<View style={styles.rowStart}>
														<ListItem.Title style={styles.listItemSubTitle}>
															{moment(onekey[1].id).format('ddd, MMM Do YYYY')}, {onekey[1].time.toString().toLowerCase()}
														</ListItem.Title>
													</View>
													<View style={styles.rowEnd}>
														{onekey[1].points ? (
															<ListItem.Title style={styles.listItemSubTitle}>{onekey[1].points != '' ? '$' + subtractDiscount(onekey[1]?.haircutType, barberData.price, onekey[1].points) : ''}</ListItem.Title>
														) : (
															<ListItem.Title style={styles.listItemSubTitle}>{barberData.price != '' ? barberData.price : ''}</ListItem.Title>
														)}
													</View>
												</View>
												<View style={styles.row}>
													<View style={styles.rowEnd}>
														{onekey[1].points ? <ListItem.Subtitle style={styles.listItemSubTitle}>{onekey[1].points ? 'Goat Points: ' + onekey[1].points : 'Goat Points: 0'} </ListItem.Subtitle> : null}
													</View>
												</View>
												<View style={styles.row}>
													<View style={styles.rowStart}>
														<ListItem.Subtitle style={styles.listItemSubTitle}>{onekey[1]?.friend && 'Friend: ' + onekey[1]?.friend}</ListItem.Subtitle>
													</View>
												</View>
											</ListItem.Content>
										</ListItem>
									))
									.reverse()}
							</>
						) : (
							<ListItem bottomDivider containerStyle={styles.listItemContainer}>
								<ListItem.Title style={styles.listItemNoAppointments}>No Previous Appointments</ListItem.Title>
							</ListItem>
						)}
					</View>
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

export default connect(mapStateToProps, null)(Home)
