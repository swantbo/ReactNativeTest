import moment from 'moment'
import React, {useEffect, useState, useContext} from 'react'
import {View, SafeAreaView, ScrollView, ActivityIndicator, Alert, TouchableOpacity, Linking, KeyboardAvoidingView} from 'react-native'
import CalendarStrip from 'react-native-calendar-strip'
import {ListItem, Avatar} from 'react-native-elements'
import {insertDecimal, subtractDiscount, formatPhoneNumber, subtractPrice} from '../../utils/DataFormatting'

import createStyles from '../../styles/base'
import {InputField} from '../../components'

import {connect} from 'react-redux'

import * as firebase from 'firebase'
import Firebase from '../../config/firebase'
import {AuthenticatedUserContext} from '../../navigation/AuthenticatedUserProvider'

function Appointment(props) {
	const {user} = useContext(AuthenticatedUserContext)
	const [isLoading, setIsLoading] = useState(false)
	const [userData, setUserData] = useState({})
	const [barberInfo, setBarberInfo] = useState({})
	const [selectedDate, setSelectedDate] = useState()
	const [selectedTime, setSelectedTime] = useState('')
	const [calendarDatesRemoved, setCalendarDatesRemoved] = useState([])
	const [comment, onChangeComment] = useState('')
	const [friend, setFriend] = useState('')
	const [newTimes, setNewTimes] = useState({})
	const [haircutType, setHaircutType] = useState('mens')
	const [discount, setDiscount] = useState(false)

	const removeMonSun = () => {
		let dateArray = []
		let currentDate = moment()
		const stopDate = moment().add(30, 'days')
		while (currentDate <= stopDate) {
			if (moment(currentDate).format('dddd') == 'Sunday' || moment(currentDate).format('dddd') == 'Monday') {
				dateArray.push(moment(currentDate).format('YYYY-MM-DD'))
			}
			currentDate = moment(currentDate).add(1, 'days')
		}
		setCalendarDatesRemoved(dateArray)
	}

	const onDateSelected = (selectedDate) => {
		setIsLoading(true)
		setSelectedDate(selectedDate.format('YYYY-MM-DD'))
		splitHours(selectedDate)
	}

	const splitHours = (selectedDate) => {
		const weekDay = Promise.resolve(moment(selectedDate, 'YYYY-MM-DD HH:mm:ss').format('dddd').toString())
		Promise.all([weekDay]).then((values) => {
			createAvailableTimes(barberInfo[`${values}`], selectedDate)
		})
	}

	function createAvailableTimes(newWeekDay, selectedDate) {
		let arr = newWeekDay
		const newSplitString = arr
			.toUpperCase()
			.split('-')
			.map((item) => item.trim())
		const startTime = moment(newSplitString[0], 'HH:mm a')
		const endTime = moment(newSplitString[1], 'HH:mm a')
		let newIntervals = {}
		while (startTime <= endTime) {
			let newobj = {
				[moment(startTime, 'HH:mm a')
					.format('hh:mm A')
					.toString()
					.replace(/^(?:00:)?0?/, '')]: ''
			}
			newIntervals = {...newIntervals, ...newobj}
			startTime.add(30, 'minutes')
		}
		onGetData(selectedDate, newIntervals)
	}

	const onGetData = async (selectedDate, newIntervals) => {
		await Firebase.firestore()
			.collection('Calendar')
			.doc(moment(selectedDate).format('MMM YY'))
			.collection(moment(selectedDate).format('YYYY-MM-DD'))
			.get()
			.then((snapshot) => {
				let data = {}
				snapshot.forEach((doc) => {
					let newdata = {[doc.id]: 'Taken'}
					data = {...data, ...newdata}
				})
				const tempTimes = {...newIntervals, ...data}
				let newTime = {}
				if (tempTimes) {
					Object.entries(tempTimes).map((key, i) => {
						let tempTime = {}
						if (key[1] != 'Taken') {
							tempTime = {[key[0]]: key[1]}
						}
						newTime = {...newTime, ...tempTime}
					})
				} else {
					newTime = {tempTime}
				}
				setNewTimes(newTime)
				setIsLoading(false)
			})
	}

	const selectedTimeChange = (time) => {
		setSelectedTime(time)
	}

	const scheduleAppointment = async (selectedDate, selectedTime) => {
		const userAppointmentInfo = {
			name: userData.name,
			haircutType: haircutType,
			friend: friend,
			comment: comment,
			time: selectedTime,
			phone: userData.phone,
			goatPoints: discount != false ? userData.points : '',
			strikes: userData.strikes,
			userId: user.uid
		}

		const userRef = Firebase.firestore().collection('Calendar').doc(moment(selectedDate).format('MMM YY')).collection('OverView').doc('data')
		const increment = firebase.firestore.FieldValue.increment(1)

		userRef.update({
			goatPoints: discount != false ? firebase.firestore.FieldValue.increment(Number(userData.points)) : firebase.firestore.FieldValue.increment(0),
			haircuts: increment
		})

		await Firebase.firestore()
			.collection('Calendar')
			.doc(moment(selectedDate).format('MMM YY'))
			.collection(moment(selectedDate).format('YYYY-MM-DD'))
			.doc(selectedTime)
			.set(userAppointmentInfo, {merge: false})
			.then(() => {
				addAppointmentDataBase(selectedDate, selectedTime)
				Alert.alert('Appointment Scheduled', `Thanks ${userData.name}, your appointment has been scheduled`, [
					{
						text: 'Okay'
					}
				])
			})
			.catch((e) => {
				alert('Something went wrong try again', e)
			})
	}

	const addAppointmentDataBase = async (selectedDate, selectedTime) => {
		const appointmentData = {
			time: selectedTime,
			points: discount != false ? userData.points : '',
			haircutType: haircutType
		}
		await Firebase.firestore().collection('users').doc(user.uid).collection('Haircuts').doc(`${selectedDate} ${selectedTime}`).set(appointmentData, {merge: true})
		discount != false ? await Firebase.firestore().collection('users').doc(user.uid).set({points: '0'}, {merge: true}) : null
	}

	useEffect(() => {
		const {currentUser, barber} = props
		setUserData(currentUser)
		setBarberInfo(barber)
		removeMonSun()
	}, [props])

	return (
		<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
			<ListItem bottomDivider containerStyle={styles.avatarBackground}>
				<ListItem.Content>
					<View style={{flexDirection: 'row'}}>
						<View style={styles.rowStart}>
							<ListItem.Title style={styles.text}>
								{selectedDate ? moment(selectedDate).format('ddd, MMM Do YYYY') + ' ' : 'Select Date & '}
								{selectedTime ? '@ ' + selectedTime : 'Select Time'}
							</ListItem.Title>
							<ListItem.Title style={styles.text}>{haircutType === 'mens' ? "Men's Haircut " : "Kid's Haircut "}</ListItem.Title>
							<TouchableOpacity style={styles.goldButton} onPress={() => (discount === false && userData.points != 0 ? setDiscount(true) : setDiscount(false))}>
								<ListItem.Title style={styles.buttonTitle}>Goat Points: {userData.points}</ListItem.Title>
							</TouchableOpacity>
						</View>
						<View style={styles.rowEnd}>
							<ListItem.Title style={styles.text}>{haircutType === 'mens' ? barberInfo.price : barberInfo.kidsHaircut}</ListItem.Title>
							<ListItem.Title style={styles.text}>
								<ListItem.Title style={styles.text}>{discount != false ? '-$' + insertDecimal(userData.points) : ' '}</ListItem.Title>
							</ListItem.Title>
							<TouchableOpacity style={styles.goldButton} onPress={() => scheduleAppointment(selectedDate, selectedTime)}>
								<ListItem.Title style={styles.buttonTitle}>
									Book{' '}
									{discount != false ? '$' + subtractDiscount(haircutType, haircutType === 'kids' ? barberInfo.kidsHaircut : barberInfo.price, userData.points) : haircutType === 'mens' ? barberInfo.price : barberInfo.kidsHaircut}
								</ListItem.Title>
							</TouchableOpacity>
						</View>
					</View>
				</ListItem.Content>
			</ListItem>
			<ScrollView>
				<View>
					<ListItem containerStyle={styles.listItemContainerBlack}>
						<ListItem.Content>
							<ListItem.Title style={styles.goldTitle}>Appointment Type</ListItem.Title>
							<ListItem.CheckBox containerStyle={styles.checkBox} textStyle={{color: '#fff'}} title="Men's Haircut" checked={haircutType === 'mens' ? true : false} onPress={() => setHaircutType('mens')} />
							<ListItem.CheckBox containerStyle={styles.checkBox} textStyle={styles.text} title="Kid's Haircut" checked={haircutType === 'kids' ? true : false} onPress={() => setHaircutType('kids')} />
						</ListItem.Content>
					</ListItem>
					<CalendarStrip
						scrollable
						style={{
							height: 100,
							padding: 5
						}}
						calendarHeaderStyle={styles.goldTitle}
						calendarColor={'#121212'}
						dateNumberStyle={{color: 'white'}}
						dateNameStyle={{color: 'white'}}
						iconContainer={{flex: 0.1}}
						highlightDateNameStyle={{color: 'white'}}
						highlightDateNumberStyle={{fontWeight: 'bold', color: 'white'}}
						highlightDateContainerStyle={styles.socialIcons}
						startingDate={moment()}
						minDate={moment()}
						maxDate={moment().add(30, 'days')}
						selectedDate={selectedDate}
						onDateSelected={onDateSelected}
						datesBlacklist={calendarDatesRemoved}
					/>

					{!isLoading && Object.keys(newTimes).length !== 0 ? (
						<ScrollView horizontal={true} style={{}}>
							{Object.entries(newTimes).map((onekey, i) => (
								<ListItem bottomDivider containerStyle={styles.listItemContainerBlack} key={i} onPress={() => selectedTimeChange(onekey[0])}>
									<ListItem.Content style={styles.listItemContent}>
										<ListItem.Title style={{fontWeight: 'bold'}}>{onekey[1] ? null : onekey[0]}</ListItem.Title>
									</ListItem.Content>
								</ListItem>
							))}
						</ScrollView>
					) : isLoading ? (
						<ScrollView horizontal={true} style={styles.scrollViewAppointment}>
							<ListItem bottomDivider containerStyle={styles.listItemContainerBlack}>
								<ListItem.Content style={styles.listItemContent}>
									<ActivityIndicator color='#fff' size='large' />
								</ListItem.Content>
							</ListItem>
						</ScrollView>
					) : (
						Object.keys(newTimes).length == 0 && (
							<ScrollView horizontal={true} style={styles.scrollViewAppointment}>
								<ListItem bottomDivider containerStyle={styles.listItemContainerBlack}>
									<ListItem.Content style={styles.listItemContent}>
										<ListItem.Title style={styles.buttonTitle}>No Available Times</ListItem.Title>
									</ListItem.Content>
								</ListItem>
							</ScrollView>
						)
					)}
				</View>
				<View>
					<ListItem bottomDivider containerStyle={styles.listItemContainerBlack}>
						<ListItem.Content>
							<ListItem.Title style={styles.goldTitle}>For a Friend?</ListItem.Title>
							<InputField containerStyle={styles.inputField} leftIcon='account-plus' placeholder='Friends Name' autoCapitalize='words' value={friend} onChangeText={(text) => setFriend(text)} />
							<ListItem.Title style={styles.goldTitle}>Comments</ListItem.Title>
							<InputField containerStyle={styles.inputField} leftIcon='comment' placeholder='Comment (optional)' autoCapitalize='sentences' value={comment} onChangeText={(text) => onChangeComment(text)} />
						</ListItem.Content>
					</ListItem>
				</View>
				<View></View>
			</ScrollView>
		</KeyboardAvoidingView>
	)
}

const styles = createStyles()

const mapStateToProps = (store) => ({
	currentUser: store.userState.currentUser,
	appointments: store.userState.appointments,
	barber: store.userState.barber
})

export default connect(mapStateToProps, null)(Appointment)
