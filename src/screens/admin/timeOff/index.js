import React, { useEffect, useState, useContext } from 'react'
import {
    View,
    Text,
    StyleSheet,
    Alert,
    TouchableOpacity,
    Linking,
    KeyboardAvoidingView,
} from 'react-native'
import moment from 'moment'
import { Card, ListItem, Avatar } from 'react-native-elements'
import DateTimePicker from '@react-native-community/datetimepicker'
import * as firebase from 'firebase'
import { formatPhoneNumber } from '../../../utils/DataFormatting'

import { InputField } from '../../../components'
import { AuthenticatedUserContext } from '../../../navigation/AuthenticatedUserProvider'
import { ScrollView } from 'react-native-gesture-handler'

const TimeOffScreen = ({ route }) => {
    const { user } = useContext(AuthenticatedUserContext)
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
    const [barberInfo, setBarberInfo] = useState({
        location: '',
        name: '',
        phone: '',
    })
    const [timeOffType, setTimeOffType] = useState('multiple')
    const [text, onChangeText] = useState('')

    const onStartTimeChange = (event, selectedTime) => {
        const currentTime = selectedTime || new date()
        console.log('timeTest', moment(currentTime).format('hh:mm A'))
        setStartTime(currentTime)
        setIsStartPickerShow(Platform.OS === 'ios' ? true : false)
    }

    const onEndTimeChange = (event, newTime) => {
        const currentTime = newTime || new date()
        setEndTime(currentTime)
        setIsEndPickerShow(Platform.OS === 'ios' ? true : false)
    }

    const onStartDateChange = (event, selectedDate) => {
        console.log('selectedDate', selectedDate)
        const currentDate = selectedDate || new date()
        console.log('currentDate', currentDate)
        setStartDate(currentDate)
        console.log('test', moment(startDate).format('YYYY-MM-DD'))
        if (timeOffType !== 'multiple') {
            setEndDate(currentDate)
        }
        setIsStartDatePickerShow(Platform.OS === 'ios' ? true : false)
    }

    const onEndDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || new date()
        setEndDate(currentDate)
        setIsEndDatePickerShow(Platform.OS === 'ios' ? true : false)
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
        if (
            moment(startDate).format('YYYY-MM-DD') ===
            moment(endDate).format('YYYY-MM-DD')
        ) {
            let startTime, endTime, tempTime
            if (timeOffType === 'half') {
                tempTime = moment(sTime, 'HH:mm a')
                startTime = moment(sTime, 'HH:mm a')
                endTime = moment(eTime, 'HH:mm a')
            }
            if (timeOffType === 'full') {
                tempTime = moment('8:00 am', 'HH:mm a')
                startTime = moment('8:00 am', 'HH:mm a')
                endTime = moment('9:00 pm', 'HH:mm a')
            }
            let newIntervals = {}
            while (tempTime <= endTime) {
                let newobj = {
                    [moment(tempTime, 'HH:mm a')
                        .format('hh:mm A')
                        .toString()
                        .replace(/^(?:00:)?0?/, '')]: {
                        name: 'Off',
                        comment: text,
                    },
                }
                newIntervals = { ...newIntervals, ...newobj }
                tempTime.add(30, 'minutes')
            }
            console.log('newIntervals', newIntervals)
            try {
                Object.entries(newIntervals).map((key, i) => {
                    let tempData = {
                        ...key[1],
                        time: key[0],
                        ...key[2],
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
                {
                    timeOffType === 'full'
                        ? Alert.alert(
                              'Time Off Scheduled',
                              `Your time off has been scheduled for all day on ${moment(
                                  startDate
                              ).format('YYYY-MM-DD')} `,
                              [
                                  {
                                      text: 'Okay',
                                  },
                              ]
                          )
                        : Alert.alert(
                              'Time Off Scheduled',
                              `Your time off has been scheduled for ${moment(
                                  startDate
                              ).format('YYYY-MM-DD')} from ${[
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
                }
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
                    [moment(currDate).format('YYYY-MM-DD')]: '',
                }
                currDate.setDate(currDate.getDate() + 1)
            }
            const start = moment('8:00 am', 'HH:mm a')
            const end = moment('9:00 pm', 'HH:mm a')
            let newIntervals = {}
            while (start <= end) {
                let newobj = {
                    [moment(start, 'HH:mm a')
                        .format('hh:mm A')
                        .toString()
                        .replace(/^(?:00:)?0?/, '')]: {
                        name: 'Off',
                        comment: text,
                    },
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
                            ...key[2],
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
                    `Your time off has been scheduled for ${moment(
                        startDate
                    ).format('YYYY-MM-DD')} - ${moment(endDate).format(
                        'YYYY-MM-DD'
                    )}`,
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

    const getBarberInfo = async () => {
        await firebase
            .firestore()
            .collection('Barber')
            .doc('Nate')
            .get()
            .then((testData) => {
                const barberData = {
                    location: testData.data().location,
                    phone: testData.data().phone,
                    name: testData.data().name,
                }
                setBarberInfo({ ...barberInfo, ...barberData })
            })
    }

    useEffect(() => {
        getBarberInfo()
    }, [])

    const selectedTimeOffType = (selectedTimeOff) => {
        setTimeOffType(selectedTimeOff)
        if (selectedTimeOff !== 'half') {
            setStartTime(new Date('2020-08-22T17:00:00.000Z'))
            setEndTime(new Date('2020-08-22T05:00:00.000Z'))
        }
    }

    return (
        <View style={styles.container}>
            <View style={{}}>
                <ListItem bottomDivider containerStyle={styles.ListItem}>
                    <Avatar
                        source={require('../../../assets/123_1.jpeg')}
                        rounded
                        size='large'
                    />
                    <ListItem.Content>
                        <ListItem.Title style={{ color: 'white' }}>
                            {barberInfo.name}
                        </ListItem.Title>
                        <TouchableOpacity
                            onPress={() =>
                                Linking.openURL(
                                    `sms:${barberInfo?.phone}`
                                ).catch(() => {
                                    Linking.openURL(`sms:${barberInfo?.phone}`)
                                })
                            }
                        >
                            <ListItem.Subtitle style={{ color: 'white' }}>
                                {barberInfo.phone != ''
                                    ? formatPhoneNumber(barberInfo.phone)
                                    : ''}
                            </ListItem.Subtitle>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() =>
                                Linking.openURL(
                                    'maps://app?saddr=&daddr=43.0218740049977+-87.9119389619647'
                                ).catch(() => {
                                    Linking.openURL(
                                        'google.navigation:q=43.0218740049977+-87.9119389619647'
                                    )
                                })
                            }
                        >
                            <ListItem.Subtitle style={{ color: 'white' }}>
                                {barberInfo.location != ''
                                    ? barberInfo.location
                                    : ''}
                            </ListItem.Subtitle>
                        </TouchableOpacity>
                    </ListItem.Content>
                </ListItem>
            </View>
            <ScrollView>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.container}
                >
                    <View
                        style={{
                            marginLeft: 15,
                            marginRight: 15,
                            marginTop: 10,
                        }}
                    >
                        <ListItem containerStyle={styles.ListItem}>
                            <ListItem.Content>
                                <ListItem.Title
                                    style={{
                                        color: '#E8BD70',
                                        paddingBottom: 5,
                                        fontWeight: 'bold',
                                    }}
                                >
                                    Time Off
                                </ListItem.Title>
                                <ListItem.CheckBox
                                    containerStyle={{
                                        backgroundColor: '#121212',
                                        width: '100%',
                                        padding: 5,
                                        margin: 5,
                                    }}
                                    textStyle={{ color: '#fff' }}
                                    title='Mutiple-Days'
                                    checked={
                                        timeOffType === 'multiple'
                                            ? true
                                            : false
                                    }
                                    onPress={() =>
                                        selectedTimeOffType('multiple')
                                    }
                                />
                                <ListItem.CheckBox
                                    containerStyle={{
                                        backgroundColor: '#121212',
                                        width: '100%',
                                        padding: 5,
                                        margin: 5,
                                    }}
                                    textStyle={{ color: '#fff' }}
                                    title='Full-Day'
                                    checked={
                                        timeOffType === 'full' ? true : false
                                    }
                                    onPress={() => selectedTimeOffType('full')}
                                />

                                <ListItem.CheckBox
                                    containerStyle={{
                                        backgroundColor: '#121212',
                                        width: '100%',
                                        padding: 5,
                                        margin: 5,
                                    }}
                                    textStyle={{ color: '#fff' }}
                                    title='Half-Day'
                                    checked={
                                        timeOffType === 'half' ? true : false
                                    }
                                    onPress={() => selectedTimeOffType('half')}
                                />
                            </ListItem.Content>
                        </ListItem>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Card
                            containerStyle={{
                                backgroundColor: '#121212',
                                borderColor: '#000',
                                alignContent: 'center',
                            }}
                        >
                            <ListItem.Title
                                style={{
                                    color: '#E8BD70',
                                    paddingBottom: 5,
                                    fontWeight: 'bold',
                                }}
                            >
                                Day & Time
                            </ListItem.Title>
                            <View style={styles.pickedDateContainer}>
                                {timeOffType === 'multiple' ? (
                                    <>
                                        <View
                                            style={{
                                                flex: 1,
                                                alignContent: 'flex-start',
                                            }}
                                        >
                                            <Text style={styles.text}>
                                                Start Date
                                            </Text>
                                            <Text
                                                style={[
                                                    isStartDatePickerShow ===
                                                    true
                                                        ? styles.pickedDatePressed
                                                        : styles.pickedDate,
                                                ]}
                                                onPress={showStartDatePicker}
                                            >
                                                {moment(startDate).format(
                                                    'YYYY-MM-DD'
                                                )}
                                            </Text>
                                        </View>
                                        <View
                                            style={{
                                                flex: 1,
                                                alignContent: 'flex-start',
                                            }}
                                        >
                                            <Text style={styles.text}>
                                                End Date
                                            </Text>
                                            <Text
                                                style={[
                                                    isEndDatePickerShow === true
                                                        ? styles.pickedDatePressed
                                                        : styles.pickedDate,
                                                ]}
                                                onPress={showEndDatePicker}
                                            >
                                                {moment(endDate).format(
                                                    'YYYY-MM-DD'
                                                )}
                                            </Text>
                                        </View>
                                    </>
                                ) : (
                                    <View
                                        style={{
                                            flex: 1,
                                            alignContent: 'flex-start',
                                        }}
                                    >
                                        <Text style={styles.text}>Date</Text>
                                        <Text
                                            style={[
                                                isStartDatePickerShow === true
                                                    ? styles.pickedDatePressed
                                                    : styles.pickedDate,
                                            ]}
                                            onPress={showStartDatePicker}
                                        >
                                            {moment(startDate).format(
                                                'YYYY-MM-DD'
                                            )}
                                        </Text>
                                    </View>
                                )}
                            </View>

                            {isStartDatePickerShow && (
                                <DateTimePicker
                                    style={{
                                        backgroundColor: '#121212',
                                    }}
                                    textColor='#fff'
                                    value={startDate}
                                    mode='date'
                                    display={
                                        Platform.OS === 'ios'
                                            ? 'spinner'
                                            : 'default'
                                    }
                                    onChange={onStartDateChange}
                                    minuteInterval={30}
                                />
                            )}

                            {isEndDatePickerShow && (
                                <DateTimePicker
                                    style={{ backgroundColor: 'white' }}
                                    textColor='#fff'
                                    value={endDate}
                                    mode='date'
                                    display={
                                        Platform.OS === 'ios'
                                            ? 'spinner'
                                            : 'default'
                                    }
                                    onChange={onEndDateChange}
                                    minuteInterval={30}
                                />
                            )}

                            <View style={styles.pickedDateContainer}>
                                {timeOffType === 'half' && (
                                    <>
                                        <View
                                            style={{
                                                flex: 1,
                                                alignContent: 'flex-start',
                                            }}
                                        >
                                            <Text style={styles.text}>
                                                Start Time
                                            </Text>
                                            <Text
                                                style={[
                                                    isStartPickerShow === true
                                                        ? styles.pickedDatePressed
                                                        : styles.pickedDate,
                                                ]}
                                                onPress={showStartPicker}
                                            >
                                                {moment(startTime).format(
                                                    'hh:mm A'
                                                )}
                                            </Text>
                                        </View>
                                        <View
                                            style={{
                                                flex: 1,
                                                alignContent: 'flex-start',
                                            }}
                                        >
                                            <Text style={styles.text}>
                                                End Time
                                            </Text>
                                            <Text
                                                style={[
                                                    isEndPickerShow === true
                                                        ? styles.pickedDatePressed
                                                        : styles.pickedDate,
                                                ]}
                                                onPress={showEndPicker}
                                            >
                                                {moment(endTime).format(
                                                    'hh:mm A'
                                                )}
                                            </Text>
                                        </View>
                                    </>
                                )}
                            </View>

                            {isStartPickerShow && (
                                <DateTimePicker
                                    style={{ backgroundColor: 'white' }}
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
                                    style={{ backgroundColor: 'white' }}
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
                            <ListItem.Title
                                style={{
                                    color: '#E8BD70',
                                    paddingBottom: 5,
                                    fontWeight: 'bold',
                                }}
                            >
                                Comment
                            </ListItem.Title>
                            <InputField
                                inputStyle={{
                                    fontSize: 14,
                                }}
                                containerStyle={{
                                    backgroundColor: '#fff',
                                    borderColor: 'black',
                                    borderWidth: 1,
                                    marginBottom: 10,
                                }}
                                leftIcon='comment'
                                placeholder='Comment (optional)'
                                autoCapitalize='sentences'
                                value={text}
                                onChangeText={(text) => onChangeText(text)}
                            />

                            <TouchableOpacity
                                style={{
                                    backgroundColor: '#E8BD70',
                                    borderRadius: 10,
                                    marginTop: 20,
                                    width: '50%',
                                    alignSelf: 'center',
                                }}
                                onPress={() =>
                                    createAvailableTimes(startTime, endTime)
                                }
                            >
                                <Text
                                    style={{
                                        color: '#000',
                                        padding: 5,
                                        alignSelf: 'center',
                                        fontSize: 20,
                                    }}
                                >
                                    Schedule Time Off
                                </Text>
                            </TouchableOpacity>
                        </Card>
                    </View>
                </KeyboardAvoidingView>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignContent: 'center',
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
        borderRadius: 10,
        textAlign: 'center',
        fontWeight: 'normal',
    },
    pickedDatePressed: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#fff',
        fontSize: 18,
        color: 'white',
        borderRadius: 10,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    btnContainer: {
        padding: 30,
    },
})

export default TimeOffScreen
