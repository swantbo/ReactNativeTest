import React, {Component} from 'react'
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {
	fetchUser,
	fetchUserAppointments,
	fetchBarber
} from '../redux/actions/index'

import AddAppointmentScreen from '../screens/admin/Add'
import PointsScreen from '../screens/admin/Points'
import CalendarScreen from '../screens/admin/Calendar'
import SearchScreen from '../screens/admin/Search'
import SettingsScreen from '../screens/admin/Settings'
import HomeScreen from '../screens/admin/Home'
import {Ionicons} from '@expo/vector-icons'
import TimeOffScreen from '../screens/admin/Off'
import OverviewScreen from '../screens/admin/OverView'

const AdminCalendarStack = createStackNavigator()

function AdminCalendarStackScreen({navigation}) {
	return (
		<AdminCalendarStack.Navigator
			screenOptions={{
				headerStyle: {
					backgroundColor: '#121212',
					shadowColor: '#E8BD70'
				},
				headerTintColor: '#E8BD70',
				headerTitleAlign: 'center'
			}}>
			<AdminCalendarStack.Screen
				name='Calendar'
				component={CalendarScreen}
				options={{
					title: 'Calendar'
				}}
			/>
			<AdminCalendarStack.Screen
				name='AddAppointmentScreen'
				options={{
					title: 'Add Appointments',
					...TransitionPresets.ModalTransition,
					headerShown: false
				}}
				component={AddAppointmentScreen}
			/>
			<AdminCalendarStack.Screen
				name='TimeOffScreen'
				options={{
					title: 'Time Off',
					...TransitionPresets.ModalTransition,
					headerShown: false
				}}
				component={TimeOffScreen}
			/>
		</AdminCalendarStack.Navigator>
	)
}

const AdminSettingsStack = createStackNavigator()

function AdminSettingsStackScreen({navigation}) {
	return (
		<AdminSettingsStack.Navigator
			screenOptions={{
				headerStyle: {
					backgroundColor: '#121212',
					shadowColor: '#E8BD70'
				},
				headerTintColor: '#E8BD70',
				headerTitleAlign: 'center'
			}}>
			<AdminSettingsStack.Screen
				name='SearchScreen'
				options={{
					title: 'Edit Accounts',
					headerTitleAlign: 'center',
					headerRight: () => (
						<Ionicons
							name='bar-chart'
							color={'#E8BD70'}
							size={23}
							style={{padding: 10}}
							onPress={() =>
								navigation.navigate('OverviewScreen')
							}
							title='Add'
							color='#E8BD70'
						/>
					)
				}}
				component={SearchScreen}
			/>
			<AdminSettingsStack.Screen
				name='PointsScreen'
				options={{title: 'Points', headerTitleAlign: 'center'}}
				component={PointsScreen}
			/>
			<AdminSettingsStack.Screen
				name='OverviewScreen'
				options={{
					title: 'Overview',
					headerTitleAlign: 'center'
				}}
				component={OverviewScreen}
			/>
		</AdminSettingsStack.Navigator>
	)
}

const AdminAboutStack = createStackNavigator()

function AdminAboutStackScreen({navigation}) {
	return (
		<AdminAboutStack.Navigator
			screenOptions={{
				headerStyle: {
					backgroundColor: '#121212',
					shadowColor: '#E8BD70'
				},
				tabBarStyle: {
					backgroundColor: '#121212',
					position: 'relative',
					bottom: 0,
					elevation: 0,
					borderTopWidth: 0
				},
				headerTintColor: '#E8BD70',
				headerTitleAlign: 'center',
				headerShadowVisible: false
			}}>
			<AdminAboutStack.Screen
				name='HomeScreen'
				options={{
					headerShown: false
				}}
				component={HomeScreen}
			/>
			<AdminAboutStack.Screen
				name='EditProfile'
				options={{title: 'Settings', headerTitleAlign: 'center'}}
				component={SettingsScreen}
			/>
		</AdminAboutStack.Navigator>
	)
}

const Tab = createBottomTabNavigator()

export class AdminStack extends Component {
	componentDidMount() {
		this.props.fetchUser()
		this.props.fetchUserAppointments()
		this.props.fetchBarber()
	}
	render() {
		return (
			<Tab.Navigator
				screenOptions={{
					tabBarStyle: {
						backgroundColor: 'rgb(18, 18, 18)',
						//backgroundColor: 'transparent',
						position: 'relative',
						borderTopColor: '#E8BD70',
						bottom: 0,
						elevation: 0
					},
					headerShown: false,
					tabBarActiveTintColor: '#E8BD70',
					tabBarInactiveTintColor: '#fff'
				}}>
				<Tab.Screen
					name='About'
					component={AdminAboutStackScreen}
					options={{
						tabBarIcon: ({color, size}) => (
							<Ionicons name='home' color={color} size={size} />
						)
					}}
				/>
				<Tab.Screen
					name='Calendar'
					component={AdminCalendarStackScreen}
					options={{
						tabBarIcon: ({color, size}) => (
							<Ionicons
								name='calendar'
								color={color}
								size={size}
							/>
						)
					}}
				/>
				<Tab.Screen
					name='Admin'
					component={AdminSettingsStackScreen}
					options={{
						tabBarIcon: ({color, size}) => (
							<Ionicons
								name='settings'
								color={color}
								size={size}
							/>
						)
					}}
				/>
			</Tab.Navigator>
		)
	}
}

const mapStateToProps = (store) => ({
	currentUser: store.userState.currentUser
})

const mapDispatchProps = (dispatch) =>
	bindActionCreators(
		{fetchUser, fetchUserAppointments, fetchBarber},
		dispatch
	)

export default connect(mapStateToProps, mapDispatchProps)(AdminStack)
