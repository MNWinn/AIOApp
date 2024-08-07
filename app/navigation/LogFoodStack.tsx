// app/navigation/LogFoodStack.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LogFoodScreen from '../screens/LogFoodScreen';
import BarcodeScannerScreen from '../screens/BarcodeScannerScreen';

type LogFoodStackProps = {
    setIsTabBarVisible: (visible: boolean) => void;
};

const Stack = createStackNavigator();

export default function LogFoodStack({ setIsTabBarVisible }: LogFoodStackProps) {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="LogFood" component={LogFoodScreen} />
            <Stack.Screen name="BarcodeScannerScreen">
                {props => <BarcodeScannerScreen {...props} setIsTabBarVisible={setIsTabBarVisible} />}
            </Stack.Screen>
        </Stack.Navigator>
    );
}
