import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import AddAppointmentScreen from '../screens/admin/addAppointment'
import PointsScreen from '../screens/admin/points'
import CalendarScreen from '../screens/admin/calendar'
import EditAccountScreen from '../screens/admin/editAccount'
import EditProfileScreen from '../screens/admin/editProfile'
import HomeScreen from '../screens/admin/home'
import { Ionicons } from '@expo/vector-icons'
import TimeOffScreen from '../screens/admin/timeOff'
import OverviewScreen from '../screens/admin/overview'

const AdminCalendarStack = createStackNavigator()

function AdminCalendarStackScreen({ navigation }) {
    return (
        <AdminCalendarStack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#121212',
                    shadowColor: '#E8BD70',
                },
                headerTintColor: '#E8BD70',
                headerTitleAlign: 'center',
            }}
        >
            <AdminCalendarStack.Screen
                name='Calendar'
                component={CalendarScreen}
                options={{
                    title: 'Calendar',
                    headerLeft: () => (
                        <Ionicons
                            name='airplane'
                            color={'#E8BD70'}
                            size={23}
                            style={{ padding: 10 }}
                            onPress={() => navigation.navigate('TimeOffScreen')}
                            title='Add'
                            color='#E8BD70'
                        />
                    ),
                    headerRight: () => (
                        <Ionicons
                            name='add-circle'
                            color={'#E8BD70'}
                            size={23}
                            style={{ padding: 10 }}
                            onPress={() =>
                                navigation.navigate('AddAppointmentScreen')
                            }
                            title='Add'
                            color='#E8BD70'
                        />
                    ),
                }}
            />
            <AdminCalendarStack.Screen
                name='AddAppointmentScreen'
                options={{ title: 'Add Appointments' }}
                component={AddAppointmentScreen}
            />
            <AdminCalendarStack.Screen
                name='TimeOffScreen'
                options={{ title: 'Time Off' }}
                component={TimeOffScreen}
            />
        </AdminCalendarStack.Navigator>
    )
}

const AdminSettingsStack = createStackNavigator()

function AdminSettingsStackScreen({ navigation }) {
    return (
        <AdminSettingsStack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#121212',
                    shadowColor: '#E8BD70',
                },
                headerTintColor: '#E8BD70',
                headerTitleAlign: 'center',
            }}
        >
            {/* <AdminSettingsStack.Screen name="Admin Settings" options={{ title: 'Admin Settings', headerTitleAlign: 'center' }} component={AdminSettingsScreen}/> */}
            <AdminSettingsStack.Screen
                name='EditAccountScreen'
                options={{
                    title: 'Edit Accounts',
                    headerTitleAlign: 'center',
                    headerRight: () => (
                        <Ionicons
                            name='bar-chart'
                            color={'#E8BD70'}
                            size={23}
                            style={{ padding: 10 }}
                            onPress={() =>
                                navigation.navigate('OverviewScreen')
                            }
                            title='Add'
                            color='#E8BD70'
                        />
                    ),
                }}
                component={EditAccountScreen}
            />
            <AdminSettingsStack.Screen
                name='PointsScreen'
                options={{ title: 'Points', headerTitleAlign: 'center' }}
                component={PointsScreen}
            />
            <AdminSettingsStack.Screen
                name='OverviewScreen'
                options={{
                    title: 'Overview',
                    headerTitleAlign: 'center',
                }}
                component={OverviewScreen}
            />
        </AdminSettingsStack.Navigator>
    )
}

const AdminAboutStack = createStackNavigator()

function AdminAboutStackScreen({ navigation }) {
    return (
        <AdminAboutStack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#121212',
                    shadowColor: '#E8BD70',
                },
                tabBarStyle: {
                    backgroundColor: '#121212',
                    position: 'relative',
                    bottom: 0,
                    elevation: 0,
                    borderTopWidth: 0,
                },
                headerTintColor: '#E8BD70',
                headerTitleAlign: 'center',
                headerShadowVisible: false,
            }}
        >
            <AdminAboutStack.Screen
                name='HomeScreen'
                options={{
                    title: 'Nate',
                    headerRight: () => (
                        <Ionicons
                            name='build'
                            color={'#E8BD70'}
                            size={23}
                            style={{ padding: 10 }}
                            onPress={() => navigation.navigate('EditProfile')}
                            title='Add'
                            color='#E8BD70'
                        />
                    ),
                }}
                component={HomeScreen}
            />
            <AdminAboutStack.Screen
                name='EditProfile'
                options={{ title: 'Edit Profile', headerTitleAlign: 'center' }}
                component={EditProfileScreen}
            />
        </AdminAboutStack.Navigator>
    )
}

const Tab = createBottomTabNavigator()

export default function AdminStack() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: 'rgb(18, 18, 18)' },
                tabBarStyle: {
                    backgroundColor: 'rgb(18, 18, 18)',
                    //backgroundColor: 'transparent',
                    position: 'relative',
                    borderTopColor: '#E8BD70',
                    bottom: 0,
                    elevation: 0,
                },
                headerShown: false,
                tabBarActiveTintColor: '#E8BD70',
                tabBarInactiveTintColor: '#fff',
            }}
        >
            <Tab.Screen
                name='About'
                component={AdminAboutStackScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name='home' color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name='Calendar'
                component={AdminCalendarStackScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name='calendar' color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name='Admin'
                component={AdminSettingsStackScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name='settings' color={color} size={size} />
                    ),
                }}
            />
        </Tab.Navigator>
    )
}
