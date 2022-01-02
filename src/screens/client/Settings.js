import React, {useEffect, useState, useContext} from 'react'
import {View, StyleSheet, TextInput, Alert, TouchableOpacity, ScrollView} from 'react-native'
import {ListItem, Avatar, Card} from 'react-native-elements'
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
		<ScrollView style={styles.settingsContainer}>
			<Card containerStyle={styles.pointsCard}>
				<Avatar containerStyle={styles.avatarBackground} rounded size='large' title={changeName?.[0]} source={{uri: changeProfilePicture}} onPress={() => pickImage()} />
				<ListItem.Subtitle style={styles.settingsText}>Change Profile Picture</ListItem.Subtitle>
				<View style={styles.settingsView}>
					<ListItem.Title style={styles.settingsText}>Name: </ListItem.Title>
					<TextInput placeholder={changeName} placeholderTextColor={'#fff'} onChangeText={setChangeName} value={changeName} style={styles.settingsTextInput} />
				</View>

				<View style={styles.settingsView}>
					<ListItem.Title style={styles.settingsText}>Phone: </ListItem.Title>
					<TextInput placeholder={changePhone} placeholderTextColor={'#fff'} onChangeText={setChangePhone} value={changePhone} style={styles.settingsTextInput} />
				</View>
				<View style={{margin: 15}}>
					<TouchableOpacity style={styles.goldButton} onPress={() => setUserData()}>
						<ListItem.Title style={styles.buttonTitle}>Save Changes</ListItem.Title>
					</TouchableOpacity>
				</View>

				<ListItem bottomDivider topDivider containerStyle={styles.signOutButton} onPress={() => handleSignOut()}>
					<ListItem.Content>
						<ListItem.Title style={styles.signOut}>Sign Out</ListItem.Title>
					</ListItem.Content>
				</ListItem>
			</Card>
		</ScrollView>
	)
}

const styles = createStyles()

const mapStateToProps = (store) => ({
	currentUser: store.userState.currentUser
})

export default connect(mapStateToProps, null)(Settings)
