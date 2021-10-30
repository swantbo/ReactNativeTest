import React, { useEffect, useState, useContext } from "react";
import { View, StyleSheet, TextInput } from "react-native";
import { ListItem, Button } from 'react-native-elements'
import * as firebase from 'firebase';
import { formatPhoneNumber } from "../../utils/DataFormatting";

import Firebase from '../../config/firebase';

import { AuthenticatedUserContext } from '../../navigation/AuthenticatedUserProvider';

const auth = Firebase.auth();

const SettingsScreen = () => {
    const { user } = useContext(AuthenticatedUserContext);
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
        firebase.firestore().collection('users').doc(user.uid).update(updateUserData);
    }

    function getUserData() {
        firebase.firestore().collection('users').doc(user.uid).get().then((userData) => {
            const userInfo = {
                Name: userData.data().name,
                Phone: formatPhoneNumber(userData.data().phone) ? formatPhoneNumber(userData.data().phone) : userData.data().phone,
            };
            setUserInfo(userInfo)
        });
    }

    useEffect(() => {
        getUserData()
        }, [])

    return(
        <View style={styles.container}>
            <ListItem bottomDivider>
                <ListItem.Content>
                    <ListItem.Title style={{ fontWeight: 'bold', alignSelf: 'center' }}>My Account Details</ListItem.Title>
                </ListItem.Content>
            </ListItem>
            { changeUserInfo &&
                <View>
                    <><TextInput
                        placeholder={changeUserInfo}
                        onChangeText={setNewUserInfo}
                        value={newUserInfo}
                        style={styles.textInput} />
                        <Button title={`Change ${userDataType.charAt(0).toUpperCase() + userDataType.slice(1)}`} onPress={() => setUserData(newUserInfo)}/>
                    </>
                </View>
            }
            { Object.entries(userInfo).map((onekey, index) => (
                <ListItem key={index} bottomDivider onPress={() => changeInfo(onekey)} >
                    <ListItem.Content>
                        <ListItem.Title> {onekey[0]}: {onekey[1]} </ListItem.Title>
                    </ListItem.Content>
                </ListItem>
            ))}
            <ListItem bottomDivider onPress={() => handleSignOut()}>
                <ListItem.Content>
                    <ListItem.Title style={{ fontWeight: 'bold', alignSelf: 'center' }}>Sign Out</ListItem.Title>
                </ListItem.Content>
            </ListItem>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      alignContent: 'flex-start',
      backgroundColor: '#fff',
      justifyContent: 'center',
    },
    textInput: {
        borderWidth: 1,
        borderColor: 'grey',
        padding: 10,
        marginBottom: 20,
        borderRadius: 5,
    },
  });

export default SettingsScreen