// app/screens/LogFoodScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, TextInput, SectionList, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../../constants/firebaseConfig'; // Adjust this if the path is different
import { setDoc, doc } from 'firebase/firestore';
import { useTheme, Button } from 'react-native-paper';

const LogFoodScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const { colors } = useTheme();
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [foodName, setFoodName] = useState<string>('');
    const [quantity, setQuantity] = useState<string>('');
    const [servingSize, setServingSize] = useState<string>('');
    const [recentItems, setRecentItems] = useState<{ name: string; timestamp: string }[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        loadRecentItems();
    }, []);

    const loadRecentItems = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('@recent_items');
            setRecentItems(jsonValue != null ? JSON.parse(jsonValue) : []);
        } catch (e) {
            console.error(e);
        }
    };

    const handleSearch = async () => {
        setLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            console.log(`Search result for: ${searchQuery}`);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleManualEntry = async () => {
        const foodItem = {
            name: foodName,
            quantity,
            servingSize,
            timestamp: new Date(),
        };

        await storeRecentItem(foodItem);
        await logFoodItem('USER_ID', foodItem);

        setFoodName('');
        setQuantity('');
        setServingSize('');
    };

    const storeRecentItem = async (item: { name: string; quantity: string; servingSize: string; timestamp: Date }) => {
        try {
            const items = await getRecentItems();
            items.push(item);
            const jsonValue = JSON.stringify(items);
            await AsyncStorage.setItem('@recent_items', jsonValue);
            setRecentItems(items);
        } catch (e) {
            console.error(e);
        }
    };

    const getRecentItems = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('@recent_items');
            return jsonValue != null ? JSON.parse(jsonValue) : [];
        } catch (e) {
            console.error(e);
        }
    };

    const logFoodItem = async (userId: string, foodItem: { name: string; quantity: string; servingSize: string; timestamp: Date }) => {
        try {
            await setDoc(doc(db, 'users', userId, 'foodLogs', new Date().toISOString()), foodItem);
        } catch (e) {
            console.error(e);
        }
    };

    const renderRecentItem = ({ item }: { item: { name: string; timestamp: string } }) => (
        <TouchableOpacity style={styles.recentItem}>
            <Text style={styles.recentItemText}>{item.name}</Text>
        </TouchableOpacity>
    );

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <TextInput
                    style={[styles.input, { borderColor: colors.primary, backgroundColor: colors.surface, color: colors.onSurface }]}
                    placeholder="Search for food"
                    placeholderTextColor={colors.onSurfaceDisabled}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                <Button mode="contained" onPress={handleSearch} style={styles.button} disabled={loading}>
                    {loading ? <ActivityIndicator size="small" color={colors.onPrimary} /> : 'Search'}
                </Button>
                <Button mode="contained" onPress={() => navigation.navigate('BarcodeScannerScreen')} style={styles.button} disabled={loading}>
                    Scan Barcode
                </Button>
                <SectionList
                    sections={[{ title: 'Recent Items', data: recentItems }]}
                    renderItem={renderRecentItem}
                    keyExtractor={(item) => item.timestamp}
                    renderSectionHeader={({ section: { title } }) => (
                        <Text style={[styles.sectionHeader, { color: colors.onBackground }]}>{title}</Text>
                    )}
                    style={styles.list}
                />
                <TextInput
                    style={[styles.input, { borderColor: colors.primary, backgroundColor: colors.surface, color: colors.onSurface }]}
                    placeholder="Food Name"
                    placeholderTextColor={colors.onSurfaceDisabled}
                    value={foodName}
                    onChangeText={setFoodName}
                />
                <TextInput
                    style={[styles.input, { borderColor: colors.primary, backgroundColor: colors.surface, color: colors.onSurface }]}
                    placeholder="Quantity"
                    placeholderTextColor={colors.onSurfaceDisabled}
                    value={quantity}
                    onChangeText={setQuantity}
                    keyboardType="numeric"
                />
                <TextInput
                    style={[styles.input, { borderColor: colors.primary, backgroundColor: colors.surface, color: colors.onSurface }]}
                    placeholder="Serving Size"
                    placeholderTextColor={colors.onSurfaceDisabled}
                    value={servingSize}
                    onChangeText={setServingSize}
                />
                <Button mode="contained" onPress={handleManualEntry} style={styles.button} disabled={loading}>
                    Add Food
                </Button>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 8,
        marginBottom: 12,
    },
    button: {
        marginBottom: 12,
    },
    list: {
        marginVertical: 16,
    },
    recentItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderColor: 'rgba(230, 225, 229, 0.12)',
    },
    recentItemText: {
        fontSize: 16,
        color: 'rgba(230, 225, 229, 1)',
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        paddingTop: 16,
        paddingHorizontal: 8,
    },
});

export default LogFoodScreen;
