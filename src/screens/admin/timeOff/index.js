import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native'
import moment from 'moment'
import { Card, ListItem } from 'react-native-elements'
import DateTimePicker from '@react-native-community/datetimepicker'
import * as firebase from 'firebase'

import { AuthenticatedUserContext } from '../../../navigation/AuthenticatedUserProvider'

const TimeOffScreen = ({ route }) => {
    const [startTime, setStartTime] = useState(
        new Date('2020-08-22T17:00:00.000Z')
    )
    const [endTime, setEndTime] = useState(new Date('2020-08-22T05:00:00.000Z'))
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [time, onChangeTime] = useState(null)
    const [date, onChangeDate] = useState(null)
    const [isStartPickerShow, setIsStartPickerShow] = useState(false)
    const [isEndPickerShow, setIsEndPickerShow] = useState(false)
    const [isStartDatePickerShow, setIsStartDatePickerShow] = useState(false)
    const [isEndDatePickerShow, setIsEndDatePickerShow] = useState(false)

    useEffect(() => {}, [])

    const onStartTimeChange = (event, selectedTime) => {
        const currentTime = selectedTime || time
        setStartTime(currentTime)
    }

    const onEndTimeChange = (event, newTime) => {
        const currentTime = newTime || time
        setEndTime(currentTime)
    }

    const onStartDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || date
        setStartDate(currentDate)
    }

    const onEndDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || date
        setEndDate(currentDate)
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

    const showStartDatePicker = () => {
        isStartDatePickerShow === true
            ? setIsStartDatePickerShow(false)
            : setIsStartDatePickerShow(true)
    }

    const showEndDatePicker = () => {
        isEndDatePickerShow === true
            ? setIsEndDatePickerShow(false)
            : setIsEndDatePickerShow(true)
    }

    async function createAvailableTimes(sTime, eTime) {
        if (startDate.toLocaleDateString() === endDate.toLocaleDateString()) {
            const startTime = moment(sTime, 'HH:mm a')
            const endTime = moment(eTime, 'HH:mm a')
            let newIntervals = {}
            while (startTime <= endTime) {
                let newobj = {
                    [moment(startTime, 'HH:mm a')
                        .format('hh:mm A')
                        .toString()
                        .replace(/^(?:00:)?0?/, '')]: { name: 'Off' },
                }
                newIntervals = { ...newIntervals, ...newobj }
                startTime.add(30, 'minutes')
            }
            try {
                Object.entries(newIntervals).map((key, i) => {
                    let tempData = {
                        ...key[1],
                        time: key[0],
                    }
                    firebase
                        .firestore()
                        .collection('Calendar')
                        .doc(
                            moment(startDate.toLocaleDateString()).format(
                                'MMM YY'
                            )
                        )
                        .collection(moment(startDate).format('YYYY-MM-DD'))
                        .doc(key[0])
                        .set(tempData, { merge: true })
                })
                Alert.alert(
                    'Time Off Scheduled',
                    `Your time off has been scheduled for ${startDate.toLocaleDateString()} from ${[
                        moment(startTime, 'HH:mm a')
                            .format('hh:mm A')
                            .toString()
                            .replace(/^(?:00:)?0?/, ''),
                    ]} - ${[
                        moment(endTime, 'HH:mm a')
                            .format('hh:mm A')
                            .toString()
                            .replace(/^(?:00:)?0?/, ''),
                    ]}`,
                    [
                        {
                            text: 'Okay',
                        },
                    ]
                )
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
                startDate.toLocaleDateString() <= endDate.toLocaleDateString()
            ) {
                dates = { ...dates, [currDate.toLocaleDateString()]: '' }
                currDate.setDate(currDate.getDate() + 1)
            }
            const start = moment('9:00 am', 'HH:mm a')
            const end = moment('9:00 pm', 'HH:mm a')
            let newIntervals = {}
            while (start <= end) {
                let newobj = {
                    [moment(start, 'HH:mm a')
                        .format('hh:mm A')
                        .toString()
                        .replace(/^(?:00:)?0?/, '')]: { name: 'Off' },
                }
                newIntervals = { ...newIntervals, ...newobj }
                start.add(30, 'minutes')
            }
            try {
                Object.entries(dates).map((dateKey, i) => {
                    Object.entries(newIntervals).map((key, i) => {
                        let tempData = {
                            ...key[1],
                            time: key[0],
                        }
                        firebase
                            .firestore()
                            .collection('Calendar')
                            .doc(moment(dateKey[0]).format('MMM YY'))
                            .collection(moment(dateKey[0]).format('YYYY-MM-DD'))
                            .doc(key[0])
                            .set(tempData, { merge: true })
                    })
                })
                Alert.alert(
                    'Time Off Scheduled',
                    `Your time off has been scheduled for ${startDate.toLocaleDateString()} - ${startDate.toLocaleDateString()}`,
                    [
                        {
                            text: 'Okay',
                        },
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

    return (
        <View style={styles.container}>
            <Card
                containerStyle={{
                    flex: 1,
                    backgroundColor: '#121212',
                    borderColor: '#000',
                    alignContent: 'center',
                }}
            >
                <View style={styles.pickedDateContainer}>
                    <View style={{ flex: 1, alignContent: 'flex-start' }}>
                        <Text style={styles.text}>Start Date</Text>
                        <Text
                            style={styles.pickedDate}
                            onPress={showStartDatePicker}
                        >
                            {startDate.toLocaleDateString()}
                        </Text>
                    </View>
                    <View style={{ flex: 1, alignContent: 'flex-start' }}>
                        <Text style={styles.text}>End Date</Text>
                        <Text
                            style={styles.pickedDate}
                            onPress={showEndDatePicker}
                        >
                            {endDate.toLocaleDateString()}
                        </Text>
                    </View>
                </View>

                {isStartDatePickerShow && (
                    <DateTimePicker
                        style={{ backgroundColor: 'white' }}
                        value={startDate}
                        mode='date'
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={onStartDateChange}
                        minuteInterval={30}
                    />
                )}

                {isEndDatePickerShow && (
                    <DateTimePicker
                        style={{ backgroundColor: 'white' }}
                        value={endDate}
                        mode='date'
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={onEndDateChange}
                        minuteInterval={30}
                    />
                )}

                <View style={styles.pickedDateContainer}>
                    <View style={{ flex: 1, alignContent: 'flex-start' }}>
                        <Text style={styles.text}>Start Time</Text>
                        <Text
                            style={styles.pickedDate}
                            onPress={showStartPicker}
                        >
                            {startTime.toLocaleString('en-US', {
                                hour: 'numeric',
                                minute: '2-digit',
                                hour12: true,
                            })}
                        </Text>
                    </View>
                    <View style={{ flex: 1, alignContent: 'flex-start' }}>
                        <Text style={styles.text}>End Time</Text>
                        <Text style={styles.pickedDate} onPress={showEndPicker}>
                            {endTime.toLocaleString('en-US', {
                                hour: 'numeric',
                                minute: '2-digit',
                                hour12: true,
                            })}
                        </Text>
                    </View>
                </View>

                {isStartPickerShow && (
                    <DateTimePicker
                        style={{ backgroundColor: 'white' }}
                        value={startTime}
                        mode='time'
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={onStartTimeChange}
                        is24Hour={true}
                        minuteInterval={30}
                    />
                )}

                {isEndPickerShow && (
                    <DateTimePicker
                        style={{ backgroundColor: 'white' }}
                        value={endTime}
                        mode='time'
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={onEndTimeChange}
                        is24Hour={true}
                        minuteInterval={30}
                    />
                )}

                <TouchableOpacity
                    style={{
                        backgroundColor: '#E8BD70',
                        borderRadius: 10,
                        marginTop: 20,
                        width: '50%',
                        alignSelf: 'center',
                    }}
                    onPress={() => createAvailableTimes(startTime, endTime)}
                >
                    <ListItem.Title
                        style={{
                            color: '#000',
                            padding: 5,
                            alignSelf: 'center',
                            fontSize: 20,
                        }}
                    >
                        Schedule Time Off
                    </ListItem.Title>
                </TouchableOpacity>
            </Card>
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
    text: {
        color: '#fff',
        fontSize: 20,
        alignSelf: 'center',
    },
    ListItem: {
        backgroundColor: '#121212',
    },
    pickedDateContainer: {
        padding: 10,
        backgroundColor: '#121212',
        color: 'white',
        flexDirection: 'row',
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
})

export default TimeOffScreen
