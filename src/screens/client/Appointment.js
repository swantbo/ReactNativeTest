import moment from 'moment'
import React, {useEffect, useState, useContext} from 'react'
import {SafeAreaView, ScrollView, ActivityIndicator, Alert, TouchableOpacity, RefreshControl, KeyboardAvoidingView} from 'react-native'
import CalendarStrip from 'react-native-calendar-strip'
import {ListItem} from 'react-native-elements'
import {insertDecimal, subtractDiscount, formatPhoneNumber, subtractPrice} from '../../utils/DataFormatting'

import {Button, Center, Input, View, VStack, Heading, HStack, FlatList, Box, Text, Spacer} from 'native-base'

import createStyles from '../../styles/base'
import {InputField} from '../../components'

import {connect} from 'react-redux'
import {reload} from '../../redux/actions'
import * as firebase from 'firebase'
import Firebase from '../../config/firebase'
import {AuthenticatedUserContext} from '../../navigation/AuthenticatedUserProvider'
import {bindActionCreators} from 'redux'

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
				let tempTime = []
				if (tempTimes) {
					Object.entries(tempTimes).map((key, i) => {
						if (key[1] != 'Taken') {
							tempTime.push([key[0]])
						}
					})
				} else {
					tempTime.push(tempTimes)
				}
				setNewTimes(tempTime)
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
		<View flex={1} bgColor={'#000'}>
			<VStack bgColor={'#000'}>
				<Box bgColor={'#121212'} pl='4' pr='4' py='2'>
					<HStack space={2} justifyContent='space-between'>
						<VStack alignItems={'flex-start'}>
							<Heading size={'sm'}>
								{selectedDate ? moment(selectedDate).format('ddd, MMM Do YYYY') + ' ' : 'Select Date & '}
								{selectedTime ? '@ ' + selectedTime : 'Select Time'}
							</Heading>
							<Text fontSize='md'>{haircutType === 'mens' ? "Men's Haircut " : "Kid's Haircut "}</Text>
							<Button bgColor={'#E8BD70'} onPress={() => (discount === false && userData?.points != 0 ? setDiscount(true) : setDiscount(false))}>
								<Text fontSize='md' color={'#000'} bold>
									Goat Points: {userData?.points}
								</Text>
							</Button>
						</VStack>
						<VStack>
							<Heading size={'sm'} alignSelf='flex-end'>
								{haircutType === 'mens' ? barberInfo?.price : barberInfo?.kidsHaircut}
							</Heading>
							<Text fontSize='md' alignSelf='flex-end'>
								{discount != false ? '-$' + insertDecimal(userData?.points) : ' '}
							</Text>
							<Button bgColor={'#E8BD70'} size={'sm'} onPress={() => scheduleAppointment(selectedDate, selectedTime)}>
								<Text fontSize='md' color={'#000'} bold>
									Book{' '}
									{discount != false
										? '$' + subtractDiscount(haircutType, haircutType === 'kids' ? barberInfo?.kidsHaircut : barberInfo?.price, userData?.points)
										: haircutType === 'mens'
										? barberInfo?.price
										: barberInfo?.kidsHaircut}
								</Text>
							</Button>
						</VStack>
					</HStack>
				</Box>
				<CalendarStrip
					scrollable
					style={{
						height: 100,
						padding: 5
					}}
					calendarHeaderStyle={{color: '#E8BD70', fontSize: '18'}}
					calendarColor={'#000'}
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
				{!isLoading && newTimes.length !== 0 ? (
					<FlatList
						horizontal
						data={newTimes}
						renderItem={({item}) => (
							<Box bgColor={'#E8BD70'} borderRadius={'10'} m={'5'}>
								<Text onPress={() => selectedTimeChange(item)} color={'#000'} fontSize={'md'} p={'1'} bold>
									{item}
								</Text>
							</Box>
						)}
						keyExtractor={(item) => item}
					/>
				) : isLoading ? (
					<Center>
						<Box bgColor={'#E8BD70'} borderRadius={'10'} p={'1'}>
							<ActivityIndicator color='#fff' size='large' />
						</Box>
					</Center>
				) : (
					newTimes.length == 0 && (
						<Box bgColor={'#E8BD70'} borderRadius={'10'} m={'5'}>
							<Text color={'#000'} fontSize={'md'} p={'1'} bold>
								No Appointments Available
							</Text>
						</Box>
					)
				)}
				<Box p={'5'}>
					<Heading size={'sm'} color={'#E8BD70'}>
						Appoinment Type
					</Heading>
					<ListItem.CheckBox containerStyle={styles.checkBox} textStyle={{color: '#fff'}} title="Men's Haircut" checked={haircutType === 'mens' ? true : false} onPress={() => setHaircutType('mens')} />
					<ListItem.CheckBox containerStyle={styles.checkBox} textStyle={styles.text} title="Kid's Haircut" checked={haircutType === 'kids' ? true : false} onPress={() => setHaircutType('kids')} />
				</Box>

				<Box pl={'5'} pr={'5'}>
					<Heading pb={'2'} size={'sm'} color={'#E8BD70'}>
						For a Friend?
					</Heading>
					<Input placeholder="Friend's Name (Optional)" borderColor={'#fff'} placeholderTextColor={'#fff'} fontSize={'md'} p={'3'} value={friend} onChangeText={(text) => setFriend(text)} />
					<Heading pb={'2'} pt={'2'} size={'sm'} color={'#E8BD70'}>
						Comment?
					</Heading>
					<Input placeholder='Comment (Optional)' borderColor={'#fff'} placeholderTextColor={'#fff'} fontSize={'md'} p={'3'} value={comment} onChangeText={(text) => onChangeComment(text)} />
				</Box>
			</VStack>
		</View>
	)
}

const styles = createStyles()

const mapStateToProps = (store) => ({
	currentUser: store.userState.currentUser,
	appointments: store.userState.appointments,
	barber: store.userState.barber
})

const mapDispatchProps = (dispatch) => bindActionCreators({reload}, dispatch)

export default connect(mapStateToProps, mapDispatchProps)(Appointment)
