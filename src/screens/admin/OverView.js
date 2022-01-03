import React, {useEffect, useState} from 'react'
import {View, Text, Dimensions, ScrollView, ActivityIndicator, Alert} from 'react-native'
import {Card, ListItem} from 'react-native-elements'
import {BarChart} from 'react-native-chart-kit'
import createStyles from '../../styles/base'
import moment from 'moment'

import {subtractRevenueDiscount} from '../../utils/DataFormatting'
import Firebase from '../../config/firebase'
import {AuthenticatedUserContext} from '../../navigation/AuthenticatedUserProvider'

const OverView = () => {
	const [currentMonthData, setCurrentMonthData] = useState({
		haircuts: '',
		goatPoints: ''
	})
	const [revenue, setRevenue] = useState('')
	const [isLoading, setIsLoading] = useState(true)

	async function getOverViewData() {
		try {
			setIsLoading(true)
			await Firebase.firestore()
				.collection('Calendar')
				.doc(moment().format('MMM YY'))
				.collection('OverView')
				.doc('data')
				.get()
				.then((doc) => {
					setCurrentMonthData({
						...currentMonthData,
						...doc.data()
					})
					calculateRevenue(doc.data().haircuts)
				})
		} catch (error) {
			Alert.alert('Error', `Unable to get Data, Try again. ${error}`)
		}
	}

	function calculateRevenue(haircuts) {
		const tempRevenue = Number(haircuts) * 40
		const formatRevenue = (Math.round(tempRevenue * 100) / 100).toFixed(2)
		setRevenue(formatRevenue)
		setIsLoading(false)
	}

	const barData = {
		labels: ['Revenue', 'GoatPoints'],
		datasets: [
			{
				data: [Number(currentMonthData.haircuts) * 40, Number((currentMonthData.goatPoints / 100).toFixed(2))]
			}
		]
	}

	useEffect(() => {
		getOverViewData()
	}, [])

	return (
		<View style={styles.container}>
			{!isLoading ? (
				<>
					<BarChart
						data={barData}
						width={Dimensions.get('window').width}
						height={Dimensions.get('window').height / 4}
						yAxisLabel='$'
						chartConfig={{
							backgroundGradientFrom: '#121212',
							backgroundGradientTo: '#121212',
							decimalPlaces: 0,
							color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
							style: {
								borderRadius: 16
							}
						}}
					/>

					<ScrollView>
						<Card containerStyle={styles.barberPhotoContainer}>
							<ListItem.Title style={styles.overViewTitle}>Total Haircuts</ListItem.Title>
							<ListItem.Title style={styles.overViewSubtitle}>{currentMonthData.haircuts}</ListItem.Title>
							<Text style={styles.revenueText}>Total Haicuts for {moment().format('MMM YYYY')}</Text>
						</Card>
						<Card containerStyle={styles.barberPhotoContainer}>
							<ListItem.Title style={styles.overViewTitle}>Total Used Goat Points</ListItem.Title>
							<ListItem.Title style={styles.overViewSubtitle}>{currentMonthData.goatPoints ? currentMonthData.goatPoints : '0'}</ListItem.Title>

							<Text style={styles.revenueText}>Used Goat Points for {moment().format('MMM YYYY')}</Text>
						</Card>
						<Card containerStyle={styles.barberPhotoContainer}>
							<ListItem.Title style={styles.overViewTitle}>Approximate Revenue</ListItem.Title>
							<ListItem.Title style={styles.overViewSubtitle}>${subtractRevenueDiscount(revenue, currentMonthData.goatPoints)}</ListItem.Title>
							<Text style={styles.revenueText}>Revenue: ${revenue}</Text>
							<Text style={styles.revenueText}>Used GoatPoints: ${Number((currentMonthData.goatPoints / 100).toFixed(2))}</Text>
						</Card>
					</ScrollView>
				</>
			) : (
				<ActivityIndicator size='large' />
			)}
		</View>
	)
}

const styles = createStyles()

export default OverView
