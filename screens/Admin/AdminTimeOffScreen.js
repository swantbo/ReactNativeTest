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

    useEffect(() => {
		//setStartTime(Date())
		setEndTime(new Date('1995-12-17T00:00:00'))
    }, [])

    const onDateSelected = selectedDate => {
		//setStartTime(Date(selectedDate))
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

	const onEndTimeChange = (newTime) => {
		console.log('EndTime', newTime)
		setEndTime(Date(newTime));
	};

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
                        <Card style={{flex: 1, padding: 5}}>
							
							<CheckBox
								containerStyle={{backgroundColor: '#121212'}}
								textStyle={{color: '#fff'}}
								title='All Day'
								checked={allDay}
								onPress={() => timeOffAllDay()}
							/>
						
							<DateTimePicker
								style={{backgroundColor: 'pink'}}
								value={startTime}
								mode='time'
								//mode={mode}
								//is24Hour={true}
								display="default"
								onChange={onStartTimeChange}
								is24Hour={true}
								minuteInterval={30}
							/>
							
							<DateTimePicker
								value={endTime}
								mode='time'
								//mode={mode}
								//is24Hour={true} 
								display="default"
								onChange={onEndTimeChange}
								is24Hour={true}
								minuteInterval={30}
							/>
						
						<Button title={'Schedule Time Off'} color={'#E8BD70'} onPress={() => 'scheduleAppoint()'}/>
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
  }
  });

export default AdminTimeOffScreen