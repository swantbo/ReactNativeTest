import React, {useContext, useState} from 'react'
import {Alert} from 'react-native'
import {Center, VStack, Heading, Box, Text, Button, Input} from 'native-base'

import Firebase from '../../config/firebase'
import {AuthenticatedUserContext} from '../../navigation/AuthenticatedUserProvider'

const Points = ({route}) => {
	const {user} = useContext(AuthenticatedUserContext)
	const {name, userId, goatPoints} = route.params
	const [points, onChangePoints] = useState('')

	const addPointsToUser = async () => {
		const pointsTotal = Number(points) + Number(goatPoints)
		const newPoints = {points: pointsTotal.toString()}

		await Firebase.firestore()
			.collection('users')
			.doc(userId)
			.set(newPoints, {merge: true})
			.then(() => {
				Alert.alert('Points Added', `${name}, now has ${pointsTotal} Goat Points`, [
					{
						text: 'Okay'
					}
				])
			})
	}

	return (
		<VStack flex={1} bgColor={'#000'}>
			<Box borderRadius={10} bgColor={'#121212'} m={3} p={3}>
				<Center>
					<Heading color={'#E8BD70'} m={2}>
						{name}
					</Heading>
					<Text fontSize={'lg'}>Current Goat Points: {goatPoints}</Text>
					<Input placeholder='Add Goat Points' w={'100%'} h={'40px'} m={2} value={points} onChangeText={(text) => onChangePoints(text)} />
					<Button bgColor={'#E8BD70'} w={'100%'} m={2} onPress={() => addPointsToUser()}>
						<Text fontSize={'lg'} color='#000' bold>
							Add Points
						</Text>
					</Button>
				</Center>
			</Box>
		</VStack>
	)
}

export default Points
