import moment from 'moment';
import React, { useEffect, useState, useContext } from 'react';
import { View, StyleSheet, Text, ScrollView, TextInput, Button, ActivityIndicator, Alert } from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';
import { Card, CheckBox, ListItem } from 'react-native-elements';
import * as firebase from 'firebase';

import { AuthenticatedUserContext } from '../../navigation/AuthenticatedUserProvider';

const AppointmentScreen = () => {
    const { user } = useContext(AuthenticatedUserContext);
    const [selectedDate, setSelectedDate] = useState(moment());
    const [formattedDate, setFormattedDate] = useState();
    const [calendarDatesRemoved, setCalendarDatesRemoved] = useState([])
    const [times, setTimes] = useState({})
    const [timePicked, setTimePicked] = useState(false)
    const [selectedTime, setSelectedTime] = useState('')
    const [barberInfo, setBarberInfo] = useState({'price': '', 'location': ''})
    const [availibility, setAvailibility] = useState({'Tuesday': '', 'Wednesday': '', 'Thursday': '', 'Friday': '', 'Saturday': ''})
    const [userName, setUserName] = useState('')
    const [userPhone, setUserPhone] = useState('')
    const [text, onChangeText] = useState('')
    const [userPoints, setUserPoints] = useState('')
    const [newTimes, setNewTimes] = useState({})
    const [previousAppointment, setPreviousAppointment] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const clearState = () => {
        setSelectedDate(moment())
        setFormattedDate(undefined)
        setIsLoading(false)
    }

    async function getUserId() {
            await firebase.firestore().collection("users").doc(user.uid).get().then((doc) => {
                const userNameData = doc.data().name
                const userPhoneData = doc.data().phone
                const userPoints = doc.data().points
                setUserName(userNameData ), setUserPhone( userPhoneData), setUserPoints(userPoints)
            })
        
            await firebase.firestore().collection('Barber').doc('Nate').get().then((doc) => {
            const databaseAvailibility = {...availibility, ...doc.data()}
            setAvailibility({ ...availibility, ...databaseAvailibility})
        })
    }

    const removeMonSun = () => {
        let dateArray = []
        let currentDate = moment()
        const stopDate = moment().add(30, 'days');
        while (currentDate <= stopDate) {
            if(moment(currentDate).format('dddd') == 'Sunday' || moment(currentDate).format('dddd') == 'Monday' ) {
                dateArray.push( moment(currentDate).format('YYYY-MM-DD'))
            }
            currentDate = moment(currentDate).add(1, 'days');
        }
        setCalendarDatesRemoved( dateArray)
    }

    const onDateSelected = selectedDate => {
        setIsLoading(true)
        setTimePicked(false)
        setSelectedDate(selectedDate.format('YYYY-MM-DD'));
        setFormattedDate(selectedDate.format('YYYY-MM-DD'));
        splitHours(selectedDate)
    }

    const splitHours = (selectedDate) => {
        const weekDay = Promise.resolve(moment(selectedDate, "YYYY-MM-DD HH:mm:ss").format('dddd').toString())
        console.log('weekDay', weekDay)
        Promise.all([weekDay]).then(values => {
            createAvailableTimes(availibility[`${values}`], selectedDate)
            console.log('availibility[`${values}`]', availibility[`${values}`])
          });
    }

    function createAvailableTimes(newWeekDay, selectedDate) {
        let arr = newWeekDay
        const newSplitString = arr.toUpperCase().split("-").map(item => item.trim());
        const startTime = moment(newSplitString[0], 'HH:mm a')
        const endTime = moment(newSplitString[1], 'HH:mm a')
        console.log('startTime', startTime, endTime)
        let newIntervals = {}
        while (startTime <= endTime) {
            let newobj = {[moment(startTime, 'HH:mm a').format("hh:mm A").toString().replace(/^(?:00:)?0?/, '')] : '' }
            newIntervals = {...newIntervals, ...newobj}
            startTime.add(30, 'minutes')
        }
        console.log('newIntervals', newIntervals)
        onGetData(selectedDate, newIntervals)
    }

    const onGetData = async (selectedDate, newIntervals) => {
        console.log('selectedDate', selectedDate)
        await firebase.firestore()
        .collection('Calendar')
        .doc(moment(selectedDate).format('MMM YY'))
        .collection(moment(selectedDate).format('YYYY-MM-DD')).get()
        .then(snapshot => {
            let data = {}
            console.log('snapshot', snapshot)
            snapshot.forEach(doc => {
                let newdata = {[doc.id] : 'Taken'}
                data = { ...data, ...newdata}
                console.log('newdata', newdata)
            });
            const tempTimes = ({ ...newIntervals, ...data})
            console.log('times', times)
            let newTime ={}
                if (tempTimes) {
                    Object.entries(tempTimes).map((key, i) => {
                        let tempTime = {}
                        if(key[1] != 'Taken') { 
                            tempTime = {[key[0]]: key[1]}
                        } 
                        newTime = {...newTime, ...tempTime}
                    })
                } else {
                    newTime = {tempTime}
                }
            setNewTimes(newTime)
            console.log('key', newTime)
            setIsLoading(false)
        })
    }

    const scheduleAppointment = (time) => {
        setTimePicked(true)
        getBarberInfo(time)
    }

    const getBarberInfo = async (time) => {
        await firebase.firestore().collection('Barber').doc('Nate').get().then((testData) => {
            const barberData = {
                'price': testData.data().price,
                'location': testData.data().location
            };
            setBarberInfo({ ...barberInfo, ...barberData})
            setSelectedTime(time)
        });
    };

    const scheduleAppoint = async (selectedDate, selectedTime) => {
        const userAppointmentInfo = {
            name: userName,
            comment: text,
            time : selectedTime,
            phone : userPhone,
            goatPoints : discount !=false ? userPoints : ''
        };

        await firebase.firestore()
        .collection('Calendar')
        .doc(moment(selectedDate).format('MMM YY'))
        .collection(moment(selectedDate).format('YYYY-MM-DD')).doc(selectedTime)
        .set(userAppointmentInfo, {merge: false})
        .then(() => {
            addAppointmentDataBase(selectedDate, selectedTime)
            Alert.alert('Appointment Scheduled',`Thanks ${userName}, your appointment has been scheduled`,
            [
                {
                  text: "Okay"
                }
              ])
        }).catch((e) => {
            alert('Something went wrong try again', e)
        }); 
    }

    const addAppointmentDataBase = async (selectedDate, selectedTime) => {
        const appointmentData = {
            time: selectedTime,
            points: discount !=false ? userPoints : ''
        };
    await firebase.firestore().collection('users').doc(user.uid).collection('Haircuts').doc(selectedDate).set( appointmentData, {merge: true})
    discount != false ? await firebase.firestore().collection('users').doc(user.uid).set({points: '0'} , {merge: true}) : null
    }

    function insertDecimal(num) {
        return (num / 100).toFixed(2);
     }

     function subtractDiscount(goatPoints) {
        const discount = Number(barberInfo.price.replace(/[$.]+/g, '')) - Number(userPoints)
        return (discount / 100).toFixed(2)
     }

    useEffect(() => {
        removeMonSun()
        getUserId()
    }, [])

    const [discount, setDiscount] = useState(false)
    return(
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
                    highlightDateNumberStyle={{ fontWeight: 'bold', color: 'white' }}
                    highlightDateContainerStyle={{ backgroundColor: '#E8BD70' }}
                    startingDate={moment()}
                    minDate={moment()}
                    maxDate={moment().add(30, 'days')}
                    selectedDate={selectedDate}
                    onDateSelected={onDateSelected}
                    datesBlacklist={calendarDatesRemoved} />
            </View>
            <View style={{ flex: 7 }}>
                <ListItem bottomDivider containerStyle={{backgroundColor: '#000'}}>
                    <ListItem.Content style={{ alignItems: 'center' }}>
                        <ListItem.Title style={styles.text}> {formattedDate ? formattedDate : 'Choose a date'} </ListItem.Title>
                    </ListItem.Content>
                </ListItem>
                {!isLoading && times && !timePicked ?
                    <ScrollView>
                        {Object.entries(newTimes).map((onekey, i) => (
                            <ListItem bottomDivider containerStyle={styles.ListItem} onPress={() => scheduleAppointment(onekey[0])}>
                                <ListItem.Content>
                                    <ListItem.Title key={i} style={styles.text}>{onekey[1] ? null : onekey[0]}</ListItem.Title>
                                </ListItem.Content>
                            </ListItem>
                        ))}
                    </ScrollView> 
                    : isLoading ?
                    <ActivityIndicator color='#000' size='large'/>
                    : timePicked &&
                    <Card containerStyle={{ backgroundColor: '#121212', borderColor: '#000' }}>
                        <Card.Title style={{ color: '#E8BD70' }}>{selectedDate} @{selectedTime}</Card.Title>
                        <Card.Divider />
                        <Button style={styles.text} color={'#E8BD70'} title={`Use Goat Points: ${userPoints}`} onPress={() => setDiscount(true)}/>
                        <Text style={styles.text}>Price: {barberInfo.price}</Text>
                        {discount !=false &&
                            <>
                                <Text style={styles.text}>Goat Points: -${insertDecimal(userPoints)}</Text>
                                <Text style={styles.text}>New Price: ${subtractDiscount(userPoints)}</Text>
                            </>
                        }
                        <Text style={styles.text}>Address: {barberInfo.location}</Text>
                        <Text style={styles.text}>Total time: ~30 minutes</Text>
                        <TextInput style = {styles.text}
                            onChangeText={onChangeText}
                            value={text}
                            placeholder="Comment"
                            placeholderTextColor={'#fff'} />
                        <Button color={'#E8BD70'} onPress={() => scheduleAppoint(formattedDate, selectedTime)} title='Confirm Appointment' />
                    </Card> 
                }
            </View>   
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000',
      justifyContent: 'center',
      alignContent: 'center'
    },
    text: {
        color: '#fff'
    },
    ListItem: {
        backgroundColor: '#121212'
    }
  });

export default AppointmentScreen