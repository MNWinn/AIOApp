// app/_layout.tsx
import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { useColorScheme } from 'react-native';
import { AuthProvider } from '@/context/AuthContext';
import MainNavigator from './Tabs/_layout';
import { lightTheme, darkTheme } from '@/constants/theme';

export default function App() {
    const colorScheme = useColorScheme();
    const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

    return (
        <AuthProvider>
            <PaperProvider theme={theme}>
                <MainNavigator />
            </PaperProvider>
        </AuthProvider>
    );
}
