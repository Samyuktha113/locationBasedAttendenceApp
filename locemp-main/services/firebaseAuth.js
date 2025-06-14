import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Updated Firebase configuration (NEW CREDENTIALS)
const firebaseConfig = {
    apiKey: "APIKEY",
    authDomain: "AUTHDOMAIN",
    projectId: "PROJECTID",
    storageBucket: "STORAGEBUCKET", // Fixed storage bucket
    messagingSenderId: "SENDERID",
    appId: "APPID"
};

let auth;
let db;

// Initialize Firebase only if no apps are already initialized
if (getApps().length === 0) {
    const app = initializeApp(firebaseConfig);

    // Initialize Firebase Authentication with persistence for React Native
    auth = initializeAuth(app, {
        persistence: getReactNativePersistence(ReactNativeAsyncStorage)
    });

    // Initialize Firestore
    db = getFirestore(app);
} else {
    // If the app is already initialized, use the existing instances
    const app = getApp();
    auth = getAuth(app);
    db = getFirestore(app);
}

// Export auth and db (Firestore) for use in other files
export { auth, db };
