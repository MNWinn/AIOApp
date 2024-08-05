import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet } from 'react-native';

import HomeScreen from './index';
import CameraScreen from './camera';
import ExploreScreen from './explore';
import DashboardScreen from './dashboard';
import SignInScreen from '../SignIn';
import CreateAccountScreen from '../CreateAccount';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuth } from '@/context/AuthContext';
import { lightTheme, darkTheme } from '@/constants/theme';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabLayout() {
  const colorScheme = useColorScheme();
  const appliedTheme = colorScheme === 'dark' ? darkTheme : lightTheme;

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: appliedTheme.colors.primary,
        tabBarInactiveTintColor: 'gray',
        tabBarShowLabel: true,
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabBarItem,
        tabBarLabelStyle: styles.tabBarLabel,
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Camera"
        component={CameraScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'camera' : 'camera-outline'} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'compass' : 'compass-outline'} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'person' : 'person-outline'} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function MainNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    // Return a loading screen here if needed
    return null;
  }

  return (
    <Stack.Navigator initialRouteName={user ? "Tabs" : "SignIn"}>
      <Stack.Screen name="SignIn" component={SignInScreen} options={{ headerShown: false }} />
      <Stack.Screen name="CreateAccount" component={CreateAccountScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Tabs" component={TabLayout} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    elevation: 0,
    backgroundColor: '#ffffff',
    borderRadius: 35,
    height: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 0,
  },
  tabBarItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBarLabel: {
    fontSize: 12,
    marginBottom: 5,
  },
});
