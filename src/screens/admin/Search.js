import React, {useEffect, useState} from 'react'
import {View, StyleSheet, Alert, TouchableOpacity, Linking} from 'react-native'
import {ListItem, Button} from 'react-native-elements'
import {ScrollView} from 'react-native-gesture-handler'
import {formatPhoneNumber} from '../../utils/DataFormatting'
import {InputField} from '../../components'
import createStyles from '../../styles/base'

import Firebase from '../../config/firebase'
import moment from 'moment'

const Search = ({navigation}) => {
	const [userInfo, setUserInfo] = useState([])
	const [search, setSearch] = useState('')
	const [searchResults, setSearchResults] = useState([])

	async function getUsers() {
		let data = []
		const snapshot = await Firebase.firestore().collection('users').get()
		snapshot.docs.map((doc) => {
			let tempData = doc.data()
			let id = doc.id
			data.push({id, ...tempData})
		})
		setUserInfo(data)
	}

	const deleteUser = (user_id) => {
		Firebase.firestore()
			.collection('users')
			.doc(user_id)
			.delete()
			.catch((e) => {
				alert('Unable to delete user try again')
			})
	}

	const removeStrike = (user_id, strikes) => {
		if (strikes > 0) {
			const strikesTotal = Number(strikes) - 1
			const newStikes = {
				strikes: strikesTotal.toString()
			}
			Firebase.firestore()
				.collection('users')
				.doc(user_id)
				.set(newStikes, {merge: true})
				.catch((e) => {
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
		Firebase.firestore()
			.collection('users')
			.doc(user_id)
			.set(newStikes, {merge: true})
			.catch((e) => {
				alert('Unable to add Strikes to user, try again')
			})
	}

	const searchAccounts = (text) => {
		setSearch(text)
		const tempArray = userInfo.filter((o) => o.name.toLowerCase().includes(text.toLowerCase()) || o.phone.toLowerCase().includes(text.toLowerCase()) || o.email.toLowerCase().includes(text.toLowerCase()))
		setSearchResults(tempArray)
	}

	useEffect(() => {
		getUsers()
	}, [])

	return (
		<View style={styles.settingsContainer}>
			<InputField
				inputStyle={{fontSize: 14}}
				containerStyle={styles.inputField}
				leftIcon='account-search'
				placeholder='Search Name, Number, or Email'
				autoCapitalize='none'
				autoCorrect={false}
				value={search}
				onChangeText={(text) => searchAccounts(text)}
			/>
			<ScrollView>
				{userInfo &&
					(search !== '' ? searchResults : userInfo).map((onekey, i) => (
						<>
							<ListItem.Swipeable
								key={onekey.id}
								bottomDivider
								containerStyle={styles.searchContainer}
								rightContent={
									<Button
										title='Delete'
										icon={{
											name: 'delete',
											color: 'white'
										}}
										buttonStyle={{
											minHeight: '100%',
											backgroundColor: 'red'
										}}
										onPress={() =>
											Alert.alert('Delete', `Are you sure you want to delete ${'\n'}Account Name: ${onekey.name ? onekey.name : 'N/A'} ${'\n'}Account Id: ${onekey.id ? onekey.id : 'N/A'}`, [
												{
													text: 'Cancel'
												},
												{
													text: 'Delete User',
													onPress: () => deleteUser(onekey.id)
												}
											])
										}
									/>
								}
								leftContent={
									<Button
										title='Add Points'
										icon={{name: 'add-circle', color: 'white'}}
										buttonStyle={{minHeight: '100%', backgroundColor: 'green'}}
										onPress={() =>
											navigation.navigate('PointsScreen', {
												name: onekey.name,
												userId: onekey.id,
												goatPoints: onekey.points
											})
										}
									/>
								}>
								<ListItem.Content>
									<View style={styles.row}>
										{onekey?.created && moment(onekey?.created).toDate() < moment().add(3, 'days') && (
											<View style={{}}>
												<ListItem.Title style={styles.swipableButton}>New</ListItem.Title>
											</View>
										)}
										<View style={styles.rowStart}>
											<ListItem.Title style={styles.listItemTitle}>{onekey.name} </ListItem.Title>
										</View>
										<View style={styles.rowEnd}>
											<ListItem.Title
												style={styles.swipableButton}
												onPress={() =>
													Alert.alert('Strikes', `Would you like to add or remove strikes from ${'\n'}Account Name: ${onekey.name ? onekey.name : 'N/A'} ${'\n'}Account Id: ${onekey.id ? onekey.id : 'N/A'}`, [
														{
															text: 'Cancel'
														},
														{
															text: 'Remove Strike',
															onPress: () => removeStrike(onekey.id, onekey.strikes)
														},
														{
															text: 'Add Strike',
															onPress: () => addStrike(onekey.id, onekey.strikes)
														}
													])
												}>
												Strikes: {onekey.strikes ? onekey.strikes : 'N/A'}
											</ListItem.Title>
										</View>
									</View>
									<View style={styles.row}>
										<View style={styles.rowStart}>
											<TouchableOpacity
												onPress={() =>
													Linking.openURL(`sms:${onekey?.phone}`).catch(() => {
														Linking.openURL(`sms:${onekey?.phone}`)
													})
												}>
												<ListItem.Subtitle style={styles.text}>{formatPhoneNumber(onekey.phone) ? formatPhoneNumber(onekey.phone) : onekey.phone}</ListItem.Subtitle>
											</TouchableOpacity>
										</View>
										<View style={styles.rowEnd}>
											<ListItem.Subtitle style={styles.text} onPress={() => searchAccounts(onekey.referral)}>
												{onekey.referral ? 'Ref: ' + onekey.referral : 'No Referral'}
											</ListItem.Subtitle>
										</View>
									</View>
									<View style={styles.row}>
										<View style={styles.rowStart}>
											<ListItem.Subtitle style={styles.text}>{onekey.email ? onekey.email : 'N/A'}</ListItem.Subtitle>
										</View>
										<View style={styles.rowEnd}>
											<ListItem.Subtitle style={styles.text}>Points: {onekey.points}</ListItem.Subtitle>
										</View>
									</View>

									<ListItem.Subtitle style={styles.text}>DOB: {onekey.dob ? onekey.dob : 'N/A'}</ListItem.Subtitle>

									<ListItem.Subtitle style={{color: 'lightgrey'}}>{onekey.id ? onekey.id : 'N/A'}</ListItem.Subtitle>
								</ListItem.Content>
							</ListItem.Swipeable>
						</>
					))}
			</ScrollView>
		</View>
	)
}

const styles = createStyles()

export default Search
