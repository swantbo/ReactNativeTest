import React, {useEffect, useState, useContext} from 'react'
import {Alert} from 'react-native'
import {
	ScrollView,
	Center,
	VStack,
	Heading,
	HStack,
	Box,
	Text,
	Input,
	Button,
	KeyboardAvoidingView
} from 'native-base'
import moment from 'moment'
import {CalendarList} from 'react-native-calendars'
import DateTimePicker from '@react-native-community/datetimepicker'
import {AuthenticatedUserContext} from '../../navigation/AuthenticatedUserProvider'

import Firebase from '../../config/firebase'

function Off() {
	const {user} = useContext(AuthenticatedUserContext)
	const [startTime, setStartTime] = useState(
		new Date('2020-08-22T05:00:00.000Z')
	)
	const [endTime, setEndTime] = useState(new Date('2020-08-22T17:00:00.000Z'))
	const [isStartPickerShow, setIsStartPickerShow] = useState(false)
	const [isEndPickerShow, setIsEndPickerShow] = useState(false)
	const [comment, onChangeComment] = useState('')
	const [markedDates, setMarkedDates] = useState({})
	const [startDate, setStartDate] = useState()
	const [endDate, setEndDate] = useState()

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

	const showStartPicker = () => {
		isStartPickerShow === true
			? setIsStartPickerShow(false)
			: setIsStartPickerShow(true)
	}

	const showEndPicker = () => {
		isEndPickerShow === true
			? setIsEndPickerShow(false)
			: setIsEndPickerShow(true)
	}

	async function createAvailableTimes(startDate, endDate) {
		if (
			moment(startDate).format('YYYY-MM-DD') ===
			moment(endDate).format('YYYY-MM-DD')
		) {
			const calendarObject = {
				time: `${moment(startTime).format('hh:mm A')} - ${moment(
					endTime
				).format('hh:mm A')}`,
				comment: comment
			}
			try {
				Firebase.firestore()
					.collection('Calendar')
					.doc(
						moment(startDate.toLocaleDateString()).format('MMM YY')
					)
					.collection(moment(startDate).format('YYYY-MM-DD'))
					.doc('Off')
					.set(calendarObject, {merge: true})
					.then(() => {
						Alert.alert(
							'Time Off Scheduled',
							`Your time off has been scheduled for ${moment(
								startDate
							).format('YYYY-MM-DD')} from ${[
								moment(startTime)
									.format('hh:mm A')
									.toString()
									.replace(/^(?:00:)?0?/, '')
							]} - ${[
								moment(endTime)
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
					})
			} catch (error) {
				Alert.alert(
					'Error',
					`Unable to schedule time off, try again. ${error}`
				)
			}
		} else {
			const currDate = startDate
			let dates = {}
			while (
				moment(startDate).format('YYYY-MM-DD') <=
				moment(endDate).format('YYYY-MM-DD')
			) {
				dates = {
					...dates,
					[moment(currDate).format('YYYY-MM-DD')]: ''
				}
				currDate.setDate(currDate.getDate() + 1)
			}
			const calendarObject = {
				time: '12:00 AM - 12:00 PM',
				comment: comment
			}
			try {
				Object.entries(dates).map((dateKey, i) => {
					Firebase.firestore()
						.collection('Calendar')
						.doc(moment(dateKey[0]).format('MMM YY'))
						.collection(moment(dateKey[0]).format('YYYY-MM-DD'))
						.doc('Off')
						.set(calendarObject, {merge: true})
				})
				Alert.alert(
					'Time Off Scheduled',
					`Your time off has been scheduled for ${moment(
						startDate
					).format('YYYY-MM-DD')} - ${moment(endDate).format(
						'YYYY-MM-DD'
					)}`,
					[
						{
							text: 'Okay'
						}
					]
				)
			} catch (error) {
				Alert.alert(
					'Error',
					`Unable to schedule time off, try again. ${error}`
				)
			}
		}
	}

	const onDaySelect = (day) => {
		const selectedDay = moment(day.dateString).format('YYYY-MM-DD')
		let selected = true
		if (markedDates[selectedDay]) {
			const removeMarkedDate = {...markedDates}
			delete removeMarkedDate[selectedDay]
			setMarkedDates(removeMarkedDate)
			minAndMaxDate(removeMarkedDate)
		} else {
			const updatedMarkedDates = {
				...markedDates,
				...{[selectedDay]: {selected}}
			}
			setMarkedDates(updatedMarkedDates)
			minAndMaxDate(updatedMarkedDates)
		}
	}

	const minAndMaxDate = (markedDates) => {
		let moments = Object.keys(markedDates).map((d) => moment(d))
		const maxDate = moment.max(moments)
		const minDate = moment.min(moments)
		setStartDate(minDate.format('YYYY-MM-DD'))
		setEndDate(maxDate.format('YYYY-MM-DD'))
	}

	useEffect(() => {}, [])

	return (
		<VStack flex={1} bgColor={'#000'}>
			<KeyboardAvoidingView behavior='position'>
				<ScrollView>
					<CalendarList
						horizontal={true}
						pagingEnabled={true}
						onDayPress={onDaySelect}
						markedDates={markedDates}
					/>

					<Box bgColor={'#121212'} m={3} p={3} borderRadius={'10'}>
						<Heading color={'#E8BD70'} fontSize={'lg'}>
							Days
						</Heading>
						<HStack m={2}>
							<VStack flex={1}>
								<Center>
									<Heading fontSize={'lg'}>
										Start Date
									</Heading>
									<Text fontSize={'md'}>
										{moment(startDate)?.format(
											'ddd, MMM Do YYYY'
										)}
									</Text>
								</Center>
							</VStack>
							<VStack flex={1}>
								<Center>
									<Heading fontSize={'lg'}>End Date</Heading>
									<Text fontSize={'md'}>
										{moment(endDate)?.format(
											'ddd, MMM Do YYYY'
										)}
									</Text>
								</Center>
							</VStack>
						</HStack>
						{startDate === endDate && (
							<>
								<Heading color={'#E8BD70'} fontSize={'lg'}>
									Time
								</Heading>
								<HStack m={2}>
									<VStack flex={1}>
										<Center>
											<Heading fontSize={'lg'}>
												Start Time
											</Heading>
											<Text
												fontSize={'md'}
												onPress={showStartPicker}>
												{moment(startTime).format(
													'hh:mm A'
												)}
											</Text>
										</Center>
									</VStack>
									<VStack flex={1}>
										<Center>
											<Heading fontSize={'lg'}>
												End Time
											</Heading>
											<Text
												fontSize={'md'}
												onPress={showEndPicker}>
												{moment(endTime).format(
													'hh:mm A'
												)}
											</Text>
										</Center>
									</VStack>
								</HStack>
							</>
						)}
						{isStartPickerShow && (
							<DateTimePicker
								style={{backgroundColor: 'white'}}
								textColor='#fff'
								value={startTime}
								mode='time'
								display={
									Platform.OS === 'ios'
										? 'spinner'
										: 'default'
								}
								onChange={onStartTimeChange}
								is24Hour={true}
								minuteInterval={30}
							/>
						)}

						{isEndPickerShow && (
							<DateTimePicker
								textColor='#fff'
								value={endTime}
								mode='time'
								display={
									Platform.OS === 'ios'
										? 'spinner'
										: 'default'
								}
								onChange={onEndTimeChange}
								is24Hour={true}
								minuteInterval={30}
							/>
						)}
						<Heading color={'#E8BD70'} fontSize={'lg'}>
							Comment
						</Heading>
						<Input
							placeholder='Comment (Optional)'
							borderColor={'#fff'}
							placeholderTextColor={'#fff'}
							size={'md'}
							p={'3'}
							mt={2}
							value={comment}
							onChangeText={(text) => onChangeComment(text)}
						/>

						<Button
							bgColor={'#E8BD70'}
							borderRadius={20}
							my={5}
							p={2}
							onPress={() =>
								createAvailableTimes(startDate, endDate)
							}>
							<Text
								bold
								fontSize={'xl'}
								alignSelf={'center'}
								color={'#000'}>
								Schedule
							</Text>
						</Button>
					</Box>
				</ScrollView>
			</KeyboardAvoidingView>
		</VStack>
	)
}

export default Off
