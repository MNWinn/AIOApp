import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
    apiKey: "AIzaSyDGFWG1fD44Tjq3TpA6mSKhWSik2LxKEMg",
    authDomain: "nutritionapp-a45b5.firebaseapp.com",
    projectId: "nutritionapp-a45b5",
    storageBucket: "nutritionapp-a45b5.appspot.com",
    messagingSenderId: "578990436428",
    appId: "1:578990436428:web:a5a20073186e5d123a44e9",
    measurementId: "G-H5ER3X0H0R"
};


const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});

const db = getFirestore(app);

export { auth, db };