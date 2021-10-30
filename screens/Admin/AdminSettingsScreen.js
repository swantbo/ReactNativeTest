import React, { useEffect, useState, useContext } from "react";
import { View, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { Card, ListItem, Button, Icon } from 'react-native-elements'

import * as firebase from 'firebase';
import { AuthenticatedUserContext } from '../../navigation/AuthenticatedUserProvider'

import Firebase from '../../config/firebase';

const auth = Firebase.auth();

const AdminSettingsScreen = ({navigation}) => {
    const { user } = useContext(AuthenticatedUserContext);
    const [isLoading, setIsLoading] = useState(false);
    const [userInfo, setUserInfo] = useState({});
    const [changeUserInfo, setChangeUserInfo] = useState();
    const [newUserInfo, setNewUserInfo] = useState('');
    const [userDataType, setUserDataType] = useState('');
    
    const handleSignOut = async () => {
        try {
          await auth.signOut();
        } catch (error) {
          console.log(error);
        }
      };


    const changeInfo = (onekey) => {
        setChangeUserInfo(onekey[1])
        setUserDataType(onekey[0].toLowerCase())
    }

    const setUserData = (newUserInfo) => {
        const updateUserData = {
            [`${userDataType}`] : newUserInfo
        }
        firebase.firestore().collection('Test').doc(user.uid).update(updateUserData);
    }

    function getUserData() {
        firebase.firestore().collection('users').doc(user.uid).get().then((userData) => {
            const userInfo = {
                Name: userData.data().name,
                Phone: userData.data().phone,
            };
            setIsLoading(true)
            setUserInfo(userInfo)
        });
    }

    useEffect(() => {
        getUserData()
        }, [])

    return(
        <>
        <View style={styles.container}>
            <ListItem containerStyle={{backgroundColor: '#101010'}} bottomDivider>
                <ListItem.Content >
                    <ListItem.Title style={{ fontWeight: 'bold', alignSelf: 'center', color: 'white' }}>My Account Details</ListItem.Title>
                </ListItem.Content>
            </ListItem>
            { changeUserInfo &&
                <View>
                    <><TextInput
                        placeholder={changeUserInfo}
                        onChangeText={setNewUserInfo}
                        value={newUserInfo}
                        style={styles.textInput} />
                        <Button title="Change Information" onPress={() => setUserData(newUserInfo)}/>
                    </>
                </View>
            }
            { isLoading ?
                <>
                {Object.entries(userInfo).map((onekey, index) => (
                    <ListItem  key={index} containerStyle={{backgroundColor: '#101010'}} bottomDivider onPress={() => changeInfo(onekey)} >
                        <ListItem.Content>
                            <ListItem.Title style={{ color: 'white' }}> {onekey[0]}: {onekey[1]} </ListItem.Title>
                        </ListItem.Content>
                    </ListItem>
                ))}

                <ListItem containerStyle={{backgroundColor: '#101010'}} bottomDivider onPress={() => navigation.navigate('EditAccountScreen')}>
                    <ListItem.Content>
                        <ListItem.Title style={{ color: 'white' }}>View Clients</ListItem.Title>
                    </ListItem.Content>
                </ListItem>
                <ListItem containerStyle={{backgroundColor: '#101010'}} bottomDivider onPress={() => handleSignOut()}>
                    <ListItem.Content>
                        <ListItem.Title style={{ fontWeight: 'bold', alignSelf: 'center', color: 'white' }}>Sign Out</ListItem.Title>
                    </ListItem.Content>
                </ListItem>
            </>
            : 
              <ActivityIndicator color='#000' size='large'/>
            }
        </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    textInput: {
        borderWidth: 1,
        borderColor: 'grey',
        padding: 10,
        marginBottom: 20,
        borderRadius: 5,
    },
    containerStyle: {
        backgroundColor: 'grey'
    }
  });

export default AdminSettingsScreen