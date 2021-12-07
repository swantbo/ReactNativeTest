import React, { useEffect, useState } from 'react'
import {
    View,
    StyleSheet,
    Text,
    Dimensions,
    ScrollView,
    ActivityIndicator,
    Alert,
} from 'react-native'
import { Card, PricingCard } from 'react-native-elements'
import { LineChart, BarChart } from 'react-native-chart-kit'
import moment from 'moment'

import * as firebase from 'firebase'
import { AuthenticatedUserContext } from '../../../navigation/AuthenticatedUserProvider'

const OverviewScreen = ({ navigation }) => {
    const [currentMonthData, setCurrentMonthData] = useState({
        haircuts: '',
        goatPoints: '',
    })
    const [revenue, setRevenue] = useState('')
    const [isLoading, setIsLoading] = useState(true)

    const barData = {
        labels: ['Revenue', 'GoatPoints'],
        datasets: [
            {
                data: [
                    Number(currentMonthData.haircuts) * 40,
                    Number((currentMonthData.goatPoints / 100).toFixed(2)),
                ],
            },
        ],
    }

    function subtractDiscount(revenue, goatPoints) {
        const discount = Number(revenue) - Number((goatPoints / 100).toFixed(2))
        return discount
    }

    useEffect(() => {
        async function getOverViewData() {
            try {
                setIsLoading(true)
                await firebase
                    .firestore()
                    .collection('Calendar')
                    .doc(moment().format('MMM YY'))
                    .collection('OverView')
                    .doc('data')
                    .get()
                    .then((doc) => {
                        setCurrentMonthData({
                            ...currentMonthData,
                            ...doc.data(),
                        })
                        calculateRevenue(doc.data().haircuts)
                    })
            } catch (error) {
                Alert.alert('Error', `Unable to get Data, Try again. ${error}`)
            }
        }
        getOverViewData()
        function calculateRevenue(haircuts) {
            const tempRevenue = Number(haircuts) * 40
            const formatRevenue = (Math.round(tempRevenue * 100) / 100).toFixed(
                2
            )
            setRevenue(formatRevenue)
            setIsLoading(false)
        }
    }, [])

    return (
        <View style={styles.container}>
            {!isLoading ? (
                <>
                    <BarChart
                        data={barData}
                        width={Dimensions.get('window').width}
                        height={220}
                        yAxisLabel='$'
                        chartConfig={{
                            backgroundGradientFrom: '#000',
                            backgroundGradientTo: '#E8BD70',
                            decimalPlaces: 0,
                            color: (opacity = 1) =>
                                `rgba(255, 255, 255, ${opacity})`,
                            style: {
                                borderRadius: 16,
                            },
                        }}
                    />
                    <ScrollView style={{ flex: 0.5 }}>
                        <Card
                            containerStyle={{
                                backgroundColor: '#121212',
                                margin: 10,
                                borderColor: '#121212',
                                borderRadius: 15,
                            }}
                        >
                            <Card.Title
                                style={{
                                    fontSize: 20,
                                    color: '#E8BD70',
                                }}
                            >
                                Total Haircuts
                            </Card.Title>
                            <Card.Title
                                style={{
                                    fontSize: 20,
                                    color: '#fff',
                                }}
                            >
                                {currentMonthData.haircuts}
                            </Card.Title>
                            <Text
                                style={{
                                    color: 'lightgrey',
                                    alignSelf: 'center',
                                }}
                            >
                                Total Haicuts for {moment().format('MMM YYYY')}
                            </Text>
                        </Card>
                        <Card
                            containerStyle={{
                                backgroundColor: '#121212',
                                margin: 10,
                                borderColor: '#121212',
                                borderRadius: 15,
                            }}
                        >
                            <Card.Title
                                style={{
                                    fontSize: 20,
                                    color: '#E8BD70',
                                }}
                            >
                                Total GoatPoints
                            </Card.Title>
                            <Card.Title
                                style={{
                                    fontSize: 20,
                                    color: '#fff',
                                }}
                            >
                                {currentMonthData.goatPoints}
                            </Card.Title>

                            <Text
                                style={{
                                    color: 'lightgrey',
                                    alignSelf: 'center',
                                }}
                            >
                                Used GoatPoints for{' '}
                                {moment().format('MMM YYYY')}
                            </Text>
                        </Card>
                        <Card
                            containerStyle={{
                                backgroundColor: '#121212',
                                margin: 10,
                                borderColor: '#121212',
                                borderRadius: 15,
                            }}
                        >
                            <Card.Title
                                style={{
                                    fontSize: 20,
                                    color: '#E8BD70',
                                }}
                            >
                                Approximate Revenue
                            </Card.Title>
                            <Card.Title
                                style={{
                                    fontSize: 20,
                                    color: '#fff',
                                }}
                            >
                                $
                                {subtractDiscount(
                                    revenue,
                                    currentMonthData.goatPoints
                                )}
                            </Card.Title>
                            <Text
                                style={{
                                    color: 'lightgrey',
                                    alignSelf: 'center',
                                }}
                            >
                                Revenue: ${revenue}
                            </Text>
                            <Text
                                style={{
                                    color: 'lightgrey',
                                    alignSelf: 'center',
                                }}
                            >
                                Used GoatPoints: $
                                {Number(
                                    (currentMonthData.goatPoints / 100).toFixed(
                                        2
                                    )
                                )}
                            </Text>
                        </Card>
                    </ScrollView>
                </>
            ) : (
                <ActivityIndicator size='large' />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    text: {
        color: '#fff',
    },
    ListItem: {
        backgroundColor: '#121212',
    },
})

export default OverviewScreen
