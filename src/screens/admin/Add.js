import React, {useEffect, useState} from 'react'
import {Center, VStack, Box, Text, Button, Input} from 'native-base'
import CalendarStrip from 'react-native-calendar-strip'

import moment from 'moment'
import Firebase from '../../config/firebase'
import * as firebase from 'firebase'

const Add = ({route}) => {
	const [number, onChangeNumber] = useState('')
	const [name, onChangeName] = useState('')
	const [time, onChangeTime] = useState('12:00 AM')
	const [comment, onChangeComment] = useState('')
	const [selectedDate, setSelectedDate] = useState(moment())
	const [formattedDate, setFormattedDate] = useState()

	const onDateSelected = (selectedDate) => {
		setSelectedDate(selectedDate)
		setFormattedDate(selectedDate.format('YYYY-MM-DD'))
	}

	const scheduleAppoint = () => {
		const userAppointmentInfo = {
			name: name,
			comment: comment,
			time: time,
			phone: number
		}
		Firebase.firestore()
			.collection('Calendar')
			.doc(moment(formattedDate).format('MMM YY'))
			.collection(moment(formattedDate).format('YYYY-MM-DD'))
			.doc(
				moment(time, 'HH:mm a')
					.format('hh:mm A')
					.toString()
					.replace(/^(?:00:)?0?/, '')
			)
			.set(userAppointmentInfo, {merge: true})
			.then(() => {
				alert(`Thanks , Nate. Your appointment for ${name} has been scheduled`)
			})
			.catch((error) => {
				alert('Something went wrong try again')
			})

		const userRef = Firebase.firestore().collection('Calendar').doc(moment(selectedDate).format('MMM YY')).collection('OverView').doc('data')
		const increment = firebase.firestore.FieldValue.increment(1)

		userRef.update({
			haircuts: increment
		})
	}

	useEffect(() => {
		setSelectedDate(moment())
		const {formattedDate, time} = route.params ? route.params : ''
		formattedDate ? setFormattedDate(formattedDate) : ''
		time ? onChangeTime(time[0]) : ''
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
				onDateSelected={onDateSelected}
			/>

			<Center bgColor={'#121212'} borderWidth={'1px'} borderTopColor={'#fff'} borderBottomColor={'#fff'}>
				<Text m={'10px'} fontSize={'lg'}>
					{formattedDate ? formattedDate : 'Choose a date'}
				</Text>
			</Center>
			{formattedDate && (
				<Box bgColor={'#121212'} m={'3'}>
					<Input placeholder='Time' h={'40px'} p={4} m={4} mb={1} value={time} onChangeText={(text) => onChangeTime(text)} />
					<Input placeholder='Name' h={'40px'} p={4} m={4} mb={1} value={name} onChangeText={(text) => onChangeName(text)} />
					<Input placeholder='Phone Number' h={'40px'} p={4} m={4} mb={1} value={number} onChangeText={(text) => onChangeNumber(text)} />
					<Input placeholder='comment' h={'40px'} p={4} m={4} mb={1} value={comment} onChangeText={(text) => onChangeComment(text)} />

					<Button bgColor='#E8BD70' m={3} onPress={() => scheduleAppoint()}>
						<Text bold color='#000' fontSize={'lg'}>
							Add Appointment
						</Text>
					</Button>
				</Box>
			)}
		</VStack>
	)
}

export default Add
