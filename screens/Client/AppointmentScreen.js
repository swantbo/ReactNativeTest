import moment from 'moment';
import React, { useEffect, useState, useContext } from 'react';
import { View, StyleSheet, Text, ScrollView, Button, ActivityIndicator, Alert } from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';
import { Card, ListItem, CheckBox } from 'react-native-elements';
import { getUserData, getUserDate, getUserId } from '../../utils/Firebase'

import { InputField } from '../../components';
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
    const [userStrikes, setUserStrikes] = useState('')
    const [text, onChangeText] = useState('')
    const [userPoints, setUserPoints] = useState('')
    const [newTimes, setNewTimes] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [friend, setFriend] = useState('')
    const [haircutType, setHaircutType] = useState('mens')

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
                const userStrikes =doc.data().strikes
                setUserName(userNameData ), setUserPhone( userPhoneData), setUserPoints(userPoints), setUserStrikes(userStrikes)
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
        Promise.all([weekDay]).then(values => {
            createAvailableTimes(availibility[`${values}`], selectedDate)
          });
    }

    function createAvailableTimes(newWeekDay, selectedDate) {
        let arr = newWeekDay
        const newSplitString = arr.toUpperCase().split("-").map(item => item.trim());
        const startTime = moment(newSplitString[0], 'HH:mm a')
        const endTime = moment(newSplitString[1], 'HH:mm a')
        let newIntervals = {}
        while (startTime <= endTime) {
            let newobj = {[moment(startTime, 'HH:mm a').format("hh:mm A").toString().replace(/^(?:00:)?0?/, '')] : '' }
            newIntervals = {...newIntervals, ...newobj}
            startTime.add(30, 'minutes')
        }
        onGetData(selectedDate, newIntervals)
    }

    const onGetData = async (selectedDate, newIntervals) => {
        await firebase.firestore()
        .collection('Calendar')
        .doc(moment(selectedDate).format('MMM YY'))
        .collection(moment(selectedDate).format('YYYY-MM-DD')).get()
        .then(snapshot => {
            let data = {}
            snapshot.forEach(doc => {
                let newdata = {[doc.id] : 'Taken'}
                data = { ...data, ...newdata}
            });
            const tempTimes = ({ ...newIntervals, ...data})
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
            haircutType: haircutType,
            friend: friend,
            comment: text,
            time : selectedTime,
            phone : userPhone,
            goatPoints : discount !=false ? userPoints : '',
            strikes: userStrikes,
            userId: user.uid
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
            points: discount !=false ? userPoints : '',
            haircutType: haircutType
        };
    await firebase.firestore().collection('users').doc(user.uid).collection('Haircuts').doc(selectedDate).set( appointmentData, {merge: true})
    discount != false ? await firebase.firestore().collection('users').doc(user.uid).set({points: '0'} , {merge: true}) : null
    }

    function insertDecimal(num) {
        return (num / 100).toFixed(2);
     }

     function subtractDiscount(goatPoints) {
        const discount = haircutType === 'mens' ? Number(barberInfo.price.replace(/[$.]+/g, '')) - Number(userPoints) : 3500 - Number(userPoints)
        return (discount / 100).toFixed(2)
     }
    
    const selectedHaircutType = (selectedHaircut) => {
		setHaircutType(selectedHaircut) 
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
                <CheckBox
                    containerStyle={{backgroundColor: '#121212'}}
                    textStyle={{color: '#fff'}}
                    title="Men's Haircut"
                    checked={haircutType === 'mens' ? true : false}
                    onPress={() => selectedHaircutType('mens')}
                />
                <CheckBox
                    containerStyle={{backgroundColor: '#121212'}}
                    textStyle={{color: '#fff'}}
                    title="Kid's Haircut"
                    checked={haircutType === 'kids' ? true : false}
                    onPress={() => selectedHaircutType('kids')}
                />
                <ListItem bottomDivider containerStyle={{backgroundColor: '#000'}}>
                    <ListItem.Content style={{ alignItems: 'center' }}>
                        <ListItem.Title style={styles.text}> {formattedDate ? formattedDate : 'Choose a date'} </ListItem.Title>
                    </ListItem.Content>
                </ListItem>
                {/* {!newTimes ? 
                        <ScrollView>
                            <ListItem bottomDivider containerStyle={styles.ListItem}>
                                <ListItem.Content style={{ alignItems: 'center' }}>
                                    <ListItem.Title style={styles.text}>No Available Appointments</ListItem.Title>
                                </ListItem.Content>
                            </ListItem>
                        </ScrollView> : null
                } */}
                {!isLoading && newTimes && !timePicked ?
                    <ScrollView>
                        {Object.entries(newTimes).map((onekey, i) => (
                            <ListItem bottomDivider containerStyle={styles.ListItem} key={i} onPress={() => scheduleAppointment(onekey[0])}>
                                <ListItem.Content>
                                    <ListItem.Title style={styles.text}>{onekey[1] ? null : onekey[0]}</ListItem.Title>
                                </ListItem.Content>
                            </ListItem>
                        ))}
                    </ScrollView> 
                    : isLoading ?
                    <ActivityIndicator color='#000' size='large'/>
                    : timePicked &&
                    <Card containerStyle={{ backgroundColor: '#121212', borderColor: '#fff' }}>
                        <Card.Title style={{ color: '#E8BD70' }}>{selectedDate} @{selectedTime}</Card.Title>
                        <Card.Divider />
                        <Button style={styles.text} color={'#E8BD70'} title={`Use Goat Points: ${userPoints}`} onPress={() => setDiscount(true)}/>
                        <Text style={styles.text}>Price: {haircutType === 'mens' ? barberInfo.price : '$35.00'}</Text>
                        {discount !=false &&
                            <>
                                <Text style={styles.text}>Goat Points: -${insertDecimal(userPoints)}</Text>
                                <Text style={styles.text}>New Price: ${subtractDiscount(userPoints)}</Text>
                            </>
                        }
                        <Text style={styles.text}>Address: {barberInfo.location}</Text>
                        <Text style={styles.text}>Total time: ~30 minutes</Text>
                            <InputField
                            inputStyle={{
                            fontSize: 14,
                            }}
                            containerStyle={{
                            backgroundColor: '#fff',
                            marginBottom: 20,
                            borderColor: 'black', 
                            borderWidth: 1
                            }}
                            leftIcon='account-plus'
                            placeholder='Friends Name'
                            autoCapitalize='words'
                            value={friend}
                            onChangeText={text => setFriend(text)}
                        />
                        <InputField
                            inputStyle={{
                            fontSize: 14,
                            }}
                            containerStyle={{
                            backgroundColor: '#fff',
                            marginBottom: 20,
                            borderColor: 'black', 
                            borderWidth: 1
                            }}
                            leftIcon='comment'
                            placeholder='Comment (optional)'
                            autoCapitalize='sentences'
                            value={text}
                            onChangeText={text => onChangeText(text)}
                        />
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
        color: '#fff',
        padding: 5
    },
    ListItem: {
        backgroundColor: '#121212'
    }
  });

export default AppointmentScreen