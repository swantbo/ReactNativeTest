import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, Text, Button } from 'react-native';
import { ListItem } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { formatPhoneNumber } from '../../utils/DataFormatting';

import * as firebase from 'firebase';

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

    useEffect(() => {
        getUsers()
        }, [])

    return(
        <View style={styles.container}>
            <ScrollView>
                { userInfo &&
                    userInfo.map((onekey, i) => (
                        <><ListItem bottomDivider containerStyle={styles.ListItem} key={i}>
                            <ListItem.Content>
                                <View style={{flex: 1, flexDirection: 'row'}}>
                                    <View style={{flex: 1, alignItems: 'flex-start' }}>
                                        <ListItem.Title style={{ fontWeight: 'bold', paddingBottom: 10, color: '#fff'}} key={i}>{onekey.name} </ListItem.Title>
                                    </View>
                                    <View style={{flex: 1, alignItems: 'flex-end'}}>
                                        <Ionicons style={{alignSelf: 'flex-end'}} name="trash" color={'#E8BD70'} size={30} color="#E8BD70"     
                                             onPress={() => Alert.alert('Delete', `Are you sure you want to delete ${"\n"}Account Name: ${onekey.name ? onekey.name : 'N/A'} ${"\n"}Account Id: ${onekey.id ? onekey.id : 'N/A'}`, 
                                             [
                                                 {
                                                   text: "Cancel"
                                                 },
                                                 { text: "Delete User", onPress: () => (deleteUser(onekey.id)) }
                                               ]) }
                                        />
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
                                        <View style={{flex: 1, alignItems: 'flex-start' }}>
                                            <ListItem.Subtitle style={styles.text}>UserId: {onekey.id ? onekey.id : 'N/A'}</ListItem.Subtitle>
                                        </View>
                                        <View style={{flex: 1, alignItems: 'flex-end'}}>
                                            <ListItem.Subtitle style={styles.text}>Goat Points: {onekey.points}</ListItem.Subtitle>
                                            <Ionicons name="add-circle" color={'#E8BD70'} size={30} color="#E8BD70"     
                                            onPress={() => navigation.navigate('Points', {
                                                name: onekey.name,
                                                userId: onekey.id,
                                                goatPoints: onekey.points,
                                            })}/>
                                        </View>
                                    </View>
                            </ListItem.Content>
                        </ListItem>
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