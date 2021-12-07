import React, { useEffect, useState } from 'react'
import { View, Button, StyleSheet, TouchableOpacity, Text } from 'react-native'
import CalendarStrip from 'react-native-calendar-strip'
import moment from 'moment'
import { ListItem } from 'react-native-elements'
import { InputField } from '../../../components'
import * as firebase from 'firebase'

const AddAppointmentScreen = ({ route }) => {
    const [number, onChangeNumber] = useState('')
    const [name, onChangeName] = useState('')
    const [time, onChangeTime] = useState('')
    const [comment, onChangeComment] = useState('')
    const [selectedDate, setSelectedDate] = useState(moment())
    const [formattedDate, setFormattedDate] = useState()

    useEffect(() => {
        setSelectedDate(moment())
        const { formattedDate, time } = route.params ? route.params : ''
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
            phone: number,
        }
        firebase
            .firestore()
            .collection('Calendar')
            .doc(moment(formattedDate).format('MMM YY'))
            .collection(moment(formattedDate).format('YYYY-MM-DD'))
            .doc(
                moment(time, 'HH:mm a')
                    .format('hh:mm A')
                    .toString()
                    .replace(/^(?:00:)?0?/, '')
            )
            .set(userAppointmentInfo, { merge: true })
            .then(() => {
                alert(`Thanks , your appointment has been scheduled`)
            })
            .catch((error) => {
                alert('Something went wrong try again')
            })

        const userRef = firebase
            .firestore()
            .collection('Calendar')
            .doc(moment(selectedDate).format('MMM YY'))
            .collection('OverView')
            .doc('data')
        const increment = firebase.firestore.FieldValue.increment(1)

        userRef.update({
            haircuts: increment,
        })
    }

    return (
        <View style={styles.container}>
            <View style={{ flex: 1 }}>
                <CalendarStrip
                    scrollable
                    style={{ height: 100, paddingTop: 10, paddingBottom: 10 }}
                    calendarHeaderStyle={{ color: '#E8BD70', fontSize: 17 }}
                    calendarColor={'#000'}
                    dateNumberStyle={{ color: 'white' }}
                    dateNameStyle={{ color: 'white' }}
                    iconContainer={{ flex: 0.1 }}
                    highlightDateNameStyle={{ color: 'white' }}
                    highlightDateNumberStyle={{
                        fontWeight: 'bold',
                        color: 'white',
                    }}
                    highlightDateContainerStyle={{ backgroundColor: '#E8BD70' }}
                    selectedDate={selectedDate}
                    onDateSelected={onDateSelected}
                />
            </View>
            <View style={{ flex: 7 }}>
                <ListItem bottomDivider containerStyle={styles.ListItem}>
                    <ListItem.Content
                        style={{ alignItems: 'center', marginTop: -5 }}
                    >
                        <ListItem.Title style={styles.text}>
                            {formattedDate ? formattedDate : 'Choose a date'}
                        </ListItem.Title>
                    </ListItem.Content>
                </ListItem>
                {formattedDate && (
                    <View
                        style={{
                            padding: 5,
                            margin: 15,
                            backgroundColor: '#121212',
                        }}
                    >
                        <InputField
                            inputStyle={{
                                fontSize: 14,
                            }}
                            containerStyle={{
                                backgroundColor: '#fff',
                                margin: 15,
                                borderColor: 'black',
                                borderWidth: 1,
                            }}
                            leftIcon='clock-time-eight'
                            placeholder='Appointment Time'
                            autoFocus={true}
                            value={time}
                            onChangeText={(text) => onChangeTime(text)}
                        />

                        <InputField
                            inputStyle={{
                                fontSize: 14,
                            }}
                            containerStyle={{
                                backgroundColor: '#fff',
                                margin: 15,
                                borderColor: 'black',
                                borderWidth: 1,
                            }}
                            leftIcon='account'
                            placeholder='Name'
                            autoCapitalize='none'
                            autoFocus={true}
                            value={name}
                            onChangeText={(text) => onChangeName(text)}
                        />

                        <InputField
                            inputStyle={{
                                fontSize: 14,
                            }}
                            containerStyle={{
                                backgroundColor: '#fff',
                                margin: 15,
                                borderColor: 'black',
                                borderWidth: 1,
                            }}
                            leftIcon='phone'
                            placeholder='Phone Number'
                            autoCapitalize='none'
                            keyboardType='phone-pad'
                            autoFocus={true}
                            value={number}
                            onChangeText={(text) => onChangeNumber(text)}
                        />

                        <InputField
                            inputStyle={{
                                fontSize: 14,
                            }}
                            containerStyle={{
                                backgroundColor: '#fff',
                                margin: 15,
                                borderColor: 'black',
                                borderWidth: 1,
                            }}
                            leftIcon='comment'
                            placeholder='Comment'
                            autoCapitalize='none'
                            autoFocus={true}
                            value={comment}
                            onChangeText={(text) => onChangeComment(text)}
                        />

                        <TouchableOpacity
                            style={{
                                backgroundColor: '#E8BD70',
                                borderRadius: 10,
                                margin: 15,
                                width: '50%',
                                alignSelf: 'center',
                            }}
                            onPress={() => scheduleAppoint()}
                        >
                            <Text
                                style={{
                                    color: '#000',
                                    padding: 5,
                                    alignSelf: 'center',
                                    fontSize: 20,
                                }}
                            >
                                Add Appointment
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#fff',
        padding: 10,
        marginBottom: 20,
        borderRadius: 5,
        color: '#fff',
        backgroundColor: '#121212',
        margin: 10,
    },
    ListItem: {
        backgroundColor: '#121212',
    },
    text: {
        color: '#fff',
    },
})

export default AddAppointmentScreen
