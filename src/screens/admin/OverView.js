import moment from 'moment'
import { Box, Center, Heading, Text, VStack } from 'native-base'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Alert, Dimensions, ScrollView } from 'react-native'
import { BarChart } from 'react-native-chart-kit'
import Firebase from '../../config/firebase'
import createStyles from '../../styles/base'
import { subtractRevenueDiscount } from '../../utils/DataFormatting'


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
		<VStack bgColor={"#000"} flex={1}>
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
							color: (opacity = 1) => `rgba(238, 238, 238, ${opacity})`,
							style: {
								borderRadius: 16
							}
						}}
					/>

					<ScrollView flex={1}>
						<Box bgColor={"#121212"} m={"14px"} borderRadius={14} p={5}>
							<Center>
							<Heading color={"#E8BD70"}>Total Haircuts</Heading>
								<Heading>{currentMonthData.haircuts}</Heading>
								<Text color={"#EEEEEE"}>Total Haicuts for {moment().format('MMM YYYY')}</Text>
							</Center>
						</Box>
						<Box bgColor={"#121212"} m={"14px"} borderRadius={14} p={5}>
							<Center>
								<Heading color={"#E8BD70"}>Total Used Goat Points</Heading>
								<Heading>{currentMonthData.goatPoints ? currentMonthData.goatPoints : '0'}</Heading>
								<Text color={"#EEEEEE"}>Used Goat Points for {moment().format('MMM YYYY')}</Text>
							</Center>
						</Box>
						<Box bgColor={"#121212"} m={"14px"} borderRadius={14} p={5}>
							<Center>
								<Heading color={"#E8BD70"}>Approximate Revenue</Heading>
								<Heading>${subtractRevenueDiscount(revenue, currentMonthData.goatPoints)}</Heading>
								<Text color={"#EEEEEE"}>Revenue: ${revenue}</Text>
								<Text color={"#EEEEEE"}>Used GoatPoints: ${Number((currentMonthData.goatPoints / 100).toFixed(2))}</Text>
							</Center>
						</Box>
					</ScrollView>
				</>
			) : (
				<ActivityIndicator size='large' />
			)}
		</VStack>
	)
}

const styles = createStyles()

export default OverView
