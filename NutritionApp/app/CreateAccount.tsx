// app/CreateAccount.tsx
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { TextInput, Button, Text, useTheme } from 'react-native-paper';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '../constants/firebaseConfig';
import DismissKeyboardView from '@/components/DismissKeyboardView';
import { CreateAccountScreenNavigationProp } from '@/constants/types/navigation';

type Props = {
    navigation: CreateAccountScreenNavigationProp;
};

const CreateAccountScreen: React.FC<Props> = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const { colors } = useTheme();

    const handleCreateAccount = async () => {
        if (password !== repeatPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await sendEmailVerification(userCredential.user);
            setSuccess('Account created! Please verify your email before signing in.');
            setError(null);
        } catch (err) {
            const errorCode = (err as any).code;
            if (errorCode === 'auth/email-already-in-use') {
                setError('This email is already in use. Please use a different email.');
            } else if (errorCode === 'auth/invalid-email') {
                setError('Invalid email. Please enter a valid email address.');
            } else if (errorCode === 'auth/weak-password') {
                setError('Weak password. Please enter a stronger password.');
            } else {
                setError((err as Error).message);
            }
            setSuccess(null);
        }
    };

    return (
        <DismissKeyboardView style={[styles.container, { backgroundColor: colors.background }]}>
            <Text style={[styles.title, { color: colors.onSurface }]}>Create an Account</Text>
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
            <TextInput
                label="Repeat Password"
                value={repeatPassword}
                onChangeText={setRepeatPassword}
                secureTextEntry
                style={styles.input}
                textContentType="password"
            />
            {error ? <Text style={[styles.error, { color: colors.error }]}>{error}</Text> : null}
            {success ? <Text style={[styles.success, { color: colors.primary }]}>{success}</Text> : null}
            <Button mode="contained" onPress={handleCreateAccount} style={styles.button}>
                Create Account
            </Button>
            <Button
                mode="text"
                onPress={() => navigation.navigate('SignIn')}
                style={styles.button}
            >
                Go to Sign In
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
    error: {
        marginTop: 8,
        textAlign: 'center',
    },
    success: {
        marginTop: 8,
        textAlign: 'center',
    },
});

export default CreateAccountScreen;
