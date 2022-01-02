import React, {useEffect, useState} from 'react'
import {View, StyleSheet, ScrollView, ActivityIndicator, Alert, Linking, TouchableOpacity, Text} from 'react-native'
import CalendarStrip from 'react-native-calendar-strip'
import {ListItem, Button} from 'react-native-elements'

import {formatPhoneNumber} from '../../utils/DataFormatting'
import createStyles from '../../styles/base'

import moment from 'moment'
import {connect} from 'react-redux'
import Firebase from '../../config/firebase'

import {AuthenticatedUserContext} from '../../navigation/AuthenticatedUserProvider'

function Calendar(props) {
	const [isLoading, setIsLoading] = useState(false)
	const [barberData, setBarberData] = useState({})
	const [calendarData, setCalendarData] = useState([])
	const [selectedDate, setSelectedDate] = useState(moment())
	const [formattedDate, setFormattedDate] = useState()

	const onDateSelected = (selectedDate) => {
		setSelectedDate(selectedDate.format('YYYY-MM-DD'))
		setFormattedDate(selectedDate.format('YYYY-MM-DD'))
		setIsLoading(true)
		splitHours(selectedDate)
	}

	const splitHours = async (selectedDate) => {
		const weekDay = Promise.resolve(moment(selectedDate, 'YYYY-MM-DD HH:mm:ss').format('dddd').toString())
		Promise.all([weekDay]).then((values) => {
			createAvailableTimes(barberData[`${values}`], selectedDate)
		})
	}

	function createAvailableTimes(newWeekDay, selectedDate) {
		let arr = newWeekDay
		if (arr !== undefined) {
			const newSplitString = arr
				.toUpperCase()
				.split('-')
				.map((item) => item.trim())
			const startTime = moment(newSplitString[0], 'HH:mm a')
			const endTime = moment(newSplitString[1], 'HH:mm a')
			let newIntervals = []
			while (startTime <= endTime) {
				let newobj = {
					time: moment(startTime, 'HH:mm a')
						.format('hh:mm A')
						.toString()
						.replace(/^(?:00:)?0?/, '')
				}
				newIntervals.push(newobj)
				startTime.add(30, 'minutes')
			}
			onGetData(selectedDate, newIntervals)
		} else {
			setIsLoading(false)
			setCalendarData([])
		}
	}

	async function onGetData(selectedDate, newIntervals) {
		await Firebase.firestore()
			.collection('Calendar')
			.doc(moment(selectedDate).format('MMM YY'))
			.collection(moment(selectedDate).format('YYYY-MM-DD'))
			.get()
			.then((snapshot) => {
				let data = []
				snapshot.forEach((doc) => {
					const tempData = doc.data()
					data.push(tempData)
				})
				let test
				const calendarTimes = newIntervals.map((obj) => data.find((o) => o.time === obj.time) || obj)
				let result = data.filter((o1) => !newIntervals.some((o2) => o1.time === o2.time))
				if (result.length > 0) {
					let testResults = [...calendarTimes, ...result]
					testResults.sort((a, b) => moment(a.time, 'HH:mm a') - moment(b.time, 'HH:mm a'))
					setCalendarData(testResults)
				}
				if (result.length === 0) {
					setCalendarData(calendarTimes)
				}
				setIsLoading(false)
			})
			.catch((e) => {
				Alert.alert('Error', `Unable to get data, try again. ${e}`)
			})
	}

	const deleteAppointment = (deleteTime) => {
		const userRef = Firebase.firestore().collection('Calendar').doc(moment(date).format('MMM YY')).collection('OverView').doc('data')
		const increment = Firebase.firestore.FieldValue.increment(-1)

		userRef.update({
			haircuts: increment
		})

		Firebase.firestore()
			.collection('Calendar')
			.doc(moment(selectedDate).format('MMM YY'))
			.collection(moment(selectedDate).format('YYYY-MM-DD'))
			.doc(deleteTime)
			.delete()
			.then(() => {
				Alert.alert('Success', 'Appointment Deleted')
			})
			.catch((e) => {
				Alert.alert('Error', `Unable to delete appointment. Try again. ${e}`)
			})
	}

	const addStrike = (user_id, strikes) => {
		const strikesTotal = 1 + Number(strikes)

		const newStikes = {
			strikes: strikesTotal?.toString()
		}
		Firebase.firestore()
			.collection('users')
			.doc(user_id)
			.set(newStikes, {merge: true})
			.catch((e) => {
				alert('Unable to add Strikes to user, try again')
			})
	}

	useEffect(() => {
		const {barber} = props
		setBarberData(barber)
		onDateSelected(moment())
	}, [props])

	return (
		<View style={styles.settingsContainer}>
			<CalendarStrip
				scrollable
				style={{height: 100, paddingTop: 10, paddingBottom: 10}}
				calendarHeaderStyle={{color: '#E8BD70', fontSize: 17}}
				calendarColor={'#121212'}
				dateNumberStyle={{color: 'white'}}
				dateNameStyle={{color: 'white'}}
				iconContainer={{flex: 0.1}}
				highlightDateNameStyle={{color: 'white'}}
				highlightDateNumberStyle={{
					fontWeight: 'bold',
					color: 'white'
				}}
				highlightDateContainerStyle={{backgroundColor: '#E8BD70'}}
				selectedDate={selectedDate}
				onDateSelected={onDateSelected}
			/>

			<ListItem bottomDivider containerStyle={styles.listItemContainer}>
				<ListItem.Content>
					<ListItem.Title style={styles.selectedDate}> {formattedDate ? formattedDate : 'Choose a date'} </ListItem.Title>
				</ListItem.Content>
			</ListItem>
			{isLoading ? (
				<ActivityIndicator size='large' color='#0000ff' />
			) : calendarData !== [] ? (
				<ScrollView style={styles.scrollView}>
					{calendarData.map((key, index) => (
						<ListItem.Swipeable
							key={`${key.name}_${key.phone}_${key.time}_${key.comment}`}
							bottomDivider
							containerStyle={styles.listItemContainer}
							rightContent={
								<Button
									title='Delete'
									icon={{
										name: 'delete',
										color: 'white'
									}}
									buttonStyle={styles.calendarButton}
									onPress={() =>
										key.name && key.name !== 'Off'
											? Alert.alert('Delete', `Are you sure you want to delete this ${'\n'}Appointment Time ${key.time} ${'\n'} with Client: ${key.name}`, [
													{text: 'Cancel'},
													{text: 'Delete Appointment', onPress: () => deleteAppointment(key.time)}
											  ])
											: key.name === 'Off'
											? Alert.alert('Delete Time Off', `Are you sure you want to remove ${'\n'} ${formattedDate} at ${key.time} from requested time off?`, [
													{text: 'Cancel'},
													{text: 'Delete Time Off', onPress: () => deleteAppointment(key.time)}
											  ])
											: null
									}
								/>
							}
							leftContent={
								key.name && key.name !== 'Off' ? (
									<Button
										title={key.strikes ? 'Strikes: ' + key.strikes : 'Add Strike'}
										icon={{
											name: 'add-circle',
											color: 'white'
										}}
										buttonStyle={styles.calendarButton}
										onPress={() =>
											Alert.alert('No Call No Show', `Would you like to add a strike to Account Name: ${key.name ? key.name : 'N/A'} ${'\n'}Account Id: ${key.userId ? key.userId : 'N/A'}`, [
												{
													text: 'Cancel'
												},
												{
													text: 'Add Strike',
													onPress: () => addStrike(key.userId, key.strikes)
												}
											])
										}
									/>
								) : (
									<Text>''</Text>
								)
							}
							onPress={() =>
								!key.name
									? props.navigation.navigate('AddAppointmentScreen', {
											formattedDate,
											time: [`${key.time}`]
									  })
									: key.name === 'Off'
									? Alert.alert('Time Off', `Would you like to schedule an appointment during your time off on ${formattedDate} at ${key.time}?`, [
											{text: 'Cancel'},
											{text: 'Schedule Appointment', onPress: () => props.navigation.navigate('AddAppointmentScreen', {formattedDate, time: [`${key.time}`]})}
									  ])
									: null
							}>
							<ListItem.Content>
								{key.name !== 'Off' && key.name ? (
									<>
										<View style={{flex: 1, flexDirection: 'row'}}>
											<View style={{flex: 1, alignSelf: 'center'}}>
												<ListItem.Title style={styles.text}>{key.time}</ListItem.Title>
											</View>
											<View
												style={{
													height: '100%',
													width: 1,
													backgroundColor: '#909090',
													marginRight: 5,
													marginLeft: 5
												}}></View>
											<View style={{flex: 2}}>
												<ListItem.Title style={styles.listItemTitle}>{key.name}</ListItem.Title>
												{key.friend !== '' && undefined && <ListItem.Title style={styles.listItemTitle}>'Friend: ' + key.friend</ListItem.Title>}
												<TouchableOpacity
													onPress={() =>
														Linking.openURL(`sms:${key?.phone}`).catch(() => {
															Linking.openURL(`sms:${key?.phone}`)
														})
													}>
													<ListItem.Subtitle style={styles.text}>{formatPhoneNumber(key?.phone) ? formatPhoneNumber(key?.phone) : key.phone}</ListItem.Subtitle>
												</TouchableOpacity>
											</View>
											<View style={{flex: 2}}>
												<ListItem.Subtitle style={{color: '#fff', textAlign: 'right'}}>{key?.haircutType === 'mens' ? "Men's Haircut" : key?.haircutType === 'kids' && "Kid's Haircut"}</ListItem.Subtitle>
												<ListItem.Subtitle style={{color: '#fff', textAlign: 'right'}}>{key.goatPoints ? `GP's: ` + key.goatPoints : `GP's: 0`}</ListItem.Subtitle>
											</View>
										</View>
										<View style={{flex: 1, flexDirection: 'row'}}>
											<View style={{flex: 1}}></View>
											<View
												style={{
													height: '100%',
													width: 1,
													backgroundColor: '#909090',
													marginRight: 5,
													marginLeft: 5
												}}></View>
											<View style={{flex: 4}}>
												<ListItem.Subtitle style={styles.text}>Comment: {key?.comment !== '' ? key.comment : 'N/A'}</ListItem.Subtitle>
											</View>
										</View>
									</>
								) : key.name === 'Off' ? (
									<View style={{flex: 1, flexDirection: 'row'}}>
										<View style={{flex: 1, alignSelf: 'center'}}>
											<ListItem.Title style={styles.text}>{key.time}</ListItem.Title>
										</View>
										<View
											style={{
												height: '100%',
												width: 1,
												backgroundColor: '#909090',
												marginRight: 5,
												marginLeft: 5
											}}></View>
										<View style={{flex: 4}}>
											<ListItem.Title style={{color: '#E8BD70', textAlign: 'right'}}>{key.name}</ListItem.Title>
										</View>
										<ListItem.Subtitle style={styles.text}>{key?.comment !== '' && undefined && 'Comment: ' + key.comment}</ListItem.Subtitle>
									</View>
								) : (
									!key.name && (
										<View style={{flex: 1, flexDirection: 'row'}}>
											<View style={{flex: 1, alignSelf: 'center'}}>
												<ListItem.Title style={styles.text}>{key.time}</ListItem.Title>
											</View>
											<View
												style={{
													height: '100%',
													width: 1,
													backgroundColor: '#909090',
													marginRight: 5,
													marginLeft: 5
												}}></View>
											<View style={{flex: 4}}>
												<ListItem.Title style={{color: '#E8BD70', textAlign: 'right'}}>Avaliable</ListItem.Title>
											</View>
										</View>
									)
								)}
							</ListItem.Content>
						</ListItem.Swipeable>
					))}
				</ScrollView>
			) : (
				isLoading === false &&
				calendarData === [] && (
					<ScrollView style={styles.scrollView}>
						<ListItem bottomDivider containerStyle={styles.listItemContainer}>
							<ListItem.Content>
								<ListItem.Title style={styles.listItemSubTitle}> No Appointments </ListItem.Title>
							</ListItem.Content>
						</ListItem>
					</ScrollView>
				)
			)}
		</View>
	)
}

const styles = createStyles()

const mapStateToProps = (store) => ({
	barber: store.userState.barber
})

export default connect(mapStateToProps, null)(Calendar)
