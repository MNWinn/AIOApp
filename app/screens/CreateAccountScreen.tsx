// app/CreateAccount.tsx
import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, Keyboard } from 'react-native';
import { TextInput, Button, Text, useTheme, HelperText, Menu } from 'react-native-paper';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth, db } from '../../constants/firebaseConfig';
import { setDoc, doc } from 'firebase/firestore';
import PhoneInput from 'react-native-phone-number-input';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import DismissKeyboardView from '@/components/DismissKeyboardView';
import { CreateAccountScreenNavigationProp } from '@/constants/types/navigation';

type Props = {
    navigation: CreateAccountScreenNavigationProp;
};

const CreateAccountScreen: React.FC<Props> = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [birthday, setBirthday] = useState(new Date());
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [sex, setSex] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [sexMenuVisible, setSexMenuVisible] = useState(false);
    const phoneInput = React.createRef<PhoneInput>();
    const { colors } = useTheme();

    const handleCreateAccount = async () => {
        if (!email || !password || !repeatPassword || !firstName || !lastName || !birthday || !height || !weight || !phone || !sex) {
            setError('All fields are required.');
            return;
        }

        if (password !== repeatPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Store additional user details in Firestore
            await setDoc(doc(db, 'users', user.uid), {
                firstName,
                lastName,
                email,
                birthday: birthday.toISOString().split('T')[0],  // Store as YYYY-MM-DD
                height: parseInt(height, 10),  // Ensure height is stored as a number
                weight: parseInt(weight, 10),  // Ensure weight is stored as a number
                sex,
                phone: phoneInput.current?.getNumberAfterPossiblyEliminatingZero().formattedNumber
            });

            await sendEmailVerification(user);
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

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date: Date) => {
        setBirthday(date);
        hideDatePicker();
    };

    useEffect(() => {
        // Reset states when exiting the screen
        return () => {
            setEmail('');
            setPassword('');
            setRepeatPassword('');
            setFirstName('');
            setLastName('');
            setBirthday(new Date());
            setHeight('');
            setWeight('');
            setSex('');
            setPhone('');
            setError(null);
            setSuccess(null);
        };
    }, [navigation]);

    return (
        <DismissKeyboardView style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <Text style={[styles.title, { color: colors.onBackground }]}>Create an Account</Text>
                <TextInput
                    label="First Name"
                    value={firstName}
                    onChangeText={setFirstName}
                    style={[styles.input, { backgroundColor: colors.surface, color: colors.onSurface }]}
                    textContentType="givenName"
                    returnKeyType="next"
                    onSubmitEditing={() => Keyboard.dismiss()}
                    importantForAutofill="yes"
                />
                <TextInput
                    label="Last Name"
                    value={lastName}
                    onChangeText={setLastName}
                    style={[styles.input, { backgroundColor: colors.surface, color: colors.onSurface }]}
                    textContentType="familyName"
                    returnKeyType="next"
                    onSubmitEditing={() => Keyboard.dismiss()}
                    importantForAutofill="yes"
                />
                <TextInput
                    label="Email"
                    value={email}
                    onChangeText={setEmail}
                    style={[styles.input, { backgroundColor: colors.surface, color: colors.onSurface }]}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    textContentType="emailAddress"
                    returnKeyType="next"
                    onSubmitEditing={() => Keyboard.dismiss()}
                    importantForAutofill="yes"
                />
                <TextInput
                    label="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    style={[styles.input, { backgroundColor: colors.surface, color: colors.onSurface }]}
                    textContentType="password"
                    returnKeyType="next"
                    onSubmitEditing={() => Keyboard.dismiss()}
                    importantForAutofill="yes"
                />
                <TextInput
                    label="Repeat Password"
                    value={repeatPassword}
                    onChangeText={setRepeatPassword}
                    secureTextEntry
                    style={[styles.input, { backgroundColor: colors.surface, color: colors.onSurface }]}
                    textContentType="password"
                    returnKeyType="next"
                    onSubmitEditing={() => Keyboard.dismiss()}
                    importantForAutofill="yes"
                />
                <TouchableOpacity onPress={showDatePicker}>
                    <View pointerEvents="none">
                        <TextInput
                            label="Birthday"
                            value={birthday.toISOString().split('T')[0]}
                            style={[styles.input, { backgroundColor: colors.surface, color: colors.onSurface }]}
                            textContentType="none"
                            editable={false}
                            importantForAutofill="no"
                        />
                    </View>
                </TouchableOpacity>
                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                />
                <PhoneInput
                    ref={phoneInput}
                    defaultValue={phone}
                    defaultCode="US"
                    layout="first"
                    onChangeFormattedText={setPhone}
                    containerStyle={[styles.phoneContainer, { backgroundColor: colors.surface }]}
                    textContainerStyle={[styles.phoneTextContainer, { backgroundColor: colors.surface }]}
                    codeTextStyle={{ color: colors.onSurface }}
                    textInputStyle={{ color: colors.onSurface }}
                    flagButtonStyle={{ backgroundColor: colors.surface }}
                    placeholder="Phone Number"
                />

                <Menu
                    visible={sexMenuVisible}
                    onDismiss={() => setSexMenuVisible(false)}
                    anchor={
                        <TouchableOpacity onPress={() => setSexMenuVisible(true)}>
                            <TextInput
                                placeholder="Sex"
                                value={sex}
                                style={[styles.input, { backgroundColor: colors.surface, color: colors.onSurface }]}
                                editable={false}
                                pointerEvents="none"
                                placeholderTextColor={colors.onSurface}
                                importantForAutofill="no"
                            />
                        </TouchableOpacity>
                    }
                >
                    <Menu.Item onPress={() => { setSex('Male'); setSexMenuVisible(false); }} title="Male" />
                    <Menu.Item onPress={() => { setSex('Female'); setSexMenuVisible(false); }} title="Female" />
                    <Menu.Item onPress={() => { setSex('Other'); setSexMenuVisible(false); }} title="Other" />
                    <Menu.Item onPress={() => { setSex('Prefer not to say'); setSexMenuVisible(false); }} title="Prefer not to say" />
                </Menu>
                <TextInput
                    label="Height (inches)"
                    value={height}
                    onChangeText={setHeight}
                    style={[styles.input, { backgroundColor: colors.surface, color: colors.onSurface }]}
                    keyboardType="numeric"
                    textContentType="none"
                    returnKeyType="next"
                    onSubmitEditing={() => Keyboard.dismiss()}
                    importantForAutofill="no"
                />
                <TextInput
                    label="Weight (lbs)"
                    value={weight}
                    onChangeText={setWeight}
                    style={[styles.input, { backgroundColor: colors.surface, color: colors.onSurface }]}
                    keyboardType="numeric"
                    textContentType="none"
                    returnKeyType="done"
                    onSubmitEditing={() => Keyboard.dismiss()}
                    importantForAutofill="no"
                />
                {error ? <HelperText type="error" visible={!!error}>{error}</HelperText> : null}
                {success ? <HelperText type="info" visible={!!success}>{success}</HelperText> : null}
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
            </ScrollView>
        </DismissKeyboardView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },
    scrollView: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        marginBottom: 24,
        textAlign: 'center',
    },
    input: {
        marginBottom: 16,
    },
    button: {
        marginTop: 16,
    },
    phoneContainer: {
        width: '100%',
        borderBottomWidth: 1,
        borderColor: '#ccc',
        marginBottom: 16,
    },
    phoneTextContainer: {
        backgroundColor: 'white',
    },
});

export default CreateAccountScreen;
