import React, {useEffect, useState} from 'react'
import {View, Text, StyleSheet} from 'react-native'
import {Card} from 'react-native-elements'
import {InputField} from '../../components'
import {insertDecimal} from '../../utils/DataFormatting'

import createStyles from '../../styles/base'

const Points = ({route}) => {
	const {userGoatPoints} = route.params
	const [goatPoints, setGoatPoints] = useState('')
	const [convertGoatPoints, setConvertGoatPoints] = useState('0')
	const [convertedGoatPoints, setConvertedGoatPoints] = useState('0.00')

	function ConvertGoatPoints(changedGoatPoints) {
		setConvertGoatPoints(changedGoatPoints)
		const tempNum = (changedGoatPoints / 100).toFixed(2)
		setConvertedGoatPoints(tempNum)
	}

	useEffect(() => {
		setGoatPoints(userGoatPoints)
	}, [])

	return (
		<View style={styles.settingsContainer}>
			<Card containerStyle={styles.barberInfoView}>
				<Card.Title style={styles.modalTitle}>Goat Points</Card.Title>
				<Card.Divider />
				<View>
					<Text style={styles.text}>Goat Points are a currency that can be used for Haircuts. When setting up an appointment you can use your Goat Points to get money off your haircut.</Text>
					<Text style={styles.text}>To earn Goat Points talk to your Barber!</Text>
				</View>
			</Card>
			<Card containerStyle={styles.barberInfoView}>
				<Card.Title style={styles.modalTitle}>Goat Points Conversion</Card.Title>
				<Card.Divider />
				<View style={{alignItems: 'center'}}>
					<Text style={styles.text}>1 Goat Point is equal to 1 cent.</Text>
					<Text style={styles.text}>
						Your {goatPoints} GP's = ${insertDecimal(goatPoints)}
					</Text>
					<Text></Text>
					<InputField containerStyle={styles.inputField} placeholder='Enter Goat Points' value={convertGoatPoints} onChangeText={(text) => ConvertGoatPoints(text)} />
					<InputField containerStyle={styles.inputField} placeholder='Convereted Goat Points' value={'$' + convertedGoatPoints} />
				</View>
			</Card>
		</View>
	)
}

const styles = createStyles()

export default Points
