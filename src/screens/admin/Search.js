import React, {useEffect, useState} from 'react'
import {Alert, Linking} from 'react-native'
import {VStack, Heading, Text, Input, HStack, Button} from 'native-base'
import {ListItem} from 'react-native-elements'
import {ScrollView} from 'react-native-gesture-handler'
import {formatPhoneNumber} from '../../utils/DataFormatting'
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
		<VStack flex={1} bgColor={'#000'}>
			<Input placeholder='Search Name, Number, or Email' w={'100%'} h={'40px'} p={'5'} value={search} onChangeText={(text) => searchAccounts(text)} />
			<ScrollView>
				{userInfo &&
					(search !== '' ? searchResults : userInfo).map((onekey, i) => (
						<>
							<ListItem.Swipeable
								key={onekey.id}
								bottomDivider
								containerStyle={styles.listItemContainer}
								rightContent={
									<Button
										h={'100%'}
										width={'100%'}
										bgColor={'#FF0000'}
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
										}>
										Delete
									</Button>
								}
								leftContent={
									<Button
										h={'100%'}
										width={'100%'}
										onPress={() =>
											navigation.navigate('PointsScreen', {
												name: onekey.name,
												userId: onekey.id,
												goatPoints: onekey.points
											})
										}>
										Add Points
									</Button>
								}>
								<ListItem.Content>
									<HStack>
										<VStack justifyContent={'flex-start'} width={'65%'}>
											<HStack>
												<Heading fontSize={'lg'} pb={2} color={'#E8BD70'}>
													{onekey.name}
												</Heading>
												{onekey?.created && moment(onekey?.created).toDate() < moment().add(3, 'days') && (
													<Heading fontSize={'lg'} pb={2}>
														New
													</Heading>
												)}
											</HStack>
											<Text
												lineHeight={0}
												fontSize={'md'}
												onPress={() =>
													Linking.openURL(`sms:${onekey?.phone}`).catch(() => {
														Linking.openURL(`sms:${onekey?.phone}`)
													})
												}>
												{formatPhoneNumber(onekey.phone) ? formatPhoneNumber(onekey.phone) : onekey.phone}
											</Text>
											<Text lineHeight={0} fontSize={'md'} lineHeight={0}>
												{onekey.email ? onekey.email : 'N/A'}
											</Text>
										</VStack>
										<VStack alignItems={'flex-end'} width={'35%'}>
											<Heading
												lineHeight={0}
												fontSize={'lg'}
												pb={2}
												color={'#FF0000'}
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
											</Heading>
											<Text lineHeight={0} fontSize={'md'} onPress={() => searchAccounts(onekey.referral)}>
												{onekey.referral ? 'Ref: ' + onekey.referral : 'No Referral'}
											</Text>
											<Text lineHeight={0} fontSize={'md'}>
												Points: {onekey.points}
											</Text>
										</VStack>
									</HStack>
									<Text fontSize={'md'} lineHeight={0}>
										DOB: {onekey.dob ? onekey.dob : 'N/A'}
									</Text>
									<Text fontSize={'md'} lineHeight={0} color={'lightgrey'}>
										{onekey.id ? onekey.id : 'N/A'}
									</Text>
								</ListItem.Content>
							</ListItem.Swipeable>
						</>
					))}
			</ScrollView>
		</VStack>
	)
}

const styles = createStyles()

export default Search
