// app/navigation/TabNavigator.tsx
import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import ExploreScreen from '../screens/ExploreScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LogFoodStack from './LogFoodStack';
import { TabBarIcon } from '../../components/navigation/TabBarIcon';
import { useColorScheme } from '../../hooks/useColorScheme';
import { lightTheme, darkTheme } from '../../constants/theme';
import { BottomTabBarProps, BottomTabBar } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
    const colorScheme = useColorScheme();
    const appliedTheme = colorScheme === 'dark' ? darkTheme : lightTheme;
    const [isTabBarVisible, setIsTabBarVisible] = useState(true);

    const CustomTabBar = (props: BottomTabBarProps) => {
        if (!isTabBarVisible) {
            return null;
        }
        return <BottomTabBar {...props} />;
    };

    const tabBarStyle = {
        backgroundColor: appliedTheme.colors.card,
        borderTopColor: appliedTheme.colors.border,
        height: 60,
        paddingBottom: 10,
        paddingHorizontal: 20,
    };

    return (
        <Tab.Navigator
            tabBar={props => <CustomTabBar {...props} />}
            screenOptions={{
                tabBarActiveTintColor: appliedTheme.colors.accent,
                tabBarInactiveTintColor: 'gray',
                tabBarStyle: tabBarStyle,
                headerShown: false,
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ color, size, focused }) => (
                        <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Log Food"
                children={() => <LogFoodStack setIsTabBarVisible={setIsTabBarVisible} />}
                options={{
                    tabBarIcon: ({ color, size, focused }) => (
                        <TabBarIcon name={focused ? 'restaurant' : 'restaurant-outline'} color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Explore"
                component={ExploreScreen}
                options={{
                    tabBarIcon: ({ color, size, focused }) => (
                        <TabBarIcon name={focused ? 'compass' : 'compass-outline'} color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ color, size, focused }) => (
                        <TabBarIcon name={focused ? 'person' : 'person-outline'} color={color} size={size} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}
