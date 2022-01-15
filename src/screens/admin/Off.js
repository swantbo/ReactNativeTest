import React, {useEffect, useState, useContext} from 'react'
import {View, Alert, TouchableOpacity, Linking} from 'react-native'
import {Avatar, ScrollView, Center, VStack, Heading, HStack, Box, Text, Spacer} from 'native-base'
import moment from 'moment'
import {Card, ListItem} from 'react-native-elements'
import DateTimePicker from '@react-native-community/datetimepicker'
import {formatPhoneNumber} from '../../utils/DataFormatting'

import {InputField} from '../../components'
import {AuthenticatedUserContext} from '../../navigation/AuthenticatedUserProvider'

import {connect} from 'react-redux'
import createStyles from '../../styles/base'
import Firebase from '../../config/firebase'

function Off(props) {
	const {user} = useContext(AuthenticatedUserContext)
	const [startTime, setStartTime] = useState(new Date('2020-08-22T05:00:00.000Z'))
	const [endTime, setEndTime] = useState(new Date('2020-08-22T17:00:00.000Z'))
	const [startDate, setStartDate] = useState(new Date())
	const [endDate, setEndDate] = useState(new Date())
	const [date, onChangeDate] = useState(null)
	const [isStartPickerShow, setIsStartPickerShow] = useState(false)
	const [isEndPickerShow, setIsEndPickerShow] = useState(false)
	const [isStartDatePickerShow, setIsStartDatePickerShow] = useState(false)
	const [isEndDatePickerShow, setIsEndDatePickerShow] = useState(false)
	const [barberInfo, setBarberInfo] = useState({})
	const [timeOffType, setTimeOffType] = useState('multiple')
	const [text, onChangeText] = useState('')

	const onStartTimeChange = (event, selectedTime) => {
		const currentTime = selectedTime || new date()
		setStartTime(currentTime)
		setIsStartPickerShow(Platform.OS === 'ios' ? true : false)
	}

	const onEndTimeChange = (event, newTime) => {
		const currentTime = newTime || new date()
		setEndTime(currentTime)
		setIsEndPickerShow(Platform.OS === 'ios' ? true : false)
	}

	const onStartDateChange = (event, selectedDate) => {
		const currentDate = selectedDate || new date()
		setStartDate(currentDate)
		if (timeOffType !== 'multiple') {
			setEndDate(currentDate)
		}
		setIsStartDatePickerShow(Platform.OS === 'ios' ? true : false)
	}

	const onEndDateChange = (event, selectedDate) => {
		const currentDate = selectedDate || new date()
		setEndDate(currentDate)
		setIsEndDatePickerShow(Platform.OS === 'ios' ? true : false)
	}

	const showStartPicker = () => {
		isStartPickerShow === true ? setIsStartPickerShow(false) : setIsStartPickerShow(true)
	}

	const showEndPicker = () => {
		isEndPickerShow === true ? setIsEndPickerShow(false) : setIsEndPickerShow(true)
	}

	const showStartDatePicker = () => {
		isStartDatePickerShow === true ? setIsStartDatePickerShow(false) : setIsStartDatePickerShow(true)
	}

	const showEndDatePicker = () => {
		isEndDatePickerShow === true ? setIsEndDatePickerShow(false) : setIsEndDatePickerShow(true)
	}

	async function createAvailableTimes(sTime, eTime) {
		if (moment(startDate).format('YYYY-MM-DD') === moment(endDate).format('YYYY-MM-DD')) {
			let startTime, endTime, tempTime
			if (timeOffType === 'half') {
				tempTime = moment(sTime, 'HH:mm a')
				startTime = moment(sTime, 'HH:mm a')
				endTime = moment(eTime, 'HH:mm a')
			}
			if (timeOffType === 'full') {
				tempTime = moment('8:00 am', 'HH:mm a')
				startTime = moment('8:00 am', 'HH:mm a')
				endTime = moment('9:00 pm', 'HH:mm a')
			}
			let newIntervals = {}
			while (tempTime <= endTime) {
				let newobj = {
					[moment(tempTime, 'HH:mm a')
						.format('hh:mm A')
						.toString()
						.replace(/^(?:00:)?0?/, '')]: {
						name: 'Off',
						comment: text
					}
				}
				newIntervals = {...newIntervals, ...newobj}
				tempTime.add(30, 'minutes')
			}
			try {
				Object.entries(newIntervals).map((key, i) => {
					let tempData = {
						...key[1],
						time: key[0],
						...key[2]
					}
					Firebase.firestore().collection('Calendar').doc(moment(startDate.toLocaleDateString()).format('MMM YY')).collection(moment(startDate).format('YYYY-MM-DD')).doc(key[0]).set(tempData, {merge: true})
				})
				{
					timeOffType === 'full'
						? Alert.alert('Time Off Scheduled', `Your time off has been scheduled for all day on ${moment(startDate).format('YYYY-MM-DD')} `, [
								{
									text: 'Okay'
								}
						  ])
						: Alert.alert(
								'Time Off Scheduled',
								`Your time off has been scheduled for ${moment(startDate).format('YYYY-MM-DD')} from ${[
									moment(startTime, 'HH:mm a')
										.format('hh:mm A')
										.toString()
										.replace(/^(?:00:)?0?/, '')
								]} - ${[
									moment(endTime, 'HH:mm a')
										.format('hh:mm A')
										.toString()
										.replace(/^(?:00:)?0?/, '')
								]}`,
								[
									{
										text: 'Okay'
									}
								]
						  )
				}
			} catch (error) {
				Alert.alert('Error', `Unable to schedule time off, try again. ${error}`)
			}
		} else {
			const currDate = startDate
			let dates = {}
			while (moment(startDate).format('YYYY-MM-DD') <= moment(endDate).format('YYYY-MM-DD')) {
				dates = {
					...dates,
					[moment(currDate).format('YYYY-MM-DD')]: ''
				}
				currDate.setDate(currDate.getDate() + 1)
			}
			const start = moment('8:00 am', 'HH:mm a')
			const end = moment('9:00 pm', 'HH:mm a')
			let newIntervals = {}
			while (start <= end) {
				let newobj = {
					[moment(start, 'HH:mm a')
						.format('hh:mm A')
						.toString()
						.replace(/^(?:00:)?0?/, '')]: {
						name: 'Off',
						comment: text
					}
				}
				newIntervals = {...newIntervals, ...newobj}
				start.add(30, 'minutes')
			}
			try {
				Object.entries(dates).map((dateKey, i) => {
					Object.entries(newIntervals).map((key, i) => {
						let tempData = {
							...key[1],
							time: key[0],
							...key[2]
						}
						Firebase.firestore().collection('Calendar').doc(moment(dateKey[0]).format('MMM YY')).collection(moment(dateKey[0]).format('YYYY-MM-DD')).doc(key[0]).set(tempData, {merge: true})
					})
				})
				Alert.alert('Time Off Scheduled', `Your time off has been scheduled for ${moment(startDate).format('YYYY-MM-DD')} - ${moment(endDate).format('YYYY-MM-DD')}`, [
					{
						text: 'Okay'
					}
				])
			} catch (error) {
				Alert.alert('Error', `Unable to schedule time off, try again. ${error}`)
			}
		}
	}

	useEffect(() => {
		const {barber} = props
		setBarberInfo(barber)
	}, [props])

	const selectedTimeOffType = (selectedTimeOff) => {
		setTimeOffType(selectedTimeOff)
		if (selectedTimeOff !== 'half') {
			setStartTime(new Date('2020-08-22T17:00:00.000Z'))
			setEndTime(new Date('2020-08-22T05:00:00.000Z'))
		}
	}

	return (
		<ScrollView bgColor={'#000'}>
			<HStack bgColor={'#121212'}>
				<VStack p={2}>
					<Avatar source={require('../../assets/123_1.jpeg')} size={'lg'}></Avatar>
				</VStack>
				<VStack m={2}>
					<Text fontSize={'md'}>{barberInfo.name}</Text>
					<Text
						fontSize={'sm'}
						onPress={() =>
							Linking.openURL(`sms:${barberInfo?.phone}`).catch(() => {
								Linking.openURL(`sms:${barberInfo?.phone}`)
							})
						}>
						{barberInfo.phone != '' ? formatPhoneNumber(barberInfo.phone) : ''}
					</Text>
					<Text
						fontSize={'sm'}
						onPress={() =>
							Linking.openURL('maps://app?saddr=&daddr=43.0218740049977+-87.9119389619647').catch(() => {
								Linking.openURL('google.navigation:q=43.0218740049977+-87.9119389619647')
							})
						}>
						{barberInfo.location != '' ? barberInfo.location : ''}
					</Text>
				</VStack>
			</HStack>

			<Box bgColor={'#121212'} m={3} p={3} borderRadius={'10'}>
				<Heading color={'#E8BD70'} fontSize={'lg'}>
					Time Off
				</Heading>
				<ListItem.CheckBox containerStyle={styles.checkBox} textStyle={{color: '#fff'}} title='Mutiple-Days' checked={timeOffType === 'multiple' ? true : false} onPress={() => selectedTimeOffType('multiple')} />
				<ListItem.CheckBox containerStyle={styles.checkBox} textStyle={{color: '#fff'}} title='Full-Day' checked={timeOffType === 'full' ? true : false} onPress={() => selectedTimeOffType('full')} />

				<ListItem.CheckBox containerStyle={styles.checkBox} textStyle={{color: '#fff'}} title='Half-Day' checked={timeOffType === 'half' ? true : false} onPress={() => selectedTimeOffType('half')} />
			</Box>

			<Box bgColor={'#121212'} m={3} p={3} borderRadius={'10'}>
				<Heading color={'#E8BD70'} fontSize={'lg'}>
					Day & Time
				</Heading>
				<View style={styles.pickedDateContainer}>
					{timeOffType === 'multiple' ? (
						<>
							<View style={styles.alignContentLeft}>
								<Text style={styles.alignTextCenter}>Start Date</Text>
								<Text style={[isStartDatePickerShow === true ? styles.pickedDatePressed : styles.pickedDate]} onPress={showStartDatePicker}>
									{moment(startDate).format('YYYY-MM-DD')}
								</Text>
							</View>
							<View style={styles.alignContentLeft}>
								<Text style={styles.alignTextCenter}>End Date</Text>
								<Text style={[isEndDatePickerShow === true ? styles.pickedDatePressed : styles.pickedDate]} onPress={showEndDatePicker}>
									{moment(endDate).format('YYYY-MM-DD')}
								</Text>
							</View>
						</>
					) : (
						<View style={styles.alignContentLeft}>
							<Text style={styles.alignTextCenter}>Date</Text>
							<Text style={[isStartDatePickerShow === true ? styles.pickedDatePressed : styles.pickedDate]} onPress={showStartDatePicker}>
								{moment(startDate).format('YYYY-MM-DD')}
							</Text>
						</View>
					)}
				</View>

				{isStartDatePickerShow && <DateTimePicker style={{backgroundColor: '#121212'}} textColor='#fff' value={startDate} mode='date' display={Platform.OS === 'ios' ? 'spinner' : 'default'} onChange={onStartDateChange} minuteInterval={30} />}

				{isEndDatePickerShow && <DateTimePicker style={{backgroundColor: 'white'}} textColor='#fff' value={endDate} mode='date' display={Platform.OS === 'ios' ? 'spinner' : 'default'} onChange={onEndDateChange} minuteInterval={30} />}

				<View style={styles.pickedDateContainer}>
					{timeOffType === 'half' && (
						<>
							<View style={styles.alignContentLeft}>
								<Text style={styles.alignTextCenter}>Start Time</Text>
								<Text style={[isStartPickerShow === true ? styles.pickedDatePressed : styles.pickedDate]} onPress={showStartPicker}>
									{moment(startTime).format('hh:mm A')}
								</Text>
							</View>
							<View style={styles.alignContentLeft}>
								<Text style={styles.alignTextCenter}>End Time</Text>
								<Text style={[isEndPickerShow === true ? styles.pickedDatePressed : styles.pickedDate]} onPress={showEndPicker}>
									{moment(endTime).format('hh:mm A')}
								</Text>
							</View>
						</>
					)}
				</View>

				{isStartPickerShow && (
					<DateTimePicker style={{backgroundColor: 'white'}} textColor='#fff' value={startTime} mode='time' display={Platform.OS === 'ios' ? 'spinner' : 'default'} onChange={onStartTimeChange} is24Hour={true} minuteInterval={30} />
				)}

				{isEndPickerShow && <DateTimePicker textColor='#fff' value={endTime} mode='time' display={Platform.OS === 'ios' ? 'spinner' : 'default'} onChange={onEndTimeChange} is24Hour={true} minuteInterval={30} />}
				<Heading color={'#E8BD70'} fontSize={'lg'}>
					Comment
				</Heading>

				<InputField containerStyle={styles.inputField} leftIcon='comment' placeholder='Comment (optional)' autoCapitalize='sentences' value={text} onChangeText={(text) => onChangeText(text)} />

				<TouchableOpacity
					style={{
						backgroundColor: '#E8BD70',
						borderRadius: 5,
						padding: 10
					}}
					onPress={() => createAvailableTimes(startTime, endTime)}>
					<ListItem.Title
						style={{
							color: '#000',
							alignSelf: 'center',
							fontWeight: 'bold'
						}}>
						Schedule Time Off
					</ListItem.Title>
				</TouchableOpacity>
			</Box>
		</ScrollView>
	)
}

const styles = createStyles()

const mapStateToProps = (store) => ({
	barber: store.userState.barber
})

export default connect(mapStateToProps, null)(Off)
