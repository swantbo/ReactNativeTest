import React, { useEffect, useState } from 'react'
import {
    View,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Alert,
    Linking,
    TouchableOpacity,
} from 'react-native'
import CalendarStrip from 'react-native-calendar-strip'
import moment from 'moment'
import { ListItem, Button } from 'react-native-elements'
import { formatPhoneNumber } from '../../../utils/DataFormatting'
import * as firebase from 'firebase'

import { AuthenticatedUserContext } from '../../../navigation/AuthenticatedUserProvider'

const CalendarScreen = ({ navigation }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [calendarData, setCalendarData] = useState([])
    const [selectedDate, setSelectedDate] = useState(moment())
    const [formattedDate, setFormattedDate] = useState()
    const [availibility, setAvailibility] = useState({
        Sunday: '',
        Monday: '',
        Tuesday: '',
        Wednesday: '',
        Thursday: '',
        Friday: '',
        Saturday: '',
    })

    async function getAvailibility() {
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

    const splitHours = async (selectedDate) => {
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
        let newIntervals = []
        while (startTime <= endTime) {
            let newobj = {
                time: moment(startTime, 'HH:mm a')
                    .format('hh:mm A')
                    .toString()
                    .replace(/^(?:00:)?0?/, ''),
            }
            newIntervals.push(newobj)
            startTime.add(30, 'minutes')
        }
        onGetData(selectedDate, newIntervals)
    }

    async function onGetData(selectedDate, newIntervals) {
        await firebase
            .firestore()
            .collection('Calendar')
            .doc(moment(selectedDate).format('MMM YY'))
            .collection(moment(selectedDate).format('YYYY-MM-DD'))
            .get()
            .then((snapshot) => {
                let data = []
                snapshot.forEach((doc) => {
                    const tempData = doc.data()
                    data.push(tempData)
                })
                let test
                const calendarTimes = newIntervals.map(
                    (obj) => data.find((o) => o.time === obj.time) || obj
                )
                let result = data.filter(
                    (o1) => !newIntervals.some((o2) => o1.time === o2.time)
                )
                if (result.length > 0) {
                    let testResults = [...calendarTimes, ...result]
                    testResults.sort(
                        (a, b) =>
                            moment(a.time, 'HH:mm a') -
                            moment(b.time, 'HH:mm a')
                    )
                    setCalendarData(testResults)
                }
                if (result.length === 0) {
                    setCalendarData(calendarTimes)
                }
                setIsLoading(false)
            })
            .catch((e) => {
                Alert.alert('Error', `Unable to get data, try again. ${e}`)
            })
    }

    useEffect(() => {
        setSelectedDate(moment())
        getAvailibility()
    }, [])

    const onDateSelected = (selectedDate) => {
        setSelectedDate(selectedDate.format('YYYY-MM-DD'))
        setFormattedDate(selectedDate.format('YYYY-MM-DD'))
        setIsLoading(true)
        splitHours(selectedDate)
    }

    const deleteAppointment = (deleteTime) => {
        firebase
            .firestore()
            .collection('Calendar')
            .doc(moment(selectedDate).format('MMM YY'))
            .collection(moment(selectedDate).format('YYYY-MM-DD'))
            .doc(deleteTime)
            .delete()
            .then(() => {
                Alert.alert('Success', 'Appointment Deleted')
            })
            .catch((e) => {
                Alert.alert(
                    'Error',
                    `Unable to delete appointment. Try again. ${e}`
                )
            })
    }

    const addStrike = (user_id, strikes) => {
        const strikesTotal = 1 + Number(strikes)

        const newStikes = {
            strikes: strikesTotal?.toString(),
        }
        firebase
            .firestore()
            .collection('users')
            .doc(user_id)
            .set(newStikes, { merge: true })
            .catch((e) => {
                alert('Unable to add Strikes to user, try again')
            })
    }

    return (
        <View style={styles.container}>
            <View style={{ flex: 1 }}>
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
                    selectedDate={selectedDate}
                    onDateSelected={onDateSelected}
                />
            </View>
            <View style={{ flex: 7 }}>
                <ListItem bottomDivider containerStyle={styles.ListItem}>
                    <ListItem.Content
                        style={{ alignItems: 'center', marginTop: -5 }}
                    >
                        <ListItem.Title style={{ color: '#fff' }}>
                            {' '}
                            {formattedDate
                                ? formattedDate
                                : 'Choose a date'}{' '}
                        </ListItem.Title>
                    </ListItem.Content>
                </ListItem>
                {isLoading ? (
                    <ActivityIndicator size='large' color='#0000ff' />
                ) : (
                    calendarData && (
                        <ScrollView
                            style={{ borderColor: 'black', borderRadius: 15 }}
                        >
                            {calendarData.map((key, index) => (
                                <ListItem.Swipeable
                                    key={`${key.name}_${key.phone}_${key.time}_${key.comment}`}
                                    bottomDivider
                                    containerStyle={styles.ListItem}
                                    rightContent={
                                        <Button
                                            title='Delete'
                                            icon={{
                                                name: 'delete',
                                                color: 'white',
                                            }}
                                            buttonStyle={{
                                                minHeight: '100%',
                                                backgroundColor: 'red',
                                            }}
                                            onPress={() =>
                                                key.name && key.name !== 'Off'
                                                    ? Alert.alert(
                                                          'Delete',
                                                          `Are you sure you want to delete this ${'\n'}Appointment Time ${
                                                              key.time
                                                          } ${'\n'} with Client: ${
                                                              key.name
                                                          }`,
                                                          [
                                                              {
                                                                  text: 'Cancel',
                                                              },
                                                              {
                                                                  text: 'Delete Appointment',
                                                                  onPress: () =>
                                                                      deleteAppointment(
                                                                          key.time
                                                                      ),
                                                              },
                                                          ]
                                                      )
                                                    : key.name === 'Off'
                                                    ? Alert.alert(
                                                          'Delete Time Off',
                                                          `Are you sure you want to remove ${'\n'} ${formattedDate} at ${
                                                              key.time
                                                          } from requested time off?`,
                                                          [
                                                              {
                                                                  text: 'Cancel',
                                                              },
                                                              {
                                                                  text: 'Delete Time Off',
                                                                  onPress: () =>
                                                                      deleteAppointment(
                                                                          key.time
                                                                      ),
                                                              },
                                                          ]
                                                      )
                                                    : null
                                            }
                                        />
                                    }
                                    leftContent={
                                        key.name &&
                                        key.name !== 'Off' && (
                                            <Button
                                                title={
                                                    key.strikes
                                                        ? 'Strikes: ' +
                                                          key.strikes
                                                        : 'Add Strike'
                                                }
                                                icon={{
                                                    name: 'add-circle',
                                                    color: 'white',
                                                }}
                                                buttonStyle={{
                                                    minHeight: '100%',
                                                    backgroundColor: 'red',
                                                }}
                                                onPress={() =>
                                                    Alert.alert(
                                                        'No Call No Show',
                                                        `Would you like to add a strike to Account Name: ${
                                                            key.name
                                                                ? key.name
                                                                : 'N/A'
                                                        } ${'\n'}Account Id: ${
                                                            key.id
                                                                ? key.id
                                                                : 'N/A'
                                                        }`,
                                                        [
                                                            {
                                                                text: 'Cancel',
                                                            },
                                                            {
                                                                text: 'Add Strike',
                                                                onPress: () =>
                                                                    addStrike(
                                                                        key.userId,
                                                                        key.strikes
                                                                    ),
                                                            },
                                                        ]
                                                    )
                                                }
                                            />
                                        )
                                    }
                                    onPress={() =>
                                        !key.name
                                            ? navigation.navigate(
                                                  'AdminAddAppointmentScreen',
                                                  {
                                                      formattedDate,
                                                      time: [`${key.time}`],
                                                  }
                                              )
                                            : key.name === 'Off'
                                            ? Alert.alert(
                                                  'Time Off',
                                                  `Would you like to schedule an appointment during your time off on ${formattedDate} at ${key.time}?`,
                                                  [
                                                      {
                                                          text: 'Cancel',
                                                      },
                                                      {
                                                          text: 'Schedule Appointment',
                                                          onPress: () =>
                                                              navigation.navigate(
                                                                  'AdminAddAppointmentScreen',
                                                                  {
                                                                      formattedDate,
                                                                      time: [
                                                                          `${key.time}`,
                                                                      ],
                                                                  }
                                                              ),
                                                      },
                                                  ]
                                              )
                                            : null
                                    }
                                >
                                    <ListItem.Content>
                                        <View
                                            style={{
                                                flex: 1,
                                                flexDirection: 'row',
                                            }}
                                        >
                                            <View
                                                style={{
                                                    flex: 1,
                                                    alignItems: 'flex-start',
                                                }}
                                            >
                                                <ListItem.Title
                                                    style={styles.text}
                                                >
                                                    {key.time}
                                                </ListItem.Title>
                                            </View>
                                            {!key.name && (
                                                <View
                                                    style={{
                                                        flex: 2,
                                                        alignItems: 'flex-end',
                                                    }}
                                                >
                                                    <ListItem.Title
                                                        style={{
                                                            color: '#E8BD70',
                                                        }}
                                                    >
                                                        Avaliable
                                                    </ListItem.Title>
                                                </View>
                                            )}
                                        </View>
                                        <View
                                            style={{
                                                flex: 1,
                                                flexDirection: 'row',
                                            }}
                                        >
                                            <View
                                                style={{
                                                    flex: 1,
                                                    alignItems: 'flex-start',
                                                }}
                                            >
                                                <ListItem.Subtitle
                                                    style={styles.text}
                                                >
                                                    {key.name}{' '}
                                                    {key.friend != '' &&
                                                    undefined
                                                        ? 'Friend: ' +
                                                          key.friend
                                                        : ''}
                                                </ListItem.Subtitle>
                                            </View>
                                            {key.name !== 'Off' && key.name && (
                                                <View
                                                    style={{
                                                        flex: 2,
                                                        alignItems: 'flex-end',
                                                    }}
                                                >
                                                    <ListItem.Subtitle
                                                        style={styles.text}
                                                    >
                                                        {key?.haircutType ===
                                                        'mens'
                                                            ? "Men's Haircut"
                                                            : key?.haircutType ===
                                                              'kids'
                                                            ? "Kid's Haircut"
                                                            : ''}
                                                    </ListItem.Subtitle>
                                                </View>
                                            )}
                                        </View>
                                        <View
                                            style={{
                                                flex: 1,
                                                flexDirection: 'row',
                                            }}
                                        >
                                            {key.name ? (
                                                <>
                                                    <View style={{ flex: 2 }}>
                                                        <TouchableOpacity
                                                            onPress={() =>
                                                                Linking.openURL(
                                                                    `sms:${key?.phone}`
                                                                ).catch(() => {
                                                                    Linking.openURL(
                                                                        `sms:${key?.phone}`
                                                                    )
                                                                })
                                                            }
                                                        >
                                                            <ListItem.Subtitle
                                                                style={{
                                                                    color: '#fff',
                                                                }}
                                                            >
                                                                {formatPhoneNumber(
                                                                    key?.phone
                                                                )
                                                                    ? formatPhoneNumber(
                                                                          key?.phone
                                                                      )
                                                                    : key.phone}
                                                            </ListItem.Subtitle>
                                                        </TouchableOpacity>
                                                    </View>
                                                    <View
                                                        style={{
                                                            flex: 2,
                                                            alignItems:
                                                                'flex-end',
                                                        }}
                                                    >
                                                        <ListItem.Subtitle
                                                            style={styles.text}
                                                        >
                                                            Goat Points:{' '}
                                                            {key.goatPoints
                                                                ? key.goatPoints
                                                                : '0'}
                                                        </ListItem.Subtitle>
                                                    </View>
                                                </>
                                            ) : null}
                                        </View>
                                        {key.comment ? (
                                            <ListItem.Subtitle
                                                style={styles.text}
                                            >
                                                Comment: {key.comment}
                                            </ListItem.Subtitle>
                                        ) : null}
                                        <ListItem.Subtitle>
                                            {key.userId}
                                        </ListItem.Subtitle>
                                    </ListItem.Content>
                                </ListItem.Swipeable>
                            ))}
                        </ScrollView>
                    )
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
    ListItem: {
        backgroundColor: '#121212',
    },
    text: {
        color: '#fff',
    },
})

export default CalendarScreen
