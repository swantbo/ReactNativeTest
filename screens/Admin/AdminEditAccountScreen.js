import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, Text } from 'react-native';
import { ListItem, Button } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import { formatPhoneNumber } from '../../utils/DataFormatting';

import * as firebase from 'firebase';
import moment from 'moment';

const AdminEditAccountScreen = ({ navigation }) => {
    const [userInfo, setUserInfo] = useState([]);

    async function getUsers() {
        let data = []
        const snapshot = await firebase.firestore().collection('users').get()
        snapshot.docs.map(doc => 
            {let tempData = doc.data() ;
                let id = doc.id;
                data.push({ id, ...tempData })}
            );
            console.log('data', data)
        setUserInfo(data)
        console.log('userInfo', userInfo)
    }

    const deleteUser = (user_id) => {
        firebase.firestore().collection('users').doc(user_id).delete().catch((e) => {
        alert('Unable to delete user try again')
    })}

    const removeStrike = (user_id, strikes) => {
        if (strikes > 0) {
            const strikesTotal = Number(strikes) - 1
            const newStikes = {
                strikes: strikesTotal.toString()
            }
            firebase.firestore().collection('users').doc(user_id).set(newStikes, {merge: true}).catch((e) => {
                alert('Unable to remove Strikes to user, try again')
            })
        } else {
            alert('User must have strikes to remove them')
        }
    }

    const addStrike = (user_id, strikes) => {
        const strikesTotal = 1 + Number(strikes)

        const newStikes = {
            strikes: strikesTotal.toString()
        }
        firebase.firestore().collection('users').doc(user_id).set(newStikes, {merge: true}).catch((e) => {
        alert('Unable to add Strikes to user, try again')
    })}

    useEffect(() => {
        getUsers()
        }, [])

    return(
        <View style={styles.container}>
            <ScrollView>
                { userInfo &&
                    userInfo.map((onekey, i) => (
                        <><ListItem.Swipeable bottomDivider containerStyle={styles.ListItem} key={i}
                            rightContent={
                                <Button
                                    title="Delete"
                                    icon={{ name: 'delete', color: 'white' }}
                                    buttonStyle={{ minHeight: '100%', backgroundColor: 'red' }}
                                    onPress={() => 
                                        Alert.alert('Delete', `Are you sure you want to delete ${"\n"}Account Name: ${onekey.name ? onekey.name : 'N/A'} ${"\n"}Account Id: ${onekey.id ? onekey.id : 'N/A'}`, 
                                             [
                                                 {
                                                   text: "Cancel"
                                                 },
                                                 { text: "Delete User", onPress: () => (deleteUser(onekey.id)) }
                                               ]) }
                                />
                            }
                            leftContent={
                                <Button
                                    title="Add Points"
                                    icon={{ name: 'add-circle', color: 'white' }}
                                    buttonStyle={{ minHeight: '100%', backgroundColor: 'green' }}
                                    onPress={() => navigation.navigate('Points', {
                                        name: onekey.name,
                                        userId: onekey.id,
                                        goatPoints: onekey.points,
                                    })}
                                />
                            }>
                            
                            <ListItem.Content>
                                <View style={{flex: 1, flexDirection: 'row'}}>
                                    {onekey.created < moment().add(3, 'days') && 
                                        <View style={{}}>
                                            <ListItem.Title style={{ fontWeight: 'bold', paddingBottom: 10, color: 'red'}}>New </ListItem.Title>
                                        </View>
                                    }
                                    <View style={{flex: 2, alignItems: 'flex-start' }}>
                                        <ListItem.Title style={{ fontWeight: 'bold', paddingBottom: 10, color: '#E8BD70'}}>{onekey.name} </ListItem.Title>
                                    </View>
                                    <View style={{flex: 1, alignItems: 'flex-end' }}>
                                        <ListItem.Title style={{ fontWeight: 'bold', paddingBottom: 10, color: 'red'}} 
                                            onPress={() => 
                                                Alert.alert('Strikes', `Would you like to add or remove strikes from ${"\n"}Account Name: ${onekey.name ? onekey.name : 'N/A'} ${"\n"}Account Id: ${onekey.id ? onekey.id : 'N/A'}`, 
                                                [
                                                    {
                                                    text: "Cancel"
                                                    },
                                                    { 
                                                    text: "Remove Strike", onPress: () => (removeStrike(onekey.id, onekey.strikes)) 
                                                    },
                                                    {
                                                    text: 'Add Strike', onPress: () => (addStrike(onekey.id, onekey.strikes))
                                                    }
                                            ])}>
                                            Strikes: {onekey.strikes ? onekey.strikes : 'N/A'}
                                        </ListItem.Title>
                                    </View>
                                </View>
                                <View style={{flex: 1, flexDirection: 'row'}}>
                                    <View style={{flex: 1, alignItems: 'flex-start' }}>
                                        <ListItem.Subtitle style={styles.text}>{formatPhoneNumber(onekey.phone) ? formatPhoneNumber(onekey.phone) : onekey.phone}</ListItem.Subtitle>
                                    </View>
                                    <View style={{flex: 1, alignItems: 'flex-end'}}>
                                        <ListItem.Subtitle style={styles.text}>{onekey.referral ? 'Referral: ' + onekey.referral : 'No Referral'} </ListItem.Subtitle>
                                    </View>
                                </View>
                                    <View style={{flex: 1, flexDirection: 'row'}}>
                                        <View style={{flex: 2, alignItems: 'flex-start' }}>
                                            <ListItem.Subtitle style={styles.text}>{onekey.id ? onekey.id : 'N/A'}</ListItem.Subtitle>
                                        </View>
                                        <View style={{flex: 1, alignItems: 'flex-end'}}>
                                            <ListItem.Subtitle style={styles.text}>Goat Points: {onekey.points}</ListItem.Subtitle>
                                        </View>
                                    </View>
                            </ListItem.Content>
                        </ListItem.Swipeable>
                        </>
                        
                ))}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000'
    },
    text: {
        color: '#fff'
    },
    ListItem: {
        backgroundColor: '#121212'
    }
  });

export default AdminEditAccountScreen