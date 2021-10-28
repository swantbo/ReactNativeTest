import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import HomeScreen from '../screens/HomeScreen';
import AppointmentScreen from '../screens/AppointmentScreen';
import AboutScreen from '../screens/AboutScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator()

export default function HomeStack() {
  return (
    <Tab.Navigator screenOptions={{
      headerStyle:{backgroundColor: '#000000'},
      headerTintColor: 'white',
      headerTitleAlign: 'center'
  }}>
      <Tab.Screen name='Home' component={HomeScreen} />
      <Tab.Screen name='Appointment' component={AppointmentScreen} />
      <Tab.Screen name='About' component={AboutScreen} />
      <Tab.Screen name='Settings' component={SettingsScreen} />
  </Tab.Navigator>
  );
}