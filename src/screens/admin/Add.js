import React, {useEffect, useState} from 'react'
import {View, Button, StyleSheet, TouchableOpacity, Text} from 'react-native'
import CalendarStrip from 'react-native-calendar-strip'
import {ListItem} from 'react-native-elements'

import {InputField} from '../../components'
import createStyles from '../../styles/base'

import moment from 'moment'
import Firebase from '../../config/firebase'

const Add = ({route}) => {
	const [number, onChangeNumber] = useState('')
	const [name, onChangeName] = useState('')
	const [time, onChangeTime] = useState('12:00 AM')
	const [comment, onChangeComment] = useState('')
	const [selectedDate, setSelectedDate] = useState(moment())
	const [formattedDate, setFormattedDate] = useState()

	useEffect(() => {
		setSelectedDate(moment())
		const {formattedDate, time} = route.params ? route.params : ''
		formattedDate ? setFormattedDate(formattedDate) : ''
		time ? onChangeTime(time[0]) : ''
	}, [])

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
				alert(`Thanks , your appointment has been scheduled`)
			})
			.catch((error) => {
				alert('Something went wrong try again')
			})

		const userRef = Firebase.firestore().collection('Calendar').doc(moment(selectedDate).format('MMM YY')).collection('OverView').doc('data')
		const increment = Firebase.firestore.FieldValue.increment(1)

		userRef.update({
			haircuts: increment
		})
	}

	return (
		<View style={styles.settingsContainer}>
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

			<ListItem bottomDivider containerStyle={styles.listItemContainer}>
				<ListItem.Content>
					<ListItem.Title style={styles.selectedDate}>{formattedDate ? formattedDate : 'Choose a date'}</ListItem.Title>
				</ListItem.Content>
			</ListItem>
			{formattedDate && (
				<View style={styles.addView}>
					<InputField
						inputStyle={{
							fontSize: 14
						}}
						containerStyle={styles.inputField}
						leftIcon='clock-time-eight'
						placeholder='Appointment Time'
						value={time}
						onChangeText={(text) => onChangeTime(text)}
					/>

					<InputField
						inputStyle={{
							fontSize: 14
						}}
						containerStyle={styles.inputField}
						leftIcon='account'
						placeholder='Name'
						autoCapitalize='none'
						value={name}
						onChangeText={(text) => onChangeName(text)}
					/>

					<InputField
						inputStyle={{
							fontSize: 14
						}}
						containerStyle={styles.inputField}
						leftIcon='phone'
						placeholder='Phone Number'
						autoCapitalize='none'
						keyboardType='phone-pad'
						value={number}
						onChangeText={(text) => onChangeNumber(text)}
					/>

					<InputField
						inputStyle={{
							fontSize: 14
						}}
						containerStyle={styles.inputField}
						leftIcon='comment'
						placeholder='Comment'
						autoCapitalize='none'
						value={comment}
						onChangeText={(text) => onChangeComment(text)}
					/>

					<TouchableOpacity style={styles.goldButton} onPress={() => scheduleAppoint()}>
						<Text
							style={{
								color: '#000',
								padding: 5,
								alignSelf: 'center',
								fontSize: 20
							}}>
							Add Appointment
						</Text>
					</TouchableOpacity>
				</View>
			)}
		</View>
	)
}

const styles = createStyles()

export default Add
