import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/Client/HomeScreen';
import AppointmentScreen from '../screens/Client/AppointmentScreen';
import AboutScreen from '../screens/Client/AboutScreen';
import SettingsScreen from '../screens/Client/SettingsScreen';

const Tab = createBottomTabNavigator()

export default function HomeStack() {
  return (
    <Tab.Navigator screenOptions={{
      headerStyle:{backgroundColor: '#000000'},
      tabBarStyle: {
        backgroundColor: '#000000',
        position:'absolute',
        bottom:0,
        elevation:0
        },
      headerTintColor: 'white',
      headerTitleAlign: 'center'
  }}>
      <Tab.Screen name='Home' component={HomeScreen} options={{ tabBarIcon: ({ color, size }) => (<Ionicons name="home" color={color} size={size} />)}}/>
      <Tab.Screen name='Appointment' component={AppointmentScreen} options={{ tabBarIcon: ({ color, size }) => (<Ionicons name="calendar" color={color} size={size} />)}}/>
      <Tab.Screen name='About' component={AboutScreen} options={{ tabBarIcon: ({ color, size }) => (<Ionicons name="list-circle" color={color} size={size} />)}}/>
      <Tab.Screen name='Settings' component={SettingsScreen} options={{ tabBarIcon: ({ color, size }) => (<Ionicons name="settings" color={color} size={size} />)}}/>
  </Tab.Navigator>
  );
}