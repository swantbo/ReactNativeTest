import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { View, Button, Text } from "react-native";

import AdminAddAppointmentScreen from '../screens/Admin/AdminAddAppointmentScreen';
import AdminAddPointsScreen from '../screens/Admin/AdminAddPoints';
import AdminCalendarScreen from '../screens/Admin/AdminCalendarScreen'; 
import AdminEditAccountScreen from '../screens/Admin/AdminEditAccountScreen';
import AdminEditProfileScreen from '../screens/Admin/AdminEditProfileScreen';
import AdminSettingsScreen from '../screens/Admin/AdminSettingsScreen';
import AboutScreen from '../screens/Client/AboutScreen'
import { Ionicons } from '@expo/vector-icons';

const AdminCalendarStack = createStackNavigator();

function AdminCalendarStackScreen({ navigation }) {
    return (
        <AdminCalendarStack.Navigator>
            <AdminCalendarStack.Screen name="Admin Calendar" 
            component={AdminCalendarScreen} 
            options={{ title: 'Calendar', headerTitleAlign: 'center', headerRight: () => (
                <Button
                  onPress={() => navigation.navigate('AdminAddAppointmentScreen')}
                  title="Add"
                  color="black"
                />
              ),}}/>
            <AdminCalendarStack.Screen name="AdminAddAppointmentScreen" options={{ title: 'Add Appointments', headerTitleAlign: 'center' }} component={AdminAddAppointmentScreen} />
        </AdminCalendarStack.Navigator>
    )
}

const AdminSettingsStack = createStackNavigator();

function AdminSettingsStackScreen() {
    return (
        <AdminSettingsStack.Navigator>
            <AdminSettingsStack.Screen name="Admin Settings" options={{ headerStyle:{backgroundColor: 'grey'}, headerTintColor: 'white', title: 'Admin Settings', headerTitleAlign: 'center' }} component={AdminSettingsScreen}/>
            <AdminSettingsStack.Screen name="EditAccountScreen" options={{ title: 'Edit Accounts', headerTitleAlign: 'center' }} component={AdminEditAccountScreen} />
            <AdminSettingsStack.Screen name="Points" options={{ title: 'Points', headerTitleAlign: 'center' }} component={AdminAddPointsScreen} />
        </AdminSettingsStack.Navigator>
    )
}

const AdminAboutStack = createStackNavigator();

function AdminAdminStackScreen({ navigation }) {
    return (
        <AdminAboutStack.Navigator
        screenOptions={{
            headerStyle:{backgroundColor: '#080808'},
            headerTintColor: 'white',
            headerTitleAlign: 'center'
        }}>
            <AdminAboutStack.Screen name="Nate" options={{ title: 'Nate',
                headerRight: () => (
                    <Button
                    onPress={() => navigation.navigate('Edit Profile')}
                    title="Edit"
                    color="#fff"
                    />
                ),}} component={AboutScreen}/>
            <AdminAboutStack.Screen name="Edit Profile" options={{ title: 'Edit Profile', headerTitleAlign: 'center' }} component={AdminEditProfileScreen}/>
        </AdminAboutStack.Navigator>
    )
}

const Tab = createBottomTabNavigator()

export default function AdminStack() {
  return (
    <Tab.Navigator 
        screenOptions={{
            tabBarStyle: {
            backgroundColor: '#080808',
            //backgroundColor: 'transparent',
            position:'absolute',
            bottom:0,
            elevation:0
            },
            headerShown: false,
            tabBarActiveTintColor: 'white',
            tabBarInactiveTintColor: 'white'
        }}>
                <Tab.Screen name='About' component={AdminAdminStackScreen} options={{ tabBarIcon: ({ color, size }) => (<Ionicons name="home" color={color} size={size} />)}} />
                <Tab.Screen name='Calendar' component={AdminCalendarStackScreen} options={{ tabBarIcon: ({ color, size }) => (<Ionicons name="calendar" color={color} size={size} />)}} />
                <Tab.Screen name='Admin' component={AdminSettingsStackScreen} options={{ tabBarIcon: ({ color, size }) => (<Ionicons name="settings" color={color} size={size} />)}} />
        </Tab.Navigator>
  );
}