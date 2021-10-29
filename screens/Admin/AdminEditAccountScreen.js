import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, Text, Button } from 'react-native';
import { ListItem } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
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
        firebase.firestore().collection('users').doc(user_id).delete.catch((e) => {
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
                        <><ListItem bottomDivider key={i} onPress={() => Alert.alert('Delete', `Are you sure you want to delete ${"\n"}Account Name: ${onekey.name ? onekey.name : 'N/A'} ${"\n"}Account Id: ${onekey.id ? onekey.id : 'N/A'}`, 
                        [
                            {
                              text: "Cancel"
                            },
                            { text: "Delete User", onPress: () => (deleteUser(onekey.id)) }
                          ]) }>
                            <ListItem.Content>
                                    <ListItem.Title style={{ fontWeight: 'bold', textAlign: 'center', alignSelf: 'center', paddingBottom: 10}} key={i}>{onekey.name} </ListItem.Title>
                                <View style={{flex: 1, flexDirection: 'row'}}>
                                    <View style={{flex: 1, alignItems: 'flex-start' }}>
                                        <ListItem.Subtitle>{formatPhoneNumber(onekey.phone) ? formatPhoneNumber(onekey.phone) : onekey.phone}</ListItem.Subtitle>
                                    </View>
                                    <View style={{flex: 1, alignItems: 'flex-end'}}>
                                        <ListItem.Subtitle>{onekey.referral ? 'Referral: ' + onekey.referral : 'No Referral'} </ListItem.Subtitle>
                                    </View>
                                </View>
                                    <View style={{flex: 1, flexDirection: 'row'}}>
                                        <View style={{flex: 1, alignItems: 'flex-start' }}>
                                            <ListItem.Subtitle>UserId: {onekey.id ? onekey.id : 'N/A'}</ListItem.Subtitle>
                                        </View>
                                        <View style={{flex: 1, alignItems: 'flex-end'}}>
                                            <Button title={`Goat Points: ${onekey.points}`} onPress={() => navigation.navigate('Points', {
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
      backgroundColor: '#fff',
      justifyContent: 'center',
      alignContent: 'center',
      padding: 10
    }
  });

export default AdminEditAccountScreen