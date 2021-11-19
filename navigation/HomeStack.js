import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/Client/HomeScreen';
import AppointmentScreen from '../screens/Client/AppointmentScreen';
import AboutScreen from '../screens/Client/AboutScreen';
import SettingsScreen from '../screens/Client/SettingsScreen';
import ViewImageScreen from '../screens/Client/ViewImageScreen';
import ModalGoatPointScreen from '../screens/Client/ModalGoatPointScreen';

const homeSettingStack = createStackNavigator()

function homeSettingStackScreen({ navigation }) {
  return (
    <homeSettingStack.Navigator 
    screenOptions={{
        headerStyle:{backgroundColor: '#121212', shadowColor: '#E8BD70'}, headerTintColor: '#E8BD70',
        headerTitleAlign: 'left'
        }}>
        <homeSettingStack.Screen name='Home' component={HomeScreen} options={{ headerRight: () => (
                <Ionicons name="settings" color={'#E8BD70'} size={23} style={{padding: 10}}
                  onPress={() => navigation.navigate('Settings')}
                />
              ),}}/>
        <homeSettingStack.Screen name='Settings' options={{ title: 'Settings', headerTitleAlign: 'center'}} component={SettingsScreen} />
        {/* <homeSettingStack.Screen screenOptions={{ presentation: 'modal' }}> */}
          <homeSettingStack.Screen name="GoatPoint" mode='modal' screenOptions={{ mode: 'modal' }} component={ModalGoatPointScreen} />
        {/* </homeSettingStack.Screen> */}
    </homeSettingStack.Navigator>
)
}

const AboutStack = createStackNavigator()

function AboutStackScreen({ navigation }) {
  return (
    <AboutStack.Navigator 
    screenOptions={{
        headerStyle:{backgroundColor: '#121212', shadowColor: '#E8BD70'}, headerTintColor: '#E8BD70',
        headerTitleAlign: 'left'
        }}>
        <AboutStack.Screen name='Nate' component={AboutScreen} options={{ headerShown: false }}/>
        <AboutStack.Screen name='ViewImage' options={{ title: 'View Image', headerTitleAlign: 'center'}} component={ViewImageScreen} />
    </AboutStack.Navigator>
)
}

const Tab = createBottomTabNavigator()

export default function HomeStack({ navigation }) {
  return (
    <Tab.Navigator screenOptions={{
      headerStyle:{backgroundColor: '#121212', shadowColor: '#E8BD70'},
      tabBarStyle: {
        backgroundColor: '#121212',
        borderTopColor: '#E8BD70',
        position:'relative',
        bottom:0,
        elevation:0,
        borderTopWidth: 0
        },
      headerTintColor: '#E8BD70',
      headerTitleAlign: 'flex-start',
      tabBarActiveTintColor: '#E8BD70',
      tabBarInactiveTintColor: '#fff'
  }}>
      <Tab.Screen name='Home' component={homeSettingStackScreen} options={{ headerShown: false, tabBarIcon: ({ color, size }) => (<Ionicons name="home" color={color} size={size} />)}}/>
      <Tab.Screen name='Appointment' component={AppointmentScreen} options={{ tabBarIcon: ({ color, size }) => (<Ionicons name="calendar" color={color} size={size} />)}}/>
      <Tab.Screen name='Nate' component={AboutStackScreen} options={{ headerShown: false, tabBarIcon: ({ color, size }) => (<Ionicons name="list-circle" color={color} size={size} />)}}/>
  </Tab.Navigator>
  );
}