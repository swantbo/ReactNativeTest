import React, {useContext, useState} from 'react'
import {View, Alert} from 'react-native'
import {Card} from 'react-native-elements'
import {Button, InputField} from '../../components'
import createStyles from '../../styles/base'

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
		<View style={styles.settingsContainer}>
			<Card containerStyle={styles.pointsCard}>
				<Card.Title style={styles.cardTitle}>{name}</Card.Title>
				<Card.Divider />
				<Card.Title style={styles.text}>Current Goat Points: {goatPoints}</Card.Title>
				<InputField containerStyle={styles.inputField} keyboardType='phone-pad' placeholder='Add Goat Points' value={points} onChangeText={(text) => onChangePoints(text)} />
				<Button containerStyle={styles.goldButton} titleSize={20} onPress={() => addPointsToUser()} title='Add Points' />
			</Card>
		</View>
	)
}

const styles = createStyles()

export default Points
