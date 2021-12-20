import React, {useEffect, useState, useContext} from 'react'
import {View, Text, Button, StyleSheet, TextInput, Alert, ActivityIndicator, TouchableOpacity} from 'react-native'
import {ListItem} from 'react-native-elements'
import {ScrollView} from 'react-native-gesture-handler'

import * as firebase from 'firebase'

import Firebase from '../../../config/firebase'
const auth = Firebase.auth()
import {AuthenticatedUserContext} from '../../../navigation/AuthenticatedUserProvider'

import createStyles from '../../../styles/base'

import {connect} from 'react-redux'

function EditProfileScreen(props) {
	const {user} = useContext(AuthenticatedUserContext)
	const [isLoading, setIsLoading] = useState(false)
	const [barberProfile, setBarberProfile] = useState({})
	const [changeData, setChangeData] = useState('')
	const [barberDataType, setBarberDataType] = useState('')
	const [newBarberData, setNewBarberData] = useState('')
	const [userInfo, setUserInfo] = useState({name: '', phone: ''})

	const handleSignOut = async () => {
		try {
			await auth.signOut()
		} catch (error) {
			Alert.alert('Error', `Unable to Logout, try again. ${error}`)
		}
	}

	const changeBarberData = (value, type) => {
		setChangeData(value.toString()), setBarberDataType(type.toLowerCase())
	}

	const setBarberData = () => {
		let barberData
		if (barberDataType === 'userphone' || 'username') {
			barberData = {
				[barberDataType.replace('user', '')]: newBarberData
			}
		} else {
			barberData = {
				[barberDataType]: newBarberData
			}
		}
		if (barberDataType !== 'username' && barberDataType !== 'userphone' && newBarberData !== '') {
			firebase
				.firestore()
				.collection('Barber')
				.doc('Nate')
				.set(barberData, {merge: true})
				.then(() => {
					Alert.alert('Success', `Your Barber data ${barberDataType} has been changed to ${newBarberData}`)
				})
				.catch((error) => {
					alert('Something went wrong try again')
				})
		}
		if (barberDataType === 'username' || (barberDataType === 'userphone' && newBarberData !== '')) {
			firebase
				.firestore()
				.collection('users')
				.doc(user.uid)
				.set(barberData, {merge: true})
				.then(() => {
					Alert.alert('Success', `Your Account ${barberDataType} has been changed to ${newBarberData}`)
				})
				.catch((error) => {
					alert('Something went wrong try again' + error)
				})
		}
	}

	useEffect(() => {
		const {currentUser, barber} = props
		console.log('barber', barber)
		setBarberProfile(barber)
		setUserInfo(currentUser)
	}, [props])

	return (
		<View style={styles.settingsContainer}>
			<ScrollView>
				{changeData != '' ? (
					<View>
						<>
							<TextInput placeholder={changeData.toString()} placeholderTextColor={'#fff'} onChangeText={setNewBarberData} value={newBarberData} style={styles.textInput} />
							<TouchableOpacity
								style={{
									backgroundColor: '#E8BD70',
									borderRadius: 5,
									padding: 10,
									margin: 5
								}}
								onPress={() => setBarberData()}>
								<ListItem.Title
									style={{
										color: '#000',
										alignSelf: 'center'
									}}>
									{`Change ${barberDataType}: ${changeData}`}
								</ListItem.Title>
							</TouchableOpacity>
						</>
					</View>
				) : (
					<Text></Text>
				)}
				{barberProfile && !isLoading ? (
					<>
						<ListItem bottomDivider containerStyle={styles.listItemContainer}>
							<ListItem.Content>
								<ListItem.Title style={styles.listItemTitle}>Info</ListItem.Title>
							</ListItem.Content>
						</ListItem>
						<ListItem bottomDivider containerStyle={styles.listItemContainer} onPress={() => changeBarberData(barberProfile.bio, 'bio')}>
							<ListItem.Content>
								<ListItem.Title style={styles.text}>Bio: {barberProfile.bio}</ListItem.Title>
							</ListItem.Content>
						</ListItem>
						<ListItem bottomDivider containerStyle={styles.listItemContainer} onPress={() => changeBarberData(barberProfile.price, 'price')}>
							<ListItem.Content>
								<ListItem.Title style={styles.text}>Price: {barberProfile.price} </ListItem.Title>
							</ListItem.Content>
						</ListItem>
						<ListItem bottomDivider containerStyle={styles.listItemContainer} onPress={() => changeBarberData(barberProfile.website, 'website')}>
							<ListItem.Content>
								<ListItem.Title style={styles.text}>Website: {barberProfile.website} </ListItem.Title>
							</ListItem.Content>
						</ListItem>
						<ListItem bottomDivider containerStyle={styles.listItemContainer} onPress={() => changeBarberData(barberProfile.instagram, 'instagram')}>
							<ListItem.Content>
								<ListItem.Title style={styles.text}>Instagram: {barberProfile.instagram} </ListItem.Title>
							</ListItem.Content>
						</ListItem>
						<ListItem bottomDivider containerStyle={styles.listItemContainer} onPress={() => changeBarberData(barberProfile.phone, 'phone')}>
							<ListItem.Content>
								<ListItem.Title style={styles.text}>Phone: {barberProfile.phone} </ListItem.Title>
							</ListItem.Content>
						</ListItem>
						<ListItem bottomDivider containerStyle={styles.listItemContainer}>
							<ListItem.Content>
								<ListItem.Title style={styles.listItemTitle}>Address and Location</ListItem.Title>
							</ListItem.Content>
						</ListItem>
						<ListItem bottomDivider containerStyle={styles.listItemContainer} onPress={() => changeBarberData(barberProfile.location, 'location')}>
							<ListItem.Content>
								<ListItem.Title style={styles.text}>Address: {barberProfile.location} </ListItem.Title>
							</ListItem.Content>
						</ListItem>
						<ListItem bottomDivider containerStyle={styles.listItemContainer} onPress={() => changeBarberData(barberProfile.Tuesday, 'Tuesday')}>
							<ListItem.Content>
								<ListItem.Title style={styles.text}>Tuesday: {barberProfile.Tuesday} </ListItem.Title>
							</ListItem.Content>
						</ListItem>
						<ListItem bottomDivider containerStyle={styles.listItemContainer} onPress={() => changeBarberData(barberProfile.Wednesday, 'Wednesday')}>
							<ListItem.Content>
								<ListItem.Title style={styles.text}>Wednesday: {barberProfile.Wednesday} </ListItem.Title>
							</ListItem.Content>
						</ListItem>
						<ListItem bottomDivider containerStyle={styles.listItemContainer} onPress={() => changeBarberData(barberProfile.Thursday, 'Thursday')}>
							<ListItem.Content>
								<ListItem.Title style={styles.text}>Thursday: {barberProfile.Thursday} </ListItem.Title>
							</ListItem.Content>
						</ListItem>
						<ListItem bottomDivider containerStyle={styles.listItemContainer} onPress={() => changeBarberData(barberProfile.Friday, 'Friday')}>
							<ListItem.Content>
								<ListItem.Title style={styles.text}>Friday: {barberProfile.Friday} </ListItem.Title>
							</ListItem.Content>
						</ListItem>
						<ListItem bottomDivider containerStyle={styles.listItemContainer} onPress={() => changeBarberData(barberProfile.Saturday, 'Saturday')}>
							<ListItem.Content>
								<ListItem.Title style={styles.text}>Saturday: {barberProfile.Saturday} </ListItem.Title>
							</ListItem.Content>
						</ListItem>
						<ListItem bottomDivider containerStyle={styles.listItemContainer}>
							<ListItem.Content>
								<ListItem.Title style={styles.listItemTitle}>Account Details</ListItem.Title>
							</ListItem.Content>
						</ListItem>
						<ListItem bottomDivider containerStyle={styles.listItemContainer} onPress={() => changeBarberData(userInfo.name, 'userName')}>
							<ListItem.Content>
								<ListItem.Title style={styles.text}>Name: {userInfo.name} </ListItem.Title>
							</ListItem.Content>
						</ListItem>
						<ListItem bottomDivider containerStyle={styles.listItemContainer} onPress={() => changeBarberData(userInfo.phone, 'userPhone')}>
							<ListItem.Content>
								<ListItem.Title style={styles.text}>Phone: {userInfo.phone} </ListItem.Title>
							</ListItem.Content>
						</ListItem>
						<ListItem bottomDivider containerStyle={styles.listItemContainer} onPress={() => handleSignOut()}>
							<ListItem.Content>
								<ListItem.Title style={styles.signOut}>SignOut</ListItem.Title>
							</ListItem.Content>
						</ListItem>
					</>
				) : (
					<ActivityIndicator color='#000' size='large' />
				)}
			</ScrollView>
		</View>
	)
}

const styles = createStyles()

const mapStateToProps = (store) => ({
	currentUser: store.userState.currentUser,
	appointments: store.userState.appointments,
	barber: store.userState.barber
})

export default connect(mapStateToProps, null)(EditProfileScreen)
