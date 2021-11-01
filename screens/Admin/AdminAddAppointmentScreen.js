import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator } from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';
import moment from 'moment';
import { Card, ListItem } from 'react-native-elements';
import { TextInput } from 'react-native-gesture-handler';
import * as firebase from 'firebase';

const AdminAddAppointmentScreen = ( { route, navigation } ) => {
    const [number, onChangeNumber] = useState('');
    const [name, onChangeName] = useState('');
    const [time, onChangeTime] = useState('');
    const [comment, onChangeComment] = useState('');
    const [selectedDate, setSelectedDate] = useState(moment());
    const [formattedDate, setFormattedDate] = useState();

    useEffect(() => {
        setSelectedDate(moment())
        const {formattedDate, time} = route.params ? route.params : ''
        formattedDate ? setFormattedDate(formattedDate) : ''
        time ? onChangeTime(time[0]) : ''
    }, [])
    
      const onDateSelected = selectedDate => {
        setSelectedDate(selectedDate);
        setFormattedDate(selectedDate.format('YYYY-MM-DD'));
      }

      const scheduleAppoint =  () => {
        const userAppointmentInfo = {
            name: name,
            comment: comment,
            time : time,
            phone : number
        };

        firebase.firestore()
        .collection('Calendar')
        .doc(moment(formattedDate).format('MMM YY'))
        .collection(moment(formattedDate).format('YYYY-MM-DD')).doc(moment(time, 'HH:mm a').format("hh:mm A").toString().replace(/^(?:00:)?0?/, ''))
        .set(userAppointmentInfo, {merge: true})
        .then(() => {
            alert(`Thanks , your appointment has been scheduled`)
        }).catch((error) => {
            alert('Something went wrong try again')
        }); 
    }

    return(
        <View style={styles.container}> 
            <View style={{flex: 1}}>
                <CalendarStrip
                scrollable
                style={{height:100, paddingTop: 10, paddingBottom: 10}}
                calendarHeaderStyle={{color: '#E8BD70', fontSize: 17}}
                calendarColor={'#000'}
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
                        <ListItem.Title style={styles.text}> {formattedDate ? formattedDate : 'Choose a date'} </ListItem.Title>
                    </ListItem.Content>
                </ListItem>
                    { formattedDate &&
                        <>
                            <TextInput 
                            placeholder="Time"
                            placeholderTextColor={'#fff'}
                            style={styles.textInput} 
                            onChangeText={onChangeTime}
                            value={time}
                            />

                            <TextInput 
                            placeholder="Name"
                            placeholderTextColor={'#fff'}
                            style={styles.textInput} 
                            onChangeText={onChangeName}
                            value={name}
                            />

                            <TextInput 
                            placeholder="Phone"
                            placeholderTextColor={'#fff'}
                            style={styles.textInput} 
                            onChangeText={onChangeNumber}
                            value={number}
                            />

                            <TextInput 
                            placeholder="Comments"
                            placeholderTextColor={'#fff'}
                            style={styles.textInput} 
                            onChangeText={onChangeComment}
                            value={comment}
                            />

                            <Button title={'Add Appointment'} color={'#E8BD70'} onPress={() => scheduleAppoint()}/>
                        </>
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
    ListItem: {
        backgroundColor: '#121212'
    },
    text: {
        color: '#fff'
    },
  });

export default AdminAddAppointmentScreen