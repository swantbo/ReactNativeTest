import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import AdminAddAppointmentScreen from "../screens/admin/AdminAddAppointmentScreen";
import AdminAddPointsScreen from "../screens/admin/AdminAddPoints";
import AdminCalendarScreen from "../screens/admin/AdminCalendarScreen";
import AdminEditAccountScreen from "../screens/admin/AdminEditAccountScreen";
import AdminEditProfileScreen from "../screens/admin/AdminEditProfileScreen";
import AdminBarberScreen from "../screens/admin/AdminBarberScreen";
import { Ionicons } from "@expo/vector-icons";
import AdminTimeOffScreen from "../screens/admin/AdminTimeOffScreen";
import AdminOverViewScreen from "../screens/admin/AdminOverViewScreen";

const AdminCalendarStack = createStackNavigator();

function AdminCalendarStackScreen({ navigation }) {
  return (
    <AdminCalendarStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#121212",
          shadowColor: "#E8BD70",
        },
        headerTintColor: "#E8BD70",
        headerTitleAlign: "center",
      }}
    >
      <AdminCalendarStack.Screen
        name="Admin Calendar"
        component={AdminCalendarScreen}
        options={{
          title: "Calendar",
          headerLeft: () => (
            <Ionicons
              name="airplane"
              color={"#E8BD70"}
              size={23}
              style={{ padding: 10 }}
              onPress={() => navigation.navigate("AdminTimeOff")}
              title="Add"
              color="#E8BD70"
            />
          ),
          headerRight: () => (
            <Ionicons
              name="add-circle"
              color={"#E8BD70"}
              size={23}
              style={{ padding: 10 }}
              onPress={() => navigation.navigate("AdminAddAppointmentScreen")}
              title="Add"
              color="#E8BD70"
            />
          ),
        }}
      />
      <AdminCalendarStack.Screen
        name="AdminAddAppointmentScreen"
        options={{ title: "Add Appointments" }}
        component={AdminAddAppointmentScreen}
      />
      <AdminCalendarStack.Screen
        name="AdminTimeOff"
        options={{ title: "Time Off" }}
        component={AdminTimeOffScreen}
      />
    </AdminCalendarStack.Navigator>
  );
}

const AdminSettingsStack = createStackNavigator();

function AdminSettingsStackScreen({ navigation }) {
  return (
    <AdminSettingsStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#121212",
          shadowColor: "#E8BD70",
        },
        headerTintColor: "#E8BD70",
        headerTitleAlign: "center",
      }}
    >
      {/* <AdminSettingsStack.Screen name="Admin Settings" options={{ title: 'Admin Settings', headerTitleAlign: 'center' }} component={AdminSettingsScreen}/> */}
      <AdminSettingsStack.Screen
        name="EditAccountScreen"
        options={{
          title: "Edit Accounts",
          headerTitleAlign: "center",
          headerRight: () => (
            <Ionicons
              name="bar-chart"
              color={"#E8BD70"}
              size={23}
              style={{ padding: 10 }}
              onPress={() => navigation.navigate("OverView")}
              title="Add"
              color="#E8BD70"
            />
          ),
        }}
        component={AdminEditAccountScreen}
      />
      <AdminSettingsStack.Screen
        name="Points"
        options={{ title: "Points", headerTitleAlign: "center" }}
        component={AdminAddPointsScreen}
      />
      <AdminSettingsStack.Screen
        name="OverView"
        options={{ title: "OverView", headerTitleAlign: "center" }}
        component={AdminOverViewScreen}
      />
    </AdminSettingsStack.Navigator>
  );
}

const AdminAboutStack = createStackNavigator();

function AdminAboutStackScreen({ navigation }) {
  return (
    <AdminAboutStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#121212",
          shadowColor: "#E8BD70",
        },
        tabBarStyle: {
          backgroundColor: "#121212",
          position: "relative",
          bottom: 0,
          elevation: 0,
          borderTopWidth: 0,
        },
        headerTintColor: "#E8BD70",
        headerTitleAlign: "center",
        headerShadowVisible: false,
      }}
    >
      <AdminAboutStack.Screen
        name="Nate"
        options={{
          title: "Nate",
          headerRight: () => (
            <Ionicons
              name="build"
              color={"#E8BD70"}
              size={23}
              style={{ padding: 10 }}
              onPress={() => navigation.navigate("Edit Profile")}
              title="Add"
              color="#E8BD70"
            />
          ),
        }}
        component={AdminBarberScreen}
      />
      <AdminAboutStack.Screen
        name="Edit Profile"
        options={{ title: "Edit Profile", headerTitleAlign: "center" }}
        component={AdminEditProfileScreen}
      />
    </AdminAboutStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

export default function AdminStack() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "rgb(18, 18, 18)" },
        tabBarStyle: {
          backgroundColor: "rgb(18, 18, 18)",
          //backgroundColor: 'transparent',
          position: "relative",
          borderTopColor: "#E8BD70",
          bottom: 0,
          elevation: 0,
        },
        headerShown: false,
        tabBarActiveTintColor: "#E8BD70",
        tabBarInactiveTintColor: "#fff",
      }}
    >
      <Tab.Screen
        name="About"
        component={AdminAboutStackScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Calendar"
        component={AdminCalendarStackScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Admin"
        component={AdminSettingsStackScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
