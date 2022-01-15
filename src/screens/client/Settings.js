import React, {useEffect, useState, useContext} from 'react'
import {View, StyleSheet, TextInput, Alert, TouchableOpacity, SafeAreaView} from 'react-native'
import {ListItem, Card} from 'react-native-elements'
import {Avatar, Center, ScrollView, VStack, Heading, HStack, FlatList, Box, Text, Button} from 'native-base'
import {formatPhoneNumber} from '../../utils/DataFormatting'
import createStyles from '../../styles/base'

import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'
import {connect} from 'react-redux'

import {AuthenticatedUserContext} from '../../navigation/AuthenticatedUserProvider'

import Firebase from '../../config/firebase'
const auth = Firebase.auth()

function Settings(props) {
	const {user} = useContext(AuthenticatedUserContext)
	const [changeName, setChangeName] = useState('')
	const [changePhone, setChangePhone] = useState('')
	const [changeProfilePicture, setChangeProfilePicture] = useState('')

	const pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1
		})

		let cameraImageUri = ''
		if (result) {
			const fileName = result.uri.split('/').pop()
			cameraImageUri = FileSystem.documentDirectory + fileName
			try {
				await FileSystem.moveAsync({from: result.uri, to: cameraImageUri})
				const picture = {
					profilePicture: cameraImageUri
				}
				await Firebase.firestore().collection('users').doc(user.uid).set(picture, {merge: true})
				setChangeProfilePicture(cameraImageUri)
				Alert.alert('Success', `Your Profile Picture has been saved and changed.`)
			} catch (err) {
				Alert.alert('Error', `Unable to save and change Profile Picture. Try again.`)
			}
		}
	}

	const setUserData = () => {
		const updateUserData = {
			name: changePhone,
			phone: changePhone
		}
		try {
			Firebase.firestore().collection('users').doc(user.uid).update(updateUserData)
			Alert.alert('Success', `Your name & phone number have been changed to ${changeName} & ${changePhone}`)
		} catch (error) {
			Alert.alert('There is an error.', err.message)
		}
	}

	const handleSignOut = async () => {
		try {
			await auth.signOut()
		} catch (error) {
			Alert.alert('Error', `Unable to Logout, try again. ${error}`)
		}
	}

	useEffect(() => {
		const {currentUser} = props
		setChangeName(currentUser.name)
		setChangePhone(currentUser.phone)
		setChangeProfilePicture(currentUser.profilePicture)
	}, [props])

	return (
		<ScrollView bgColor={'#000'}>
			<Box bgColor={'#121212'} m={'20px'} p={'5px'}>
				<Center>
					<Avatar size='xl' source={{uri: changeProfilePicture}}></Avatar>
					<Text p={'5px'}>Change Profile Picture</Text>
				</Center>
				<HStack m={'5px'}>
					<Text bold alignSelf={'center'}>
						Name:{' '}
					</Text>
					<TextInput placeholder={changeName} placeholderTextColor={'#fff'} onChangeText={setChangeName} value={changeName} style={styles.settingsTextInput} />
				</HStack>

				<HStack m={'5px'}>
					<Text bold alignSelf={'center'}>
						Phone:{' '}
					</Text>
					<TextInput placeholder={changePhone} placeholderTextColor={'#fff'} onChangeText={setChangePhone} value={changePhone} style={styles.settingsTextInput} />
				</HStack>
				<Center m={'5px'}>
					<Button bgColor={'#E8BD70'} w={'100%'} onPress={() => setUserData()}>
						<Text bold alignSelf={'center'} color={'#000'}>
							Save Changes
						</Text>
					</Button>
				</Center>
				<Center m={'5px'}>
					<Button bgColor={'#E8BD70'} w={'100%'} onPress={() => handleSignOut()}>
						<Text bold alignSelf={'center'} color={'#000'}>
							Save Changes
						</Text>
					</Button>
				</Center>
			</Box>
		</ScrollView>
	)
}

const styles = createStyles()

const mapStateToProps = (store) => ({
	currentUser: store.userState.currentUser
})

export default connect(mapStateToProps, null)(Settings)
