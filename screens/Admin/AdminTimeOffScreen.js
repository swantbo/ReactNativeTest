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
  const [time, onChangeTime] = useState(new Date().setHours(0,0,0,0));
  const [interval, setMinInterval] = useState(1);
  const [allDay, setAllDay] = useState(false)

    useEffect(() => {
    
    }, [])

    const onDateSelected = selectedDate => {
      setSelectedDate( new Date(selectedDate))
      setFormattedDate(selectedDate.format('YYYY-MM-DD'));
    }
	const timeOffAllDay = () => {
		allDay === false ? setAllDay(true) : setAllDay(false) 
	}

	const onTimeChange = (event, newTime) => {
		console.log('newTime', newTime)
		onChangeTime(newTime);
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
                        <View style={{padding: 5}}>
                        
                            {/* <InputField
                                inputStyle={{
                                fontSize: 14,
                                }}
                                containerStyle={{
                                backgroundColor: '#fff',
                                marginBottom: 20,
                                borderColor: 'black', 
                                borderWidth: 1
                                }}
                                leftIcon='clock-time-eight'
                                placeholder='Appointment Time'
                                autoFocus={true}
                                value={time}
                                onChangeText={text => onChangeTime(text)}
                            /> */}
							<CheckBox
								title='All Day'
								checked={allDay}
								onPress={() => timeOffAllDay()}
							/>

							<DateTimePicker
								value={time}
								mode='time'
								//mode={mode}
								//is24Hour={true}
								display="default"
								onChange={onTimeChange}
								is24Hour={true}
								minuteInterval={interval}
							/>
							
							{/* <DateTimePicker
								value={selectedDate}
								mode={time}
								//mode={mode}
								//is24Hour={true}
								display="default"
								//onChange={setTimeout(value)}
							/> */}

                            <Button title={'Add Appointment'} color={'#E8BD70'} onPress={() => scheduleAppoint()}/>
                        </View>
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