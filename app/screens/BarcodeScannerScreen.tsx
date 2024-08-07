// app/screens/BarcodeScannerScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Button } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from 'react-native-paper';

type Props = {
    navigation: any;
    setIsTabBarVisible: (visible: boolean) => void;
};

const BarcodeScannerScreen: React.FC<Props> = ({ navigation, setIsTabBarVisible }) => {
    const { colors } = useTheme();
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const [type, setType] = useState<'front' | 'back'>('back');
    const [torch, setTorch] = useState(false);

    useEffect(() => {
        if (!permission) {
            requestPermission();
        }
    }, [permission]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setIsTabBarVisible(false);
        });

        const unsubscribeBlur = navigation.addListener('blur', () => {
            setIsTabBarVisible(true);
        });

        return () => {
            unsubscribe();
            unsubscribeBlur();
        };
    }, [navigation]);

    const handleBarCodeScanned = ({ type, data }: any) => {
        setScanned(true);
        alert(`Bar code with type ${type} and data ${data} has been scanned!`);
        navigation.navigate('LogFood', { barcodeData: data });
    };

    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={[styles.message, { color: colors.onSurface }]}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} mode="contained">
                    Grant Permission
                </Button>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.closeButton}
                onPress={() => navigation.goBack()}
            >
                <Ionicons name="close" size={30} color="white" />
            </TouchableOpacity>
            <CameraView
                style={styles.camera}
                enableTorch={torch}
                facing={type}
                onBarcodeScanned={!scanned ? handleBarCodeScanned : undefined}
                barcodeScannerSettings={{
                    barcodeTypes: ['ean13'],
                }}
            >
                <View style={styles.overlay}>
                    <View style={styles.topOverlay} />
                    <View style={styles.middleOverlay}>
                        <View style={styles.sideOverlay} />
                        <View style={styles.focusedContainer}>
                            <View style={styles.focused} />
                        </View>
                        <View style={styles.sideOverlay} />
                    </View>
                    <View style={styles.bottomOverlay} />
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => {
                            setType(type === 'back' ? 'front' : 'back');
                        }}
                    >
                        <Ionicons name="camera-reverse-outline" size={30} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => {
                            setTorch(!torch);
                        }}
                    >
                        <Ionicons name={!torch ? 'flash-outline' : 'flash-off-outline'} size={30} color="white" />
                    </TouchableOpacity>
                </View>
                {scanned && <Button mode="contained" onPress={() => setScanned(false)}>Tap to Scan Again</Button>}
            </CameraView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 20,
        padding: 5,
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
    camera: {
        flex: 1,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    topOverlay: {
        flex: 1,
        width: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    middleOverlay: {
        flexDirection: 'row',
    },
    sideOverlay: {
        flex: 1,
        height: 200,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    focusedContainer: {
        height: 200,
        width: 200,
        borderWidth: 2,
        borderColor: 'white',
    },
    focused: {
        flex: 1,
    },
    bottomOverlay: {
        flex: 1,
        width: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    iconButton: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 10,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default BarcodeScannerScreen;
