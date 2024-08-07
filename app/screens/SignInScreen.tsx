// app/screens/SignInScreen.tsx

import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { TextInput, Button, Text, useTheme } from 'react-native-paper';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../../constants/firebaseConfig';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import DismissKeyboardView from '../../components/DismissKeyboardView';
import { SignInScreenNavigationProp } from '../../constants/types/navigation';

WebBrowser.maybeCompleteAuthSession();

type Props = {
    navigation: SignInScreenNavigationProp;
};

const SignInScreen: React.FC<Props> = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const { colors } = useTheme();

    const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
        clientId: "996449526571-i5772pu8uarpugmfa13hak9t0apfpk7i.apps.googleusercontent.com",
    });

    useEffect(() => {
        if (response?.type === 'success') {
            const { id_token } = response.params;
            const credential = GoogleAuthProvider.credential(id_token);
            signInWithCredential(auth, credential)
                .then(() => {
                    navigation.navigate('Tabs');
                })
                .catch((error: Error) => {
                    setError(error.message);
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [response]);

    const handleSignIn = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigation.navigate('Tabs');
        } catch (err) {
            const errorCode = (err as any).code;
            if (errorCode === 'auth/user-not-found') {
                setError('No user found with this email.');
            } else if (errorCode === 'auth/wrong-password') {
                setError('Incorrect password. Please try again.');
            } else {
                setError((err as Error).message);
            }
        }
    };

    const handleGoogleSignIn = () => {
        promptAsync();
    };

    return (
        <DismissKeyboardView style={[styles.container, { backgroundColor: colors.background }]}>
            <Text style={[styles.title, { color: colors.onSurface }]}>Welcome to NutritionApp</Text>
            <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                autoCapitalize="none"
                keyboardType="email-address"
                textContentType="emailAddress"
            />
            <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
                textContentType="password"
            />
            {error ? <Text style={[styles.error, { color: colors.error }]}>{error}</Text> : null}
            <Button mode="contained" onPress={handleSignIn} style={styles.button}>
                Sign In
            </Button>
            <Button
                mode="outlined"
                onPress={handleGoogleSignIn}
                style={styles.button}
                disabled={!request}
            >
                Sign In with Google
            </Button>
            <Button
                mode="text"
                onPress={() => navigation.navigate('CreateAccount')}
                style={styles.createAccountButton}
            >
                Create an Account
            </Button>
        </DismissKeyboardView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },
    title: {
        fontSize: 24,
        marginBottom: 16,
        textAlign: 'center',
    },
    input: {
        marginBottom: 12,
    },
    button: {
        marginTop: 12,
    },
    createAccountButton: {
        marginTop: 8,
    },
    error: {
        marginTop: 8,
        textAlign: 'center',
    },
});

export default SignInScreen;
