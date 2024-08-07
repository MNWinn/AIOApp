// app/App.tsx

import React from 'react';
import MainNavigator from './navigation/MainNavigator';
import { AuthProvider } from '../context/AuthContext';
import { Provider as PaperProvider } from 'react-native-paper';
import { useColorScheme } from '../hooks/useColorScheme';
import { lightTheme, darkTheme } from '../constants/theme';
import { registerRootComponent } from 'expo';
import { SafeAreaView, StyleSheet } from 'react-native';

export function App() {
    const colorScheme = useColorScheme();
    const appliedTheme = colorScheme === 'dark' ? darkTheme : lightTheme;

    return (
        <AuthProvider>
            <SafeAreaView style={[styles.safeArea, { backgroundColor: appliedTheme.colors.card }]}>
                <PaperProvider theme={appliedTheme}>
                    <MainNavigator />
                </PaperProvider>
            </SafeAreaView>
        </AuthProvider>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
});

export default registerRootComponent(App);
