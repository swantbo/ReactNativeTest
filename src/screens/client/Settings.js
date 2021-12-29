import React, {useEffect, useState, useContext} from 'react'
import {View, StyleSheet, TextInput, Alert, TouchableOpacity} from 'react-native'
import {ListItem, Button} from 'react-native-elements'
import {formatPhoneNumber} from '../../utils/DataFormatting'
import createStyles from '../../styles/base'

import {connect} from 'react-redux'

import {AuthenticatedUserContext} from '../../navigation/AuthenticatedUserProvider'

import Firebase from '../../config/firebase'
const auth = Firebase.auth()

function Settings(props) {
	const {user} = useContext(AuthenticatedUserContext)
	const [userInfo, setUserInfo] = useState({})
	const [changeUserInfo, setChangeUserInfo] = useState()
	const [newUserInfo, setNewUserInfo] = useState('')
	const [userDataType, setUserDataType] = useState('')

	const handleSignOut = async () => {
		try {
			await auth.signOut()
		} catch (error) {
			Alert.alert('Error', `Unable to Logout, try again. ${error}`)
		}
	}

	const changeInfo = (value, type) => {
		setChangeUserInfo(value)
		setUserDataType(type)
		setNewUserInfo(value)
	}

	const setUserData = (newUserInfo) => {
		const updateUserData = {
			[`${userDataType}`]: newUserInfo
		}
		try {
			Firebase.firestore().collection('users').doc(user.uid).update(updateUserData)
			Alert.alert('Success', `Your ${userDataType} has been changed to ${newUserInfo}`)
		} catch (error) {
			Alert.alert('There is an error.', err.message)
		}
	}

	useEffect(() => {
		const {currentUser} = props
		setUserInfo(currentUser)
	}, [props])

	return (
		<View style={styles.settingsContainer}>
			<ListItem bottomDivider containerStyle={{backgroundColor: '#000'}}>
				<ListItem.Content>
					<ListItem.Title style={styles.listItemNoAppointments}>My Account Details</ListItem.Title>
				</ListItem.Content>
			</ListItem>
			{changeUserInfo && (
				<View>
					<TextInput placeholder={changeUserInfo.toString()} placeholderTextColor={'#fff'} onChangeText={setNewUserInfo} value={newUserInfo} style={styles.textInput} />
					<TouchableOpacity
						style={{
							backgroundColor: '#E8BD70',
							borderRadius: 5,
							padding: 10,
							margin: 5
						}}
						onPress={() => setUserData(newUserInfo)}>
						<ListItem.Title
							style={{
								color: '#000',
								alignSelf: 'center'
							}}>
							{`Change ${userDataType}: ${changeUserInfo}`}
						</ListItem.Title>
					</TouchableOpacity>
				</View>
			)}
			<ListItem containerStyle={styles.listItemContainer} bottomDivider onPress={() => changeInfo(userInfo.name, 'name')}>
				<ListItem.Content>
					<ListItem.Title style={styles.text}>Name: {userInfo.name}</ListItem.Title>
				</ListItem.Content>
			</ListItem>
			<ListItem containerStyle={styles.listItemContainer} bottomDivider onPress={() => changeInfo(userInfo.phone, 'phone')}>
				<ListItem.Content>
					<ListItem.Title style={styles.text}>Phone: {userInfo.phone}</ListItem.Title>
				</ListItem.Content>
			</ListItem>

			<ListItem bottomDivider containerStyle={styles.listItemContainer} onPress={() => handleSignOut()}>
				<ListItem.Content>
					<ListItem.Title style={styles.signOut}>Sign Out</ListItem.Title>
				</ListItem.Content>
			</ListItem>
		</View>
	)
}

const styles = createStyles()

const mapStateToProps = (store) => ({
	currentUser: store.userState.currentUser
})

export default connect(mapStateToProps, null)(Settings)
