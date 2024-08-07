// app/navigation/MainNavigator.tsx

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import SignInScreen from '../screens/SignInScreen';
import CreateAccountScreen from '../screens/CreateAccountScreen';
import TabNavigator from './TabNavigator';
import { useAuth } from '../../context/AuthContext';

const Stack = createStackNavigator();

export default function MainNavigator() {
    const { user, loading } = useAuth();

    if (loading) {
        return null; // You can return a loading screen here if needed
    }

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={user ? "Tabs" : "SignIn"}>
                <Stack.Screen name="SignIn" component={SignInScreen} options={{ headerShown: false }} />
                <Stack.Screen name="CreateAccount" component={CreateAccountScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Tabs" component={TabNavigator} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
