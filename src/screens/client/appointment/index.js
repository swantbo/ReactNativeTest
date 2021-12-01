import moment from 'moment'
import React, { useEffect, useState, useContext } from 'react'
import {
    View,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Alert,
    TouchableOpacity,
    Linking,
} from 'react-native'
import CalendarStrip from 'react-native-calendar-strip'
import { ListItem, Avatar } from 'react-native-elements'
import {
    insertDecimal,
    subtractDiscount,
    formatPhoneNumber,
    subtractPrice,
} from '../../../utils/DataFormatting'

import { InputField } from '../../../components'
import * as firebase from 'firebase'

import { AuthenticatedUserContext } from '../../../navigation/AuthenticatedUserProvider'

const AppointmentScreen = () => {
    const { user } = useContext(AuthenticatedUserContext)
    const [selectedDate, setSelectedDate] = useState(moment())
    const [formattedDate, setFormattedDate] = useState()
    const [calendarDatesRemoved, setCalendarDatesRemoved] = useState([])
    const [selectedTime, setSelectedTime] = useState('')
    const [barberInfo, setBarberInfo] = useState({
        price: '',
        location: '',
        name: '',
        phone: '',
    })
    const [availibility, setAvailibility] = useState({
        Tuesday: '',
        Wednesday: '',
        Thursday: '',
        Friday: '',
        Saturday: '',
    })
    const [userName, setUserName] = useState('')
    const [userPhone, setUserPhone] = useState('')
    const [userStrikes, setUserStrikes] = useState('')
    const [text, onChangeText] = useState('')
    const [userPoints, setUserPoints] = useState('')
    const [newTimes, setNewTimes] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [friend, setFriend] = useState('')
    const [haircutType, setHaircutType] = useState('mens')
    const [discount, setDiscount] = useState(false)

    async function getUserId() {
        await firebase
            .firestore()
            .collection('users')
            .doc(user.uid)
            .get()
            .then((doc) => {
                const userNameData = doc.data().name
                const userPhoneData = doc.data().phone
                const userPoints = doc.data().points
                const userStrikes = doc.data().strikes
                setUserName(userNameData),
                    setUserPhone(userPhoneData),
                    setUserPoints(userPoints),
                    setUserStrikes(userStrikes)
            })

        await firebase
            .firestore()
            .collection('Barber')
            .doc('Nate')
            .get()
            .then((doc) => {
                const databaseAvailibility = { ...availibility, ...doc.data() }
                setAvailibility({ ...availibility, ...databaseAvailibility })
            })
    }

    const removeMonSun = () => {
        let dateArray = []
        let currentDate = moment()
        const stopDate = moment().add(30, 'days')
        while (currentDate <= stopDate) {
            if (
                moment(currentDate).format('dddd') == 'Sunday' ||
                moment(currentDate).format('dddd') == 'Monday'
            ) {
                dateArray.push(moment(currentDate).format('YYYY-MM-DD'))
            }
            currentDate = moment(currentDate).add(1, 'days')
        }
        setCalendarDatesRemoved(dateArray)
    }

    const onDateSelected = (selectedDate) => {
        setIsLoading(true)
        setSelectedDate(selectedDate.format('YYYY-MM-DD'))
        setFormattedDate(selectedDate.format('YYYY-MM-DD'))
        splitHours(selectedDate)
    }

    const splitHours = (selectedDate) => {
        const weekDay = Promise.resolve(
            moment(selectedDate, 'YYYY-MM-DD HH:mm:ss')
                .format('dddd')
                .toString()
        )
        Promise.all([weekDay]).then((values) => {
            createAvailableTimes(availibility[`${values}`], selectedDate)
        })
    }

    function createAvailableTimes(newWeekDay, selectedDate) {
        let arr = newWeekDay
        const newSplitString = arr
            .toUpperCase()
            .split('-')
            .map((item) => item.trim())
        const startTime = moment(newSplitString[0], 'HH:mm a')
        const endTime = moment(newSplitString[1], 'HH:mm a')
        let newIntervals = {}
        while (startTime <= endTime) {
            let newobj = {
                [moment(startTime, 'HH:mm a')
                    .format('hh:mm A')
                    .toString()
                    .replace(/^(?:00:)?0?/, '')]: '',
            }
            newIntervals = { ...newIntervals, ...newobj }
            startTime.add(30, 'minutes')
        }
        onGetData(selectedDate, newIntervals)
    }

    const onGetData = async (selectedDate, newIntervals) => {
        await firebase
            .firestore()
            .collection('Calendar')
            .doc(moment(selectedDate).format('MMM YY'))
            .collection(moment(selectedDate).format('YYYY-MM-DD'))
            .get()
            .then((snapshot) => {
                let data = {}
                snapshot.forEach((doc) => {
                    let newdata = { [doc.id]: 'Taken' }
                    data = { ...data, ...newdata }
                })
                const tempTimes = { ...newIntervals, ...data }
                let newTime = {}
                if (tempTimes) {
                    Object.entries(tempTimes).map((key, i) => {
                        let tempTime = {}
                        if (key[1] != 'Taken') {
                            tempTime = { [key[0]]: key[1] }
                        }
                        newTime = { ...newTime, ...tempTime }
                    })
                } else {
                    newTime = { tempTime }
                }
                setNewTimes(newTime)
                setIsLoading(false)
            })
    }

    const scheduleAppointment = (time) => {
        setSelectedTime(time)
    }

    const getBarberInfo = async () => {
        await firebase
            .firestore()
            .collection('Barber')
            .doc('Nate')
            .get()
            .then((testData) => {
                const barberData = {
                    price: testData.data().price,
                    location: testData.data().location,
                    phone: testData.data().phone,
                    name: testData.data().name,
                }
                setBarberInfo({ ...barberInfo, ...barberData })
            })
    }

    const scheduleAppoint = async (selectedDate, selectedTime) => {
        const userAppointmentInfo = {
            name: userName,
            haircutType: haircutType,
            friend: friend,
            comment: text,
            time: selectedTime,
            phone: userPhone,
            goatPoints: discount != false ? userPoints : '',
            strikes: userStrikes,
            userId: user.uid,
        }

        await firebase
            .firestore()
            .collection('Calendar')
            .doc(moment(selectedDate).format('MMM YY'))
            .collection(moment(selectedDate).format('YYYY-MM-DD'))
            .doc(selectedTime)
            .set(userAppointmentInfo, { merge: false })
            .then(() => {
                addAppointmentDataBase(selectedDate, selectedTime)
                Alert.alert(
                    'Appointment Scheduled',
                    `Thanks ${userName}, your appointment has been scheduled`,
                    [
                        {
                            text: 'Okay',
                        },
                    ]
                )
            })
            .catch((e) => {
                alert('Something went wrong try again', e)
            })
    }

    const addAppointmentDataBase = async (selectedDate, selectedTime) => {
        const appointmentData = {
            time: selectedTime,
            points: discount != false ? userPoints : '',
            haircutType: haircutType,
        }
        await firebase
            .firestore()
            .collection('users')
            .doc(user.uid)
            .collection('Haircuts')
            .doc(selectedDate)
            .set(appointmentData, { merge: true })
        discount != false
            ? await firebase
                  .firestore()
                  .collection('users')
                  .doc(user.uid)
                  .set({ points: '0' }, { merge: true })
            : null
    }

    const selectedHaircutType = (selectedHaircut) => {
        setHaircutType(selectedHaircut)
    }

    useEffect(() => {
        removeMonSun()
        getUserId()
        getBarberInfo()
    }, [])

    return (
        <View style={styles.container}>
            <View style={{ flex: 1 }}>
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
            <View style={{ flex: 3 }}>
                <ListItem containerStyle={styles.ListItem}>
                    <ListItem.Content>
                        <ListItem.Title
                            style={{ color: '#fff', paddingBottom: 5 }}
                        >
                            Appointment Type
                        </ListItem.Title>
                        <ListItem.CheckBox
                            containerStyle={{
                                backgroundColor: '#121212',
                                width: '100%',
                                padding: 5,
                                margin: 5,
                            }}
                            textStyle={{ color: '#fff' }}
                            title="Men's Haircut"
                            checked={haircutType === 'mens' ? true : false}
                            onPress={() => selectedHaircutType('mens')}
                        />

                        <ListItem.CheckBox
                            containerStyle={{
                                backgroundColor: '#121212',
                                width: '100%',
                                padding: 5,
                                margin: 5,
                            }}
                            textStyle={{ color: '#fff' }}
                            title="Kid's Haircut"
                            checked={haircutType === 'kids' ? true : false}
                            onPress={() => selectedHaircutType('kids')}
                        />
                    </ListItem.Content>
                </ListItem>
                <CalendarStrip
                    scrollable
                    style={{ height: 100, paddingTop: 10, paddingBottom: 10 }}
                    calendarHeaderStyle={{ color: '#E8BD70', fontSize: 17 }}
                    calendarColor={'#121212'}
                    dateNumberStyle={{ color: 'white' }}
                    dateNameStyle={{ color: 'white' }}
                    iconContainer={{ flex: 0.1 }}
                    highlightDateNameStyle={{ color: 'white' }}
                    highlightDateNumberStyle={{
                        fontWeight: 'bold',
                        color: 'white',
                    }}
                    highlightDateContainerStyle={{ backgroundColor: '#E8BD70' }}
                    startingDate={moment()}
                    minDate={moment()}
                    maxDate={moment().add(30, 'days')}
                    selectedDate={selectedDate}
                    onDateSelected={onDateSelected}
                    datesBlacklist={calendarDatesRemoved}
                />
                {console.log('newTimes', newTimes)}
                {!isLoading && Object.keys(newTimes).length !== 0 ? (
                    <ScrollView horizontal={true} style={{ padding: 0 }}>
                        {Object.entries(newTimes).map((onekey, i) => (
                            <ListItem
                                bottomDivider
                                containerStyle={{ backgroundColor: '#000' }}
                                key={i}
                                onPress={() => scheduleAppointment(onekey[0])}
                            >
                                <ListItem.Content
                                    style={{
                                        backgroundColor: '#E8BD70',
                                        borderRadius: 10,
                                        padding: 0,
                                    }}
                                >
                                    <ListItem.Title style={styles.listText}>
                                        {onekey[1] ? null : onekey[0]}
                                    </ListItem.Title>
                                </ListItem.Content>
                            </ListItem>
                        ))}
                    </ScrollView>
                ) : isLoading ? (
                    <ScrollView
                        horizontal={true}
                        style={{ padding: 0, alignSelf: 'center' }}
                    >
                        <ListItem
                            bottomDivider
                            containerStyle={{ backgroundColor: '#000' }}
                        >
                            <ListItem.Content
                                style={{ borderRadius: 10, padding: 0 }}
                            >
                                <ActivityIndicator color='#fff' size='large' />
                            </ListItem.Content>
                        </ListItem>
                    </ScrollView>
                ) : (
                    Object.keys(newTimes).length == 0 && (
                        <ScrollView
                            horizontal={true}
                            style={{ padding: 0, alignSelf: 'center' }}
                        >
                            <ListItem
                                bottomDivider
                                containerStyle={{
                                    backgroundColor: '#000',
                                }}
                            >
                                <ListItem.Content
                                    style={{
                                        backgroundColor: '#E8BD70',
                                        borderRadius: 10,
                                        padding: 0,
                                    }}
                                >
                                    <ListItem.Title style={styles.listText}>
                                        Selected a Date
                                    </ListItem.Title>
                                </ListItem.Content>
                            </ListItem>
                        </ScrollView>
                    )
                )}
            </View>
            <View style={{ flex: 2 }}>
                <ListItem
                    bottomDivider
                    containerStyle={{ backgroundColor: '#000' }}
                >
                    <ListItem.Content style={{ borderRadius: 10, padding: 0 }}>
                        <ListItem.Title style={{ color: '#fff' }}>
                            For a Friend?
                        </ListItem.Title>
                        <InputField
                            inputStyle={{
                                fontSize: 14,
                            }}
                            containerStyle={{
                                backgroundColor: '#fff',
                                borderColor: 'black',
                                borderWidth: 1,
                            }}
                            leftIcon='account-plus'
                            placeholder='Friends Name'
                            autoCapitalize='words'
                            value={friend}
                            onChangeText={(text) => setFriend(text)}
                        />
                        <ListItem.Title style={{ color: '#fff' }}>
                            Comments/Notes
                        </ListItem.Title>
                        <InputField
                            inputStyle={{
                                fontSize: 14,
                            }}
                            containerStyle={{
                                backgroundColor: '#fff',
                                borderColor: 'black',
                                borderWidth: 1,
                            }}
                            leftIcon='comment'
                            placeholder='Comment (optional)'
                            autoCapitalize='sentences'
                            value={text}
                            onChangeText={(text) => onChangeText(text)}
                        />
                    </ListItem.Content>
                </ListItem>
            </View>
            <View style={{ flex: 1 }}>
                <ListItem
                    bottomDivider
                    containerStyle={{ backgroundColor: '#121212' }}
                >
                    <ListItem.Content>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 2, alignItems: 'flex-start' }}>
                                <ListItem.Title style={{ color: '#fff' }}>
                                    {formattedDate
                                        ? formattedDate + ' '
                                        : 'Select a Date '}
                                </ListItem.Title>
                                <ListItem.Title style={{ color: '#fff' }}>
                                    {selectedTime
                                        ? selectedTime
                                        : 'Select a Time'}
                                </ListItem.Title>
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: '#E8BD70',
                                        borderRadius: 10,
                                        marginTop: 10,
                                    }}
                                    onPress={() =>
                                        discount === false && userPoints != 0
                                            ? setDiscount(true)
                                            : setDiscount(false)
                                    }
                                >
                                    <ListItem.Title
                                        style={{ color: '#000', padding: 5 }}
                                    >
                                        GP: {userPoints}
                                    </ListItem.Title>
                                </TouchableOpacity>
                            </View>
                            <View style={{ flex: 3, alignItems: 'flex-end' }}>
                                <ListItem.Title style={{ color: 'white' }}>
                                    {haircutType === 'mens'
                                        ? "Men's Haircut "
                                        : "Kid's Haircut "}
                                    {haircutType === 'mens'
                                        ? '$' + insertDecimal(barberInfo.price)
                                        : subtractPrice(
                                              haircutType,
                                              barberInfo.price
                                          )}
                                    {discount != false && (
                                        <ListItem.Title style={styles.text}>
                                            -${insertDecimal(userPoints)}
                                        </ListItem.Title>
                                    )}
                                </ListItem.Title>
                                <ListItem.Title style={{ color: 'white' }}>
                                    {discount != false
                                        ? 'New Total: $' +
                                          subtractDiscount(
                                              haircutType,
                                              barberInfo.price,
                                              userPoints
                                          )
                                        : ' '}
                                </ListItem.Title>
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: '#E8BD70',
                                        borderRadius: 10,
                                        marginTop: 10,
                                    }}
                                    onPress={() =>
                                        scheduleAppoint(
                                            formattedDate,
                                            selectedTime
                                        )
                                    }
                                >
                                    <ListItem.Title
                                        style={{ color: '#000', padding: 5 }}
                                    >
                                        Schedule Appointment
                                    </ListItem.Title>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ListItem.Content>
                </ListItem>
            </View>
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
    text: {
        color: '#fff',
        padding: 5,
    },
    listText: {
        color: '#000',
        padding: 5,
        margin: 0,
    },
    ListItem: {
        backgroundColor: '#121212',
    },
})

export default AppointmentScreen
