import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput, Alert } from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';
import moment from 'moment';
import { Card, ListItem, CheckBox } from 'react-native-elements';
import { InputField } from '../../components';
import DateTimePicker from '@react-native-community/datetimepicker'
import * as firebase from 'firebase';

import { AuthenticatedUserContext } from '../../navigation/AuthenticatedUserProvider'

const AdminTimeOffScreen = ({ route }) => {
  const [selectedDate, setSelectedDate] = useState(moment());
  const [formattedDate, setFormattedDate] = useState();
  const [startTime, setStartTime] = useState(new Date('2020-08-22T17:00:00.000Z'))
  const [endTime, setEndTime] = useState(new Date('2020-08-22T05:00:00.000Z'))
  const [time, onChangeTime] = useState(null);
  const [allDay, setAllDay] = useState(false)
  const [isStartPickerShow, setIsStartPickerShow] = useState(false);
  const [isEndPickerShow, setIsEndPickerShow] = useState(false);

    useEffect(() => {
    }, [])

    const onDateSelected = selectedDate => {
      	setFormattedDate(selectedDate.format('YYYY-MM-DD'));
    }
	const timeOffAllDay = () => {
		allDay === false ? setAllDay(true) : setAllDay(false) 
	}

	const onStartTimeChange = (event, selectedTime) => {
		console.log('selectedTime', selectedTime)
		const currentDate = selectedTime || time;
		console.log('StartTime', currentDate.toString())
		setStartTime(currentDate);
	};

	const onEndTimeChange = (event, newTime) => {
		console.log('EndTime', newTime)
		const currentDate = newTime || time;
		console.log('EndTime', currentDate.toString())
		setEndTime(currentDate)
	};

	const showStartPicker = () => {
		isStartPickerShow === true ? setIsStartPickerShow(false) : setIsStartPickerShow(true)
	};

	const showEndPicker = () => {
		isEndPickerShow === true ? setIsEndPickerShow(false) : setIsEndPickerShow(true)
	};

	const scheduleTimeOff = () => {

	}

    async function createAvailableTimes(sTime, eTime, allDay) {
		if (allDay === false) {
			const startTime = moment(sTime, 'HH:mm a')
			const endTime = moment(eTime, 'HH:mm a')
			console.log('startTime', startTime, endTime)
			let newIntervals = {}
			while (startTime <= endTime) {
				let newobj = {[moment(startTime, 'HH:mm a').format("hh:mm A").toString().replace(/^(?:00:)?0?/, '')] : {'name': 'Off' } }
				newIntervals = {...newIntervals, ...newobj}
				startTime.add(30, 'minutes')
			}
        	console.log('newIntervals', newIntervals)
			Object.entries(newIntervals).map((key, i) => {
                firebase.firestore().collection('Calendar').doc(moment(formattedDate).format('MMM YY')).collection(formattedDate).doc(key[0]).set(key[1], {merge: true})
			})
		} else {
			const start = moment('9:00 am', 'HH:mm a')
			const end = moment('9:00 pm', 'HH:mm a')
			let newIntervals = {}
			while (start <= end) {
				let newobj = {[moment(start, 'HH:mm a').format("hh:mm A").toString().replace(/^(?:00:)?0?/, '')] : {'name': 'Off' } }
				newIntervals = {...newIntervals, ...newobj}
				start.add(30, 'minutes')
			}
			Object.entries(newIntervals).map((key, i) => {
				let tempData = {
					...key[1],
					time: key[0]
				}
                firebase.firestore().collection('Calendar').doc(moment(formattedDate).format('MMM YY')).collection(formattedDate).doc(key[0]).set(tempData, {merge: true})
			})
		}
		console.log('test', sTime, eTime)
        //onGetData(selectedDate, newIntervals)
    }

    return(
        <View style={styles.container}>
          <View style={{flex: 1}}>
                <CalendarStrip
					scrollable
					style={{height:100, paddingTop: 10, paddingBottom: 10}}
					calendarHeaderStyle={{color: '#E8BD70', fontSize: 17}}
					calendarColor={'#121212'}
					dateNumberStyle={{color: 'white'}}
					dateNameStyle={{color: 'white'}}
					iconContainer={{flex: 0.1}}
					highlightDateNameStyle={{color: 'white'}}
					highlightDateNumberStyle={{fontWeight: 'bold', color: 'white'}}
					highlightDateContainerStyle={{backgroundColor: '#E8BD70'}}
					selectedDate={selectedDate}
					onDateSelected={onDateSelected}
                />
            </View>
            <View style={{flex: 7}}>
                <ListItem bottomDivider containerStyle={styles.ListItem}>
                    <ListItem.Content style={{ alignItems: 'center', marginTop: -5}}>
                        <ListItem.Title style={{color: '#fff'}}> {formattedDate ? formattedDate : 'Choose a date'} </ListItem.Title>
                    </ListItem.Content>
                </ListItem>
					{ formattedDate &&
                        <Card containerStyle={{flex: 1, backgroundColor: '#121212', borderColor: '#000', alignContent: 'center'}}>
							
							<CheckBox
								containerStyle={{backgroundColor: '#121212'}}
								textStyle={{color: '#fff'}}
								title='All Day'
								checked={allDay}
								onPress={() => timeOffAllDay()}
							/>
							
							
							<View style={styles.pickedDateContainer}>
								<Text style={styles.pickedDate} onPress={showStartPicker}>
									{startTime.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
								</Text>
							</View>

							{isStartPickerShow && (
								<DateTimePicker
									style={{backgroundColor: 'white'}}
									value={startTime}
									mode='time'
									display={Platform.OS === 'ios' ? 'spinner' : 'default'}
									onChange={onStartTimeChange}
									is24Hour={true}
									minuteInterval={30}
								/>
							)}

							<View style={styles.pickedDateContainer}>
								<Text style={styles.pickedDate} onPress={showEndPicker}>
									{endTime.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
								}</Text>
							</View>
							
							{isEndPickerShow && (
								<DateTimePicker
									style={{backgroundColor: 'white'}}
									value={endTime}
									mode='time'
									display={Platform.OS === 'ios' ? 'spinner' : 'default'}
									onChange={onEndTimeChange}
									is24Hour={true}
									minuteInterval={30}
								/>
							)}
						
						<Button title={'Schedule Time Off'} color={'#E8BD70'} onPress={() => createAvailableTimes(startTime, endTime, allDay)}/>
					</Card>
				}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000'
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#fff',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    color: '#fff',
    backgroundColor: '#121212',
    margin: 10
  },
  text: {
    color: '#fff'
  },
  ListItem: {
      backgroundColor: '#121212'
  },
  pickedDateContainer: {
    padding: 20,
    backgroundColor: '#121212',
	color: 'white',
	borderColor: '#fff',
    borderRadius: 10,
  },
  pickedDate: {
	padding: 10,
	borderWidth: 1,
	borderColor: '#fff',
    fontSize: 18,
    color: 'white',
  },
  btnContainer: {
    padding: 30,
  },
  });

export default AdminTimeOffScreen