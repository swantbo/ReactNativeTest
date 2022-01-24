import React, {useEffect, useState} from 'react'
import {
	Center,
	VStack,
	Box,
	Text,
	Button,
	Input,
	Heading,
	ScrollView
} from 'native-base'
import CalendarStrip from 'react-native-calendar-strip'

import moment from 'moment'
import Firebase from '../../config/firebase'
import * as firebase from 'firebase'

import DateTimePicker from '@react-native-community/datetimepicker'
import {useFormik} from 'formik'
import * as Yup from 'yup'

const phoneRegExp =
	/^(?:(?:\(?(?:00|\+)([1-4]\d\d|[1-9]\d?)\)?)?[\-\.\ \\\/]?)?((?:\(?\d{1,}\)?[\-\.\ \\\/]?){0,})(?:[\-\.\ \\\/]?(?:#|ext\.?|extension|x)[\-\.\ \\\/]?(\d+))?$/i

const addAppointmentSchema = Yup.object().shape({
	name: Yup.string().max(30).required('Required'),
	phone: Yup.string().matches(phoneRegExp, 'Phone number is not valid'),
	comment: Yup.string().max(30)
})

const Add = ({route}) => {
	const [selectedDate, setSelectedDate] = useState(moment())
	const [startTime, setStartTime] = useState(
		new Date('2020-08-22T05:00:00.000Z')
	)
	const [isStartPickerShow, setIsStartPickerShow] = useState(false)

	const onStartTimeChange = (event, selectedTime) => {
		const currentTime = selectedTime || new date()
		setStartTime(currentTime)
		setIsStartPickerShow(Platform.OS === 'ios' ? true : false)
	}

	const showStartPicker = () => {
		isStartPickerShow === true
			? setIsStartPickerShow(false)
			: setIsStartPickerShow(true)
	}

	const {handleChange, handleBlur, handleSubmit, values, errors, touched} =
		useFormik({
			validationSchema: addAppointmentSchema,
			initialValues: {
				name: '',
				phone: '',
				comment: ''
			},
			enableReinitialize: true,
			onSubmit: (values) => onHandleAddAppointment(values)
		})

	const onHandleAddAppointment = (values) => {
		const userAppointmentInfo = {
			name: values.name,
			comment: values.comment,
			time: startTime,
			phone: values.phone
		}
		Firebase.firestore()
			.collection('Calendar')
			.doc(moment(selectedDate).format('MMM YY'))
			.collection(moment(selectedDate).format('YYYY-MM-DD'))
			.doc(
				moment(startTime, 'HH:mm a')
					.format('hh:mm A')
					.toString()
					.replace(/^(?:00:)?0?/, '')
			)
			.set(userAppointmentInfo, {merge: true})
			.then(() => {
				alert(
					`The appointment for ${
						values.name
					} has been scheduled on ${moment(selectedDate).format(
						'ddd, MMM Do YYYY'
					)} @ ${moment(startTime, 'HH:mm a')
						.format('hh:mm A')
						.toString()}`
				)
			})
			.catch((error) => {
				alert('Something went wrong try again')
			})

		const userRef = Firebase.firestore()
			.collection('Calendar')
			.doc(moment(selectedDate).format('MMM YY'))
			.collection('OverView')
			.doc('data')
		const increment = firebase.firestore.FieldValue.increment(1)

		userRef.update({
			haircuts: increment
		})
	}

	useEffect(() => {
		setSelectedDate(moment())
		const {formattedDate, time} = route.params ? route.params : ''
		formattedDate ? setSelectedDate(formattedDate) : ''
	}, [])

	return (
		<VStack flex={1} bgColor={'#000'}>
			<CalendarStrip
				scrollable
				style={{height: 100, paddingTop: 10, paddingBottom: 10}}
				calendarHeaderStyle={{color: '#E8BD70', fontSize: 17}}
				calendarColor={'#000'}
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
				onDateSelected={(date) => setSelectedDate(date)}
			/>

			<Center
				bgColor={'#121212'}
				borderWidth={'1px'}
				borderTopColor={'#fff'}
				borderBottomColor={'#fff'}>
				<Text m={'10px'} fontSize={'lg'}>
					{selectedDate
						? moment(selectedDate).format('YYYY-MM-DD')
						: 'Choose a date'}
				</Text>
			</Center>
			<ScrollView>
				{selectedDate && (
					<Box bgColor={'#121212'} borderRadius={20} my={5} p={4}>
						<Center m={2}>
							<Heading color={'#E8BD70'} size={'md'}>
								Appointment Information
							</Heading>
						</Center>
						<Box mx={4} my={1}>
							<Center>
								<Text
									borderWidth={1}
									borderRadius={3}
									borderColor={'#fff'}
									p={1}
									w={'100%'}
									fontSize={'lg'}
									onPress={showStartPicker}>
									{moment(startTime).format('H:mm A')}
								</Text>
							</Center>
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
						</Box>
						<Box mx={4} my={1}>
							<Text style={{color: 'red'}}>
								{!!errors.name && touched.name && errors.name}
							</Text>
							<Input
								placeholder='Name'
								borderColor={'#fff'}
								placeholderTextColor={'#fff'}
								size={'lg'}
								onChangeText={handleChange('name')}
								onBlur={handleBlur('name')}
								error={errors.name}
								touched={touched.name}
							/>
						</Box>
						<Box mx={4} my={1}>
							<Text style={{color: 'red'}}>
								{!!errors.phone &&
									touched.phone &&
									errors.phone}
							</Text>
							<Input
								placeholder='Phone'
								borderColor={'#fff'}
								placeholderTextColor={'#fff'}
								size={'lg'}
								onChangeText={handleChange('phone')}
								onBlur={handleBlur('phone')}
								error={errors.phone}
								touched={touched.phone}
							/>
						</Box>
						<Box mx={4} my={1}>
							<Text style={{color: 'red'}}>
								{!!errors.comment &&
									touched.comment &&
									errors.comment}
							</Text>
							<Input
								placeholder='Comment'
								borderColor={'#fff'}
								placeholderTextColor={'#fff'}
								size={'lg'}
								onChangeText={handleChange('comment')}
								onBlur={handleBlur('comment')}
								error={errors.comment}
								touched={touched.comment}
							/>
						</Box>
						<Button
							bgColor='#E8BD70'
							m={3}
							onPress={() => handleSubmit()}>
							<Text bold color='#000' fontSize={'lg'}>
								Add Appointment
							</Text>
						</Button>
					</Box>
				)}
			</ScrollView>
		</VStack>
	)
}

export default Add
