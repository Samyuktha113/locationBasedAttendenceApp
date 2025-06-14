
// // import { initializeApp, getApps } from "firebase/app";
// // import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
// // import { getFirestore } from 'firebase/firestore'; // Import Firestore SDK
// // import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// // // Your Firebase configuration

// //   const firebaseConfig = {
// //     apiKey: "AIzaSyA1EFsrftxGePNvjvy5AsiWJa0hnIUzQsw",
// //     authDomain: "locemp-ec7bf.firebaseapp.com",
// //     databaseURL: "https://locemp-ec7bf-default-rtdb.asia-southeast1.firebasedatabase.app",
// //     projectId: "locemp-ec7bf",
// //     storageBucket: "locemp-ec7bf.appspot.com",
// //     messagingSenderId: "925757012926",
// //     appId: "1:925757012926:web:eddffad3489ad1c06cd7ef"
// //   };
// // let auth;
// // let db; // Firestore instance

// // // Initialize Firebase only if no apps are already initialized
// // if (getApps().length === 0) {
// //     const app = initializeApp(firebaseConfig);

// //     // Initialize Firebase Authentication with persistence for React Native
// //     auth = initializeAuth(app, {
// //         persistence: getReactNativePersistence(ReactNativeAsyncStorage)
// //     });

// //     // Initialize Firestore
// //     db = getFirestore(app);
// // } else {
// //     // If the app is already initialized, use the existing instances
// //     auth = getAuth();
// //     db = getFirestore(); // Firestore doesn't need to be reinitialized
// // }

// // // Export auth and db (Firestore) for use in other files
// // export { auth, db };


// import { initializeApp, getApps } from "firebase/app";
// import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
// import { getFirestore } from 'firebase/firestore';
// import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// // Firebase configuration
// const firebaseConfig = {
//     apiKey: "AIzaSyA1EFsrftxGePNvjvy5AsiWJa0hnIUzQsw",
//     authDomain: "locemp-ec7bf.firebaseapp.com",
//     databaseURL: "https://locemp-ec7bf-default-rtdb.asia-southeast1.firebasedatabase.app",
//     projectId: "locemp-ec7bf",
//     storageBucket: "locemp-ec7bf.appspot.com",
//     messagingSenderId: "925757012926",
//     appId: "1:925757012926:web:eddffad3489ad1c06cd7ef"
// };

// let auth;
// let db;

// // Initialize Firebase only if no apps are already initialized
// if (getApps().length === 0) {
//     const app = initializeApp(firebaseConfig);

//     // Initialize Firebase Authentication with persistence for React Native
//     auth = initializeAuth(app, {
//         persistence: getReactNativePersistence(ReactNativeAsyncStorage)
//     });

//     // Initialize Firestore
//     db = getFirestore(app);
// } else {
//     auth = getAuth();
//     db = getFirestore(); // Firestore doesn't need to be reinitialized
// }

// // Export auth and db for use in other files
// export { auth, db };


// firebaseAuth.js
/* import { initializeApp, getApps } from "firebase/app";
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA1EFsrftxGePNvjvy5AsiWJa0hnIUzQsw",
    authDomain: "locemp-ec7bf.firebaseapp.com",
    databaseURL: "https://locemp-ec7bf-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "locemp-ec7bf",
    storageBucket: "locemp-ec7bf.appspot.com",
    messagingSenderId: "925757012926",
    appId: "1:925757012926:web:eddffad3489ad1c06cd7ef"
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
    auth = getAuth();
    db = getFirestore();
}

// Export auth and db (Firestore) for use in other files
export { auth, db };

 */
// import { initializeApp, getApps, getApp } from "firebase/app";
// import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
// import { getFirestore } from 'firebase/firestore';
// import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// // Your Firebase configuration
// const firebaseConfig = {
//     apiKey: "AIzaSyA1EFsrftxGePNvjvy5AsiWJa0hnIUzQsw",
//     authDomain: "locemp-ec7bf.firebaseapp.com",
//     databaseURL: "https://locemp-ec7bf-default-rtdb.asia-southeast1.firebasedatabase.app",
//     projectId: "locemp-ec7bf",
//     storageBucket: "locemp-ec7bf.appspot.com",
//     messagingSenderId: "925757012926",
//     appId: "1:925757012926:web:eddffad3489ad1c06cd7ef"
// };

// let auth;
// let db;

// // Initialize Firebase only if no apps are already initialized
// if (getApps().length === 0) {
//     const app = initializeApp(firebaseConfig);

//     // Initialize Firebase Authentication with persistence for React Native
//     auth = initializeAuth(app, {
//         persistence: getReactNativePersistence(ReactNativeAsyncStorage)
//     });

//     // Initialize Firestore
//     db = getFirestore(app);
// } else {
//     // If the app is already initialized, use the existing instances
//     const app = getApp(); // Get the default app instance
//     auth = getAuth(app); // Pass the app instance to getAuth
//     db = getFirestore(app); // Pass the app instance to getFirestore
// }

// // Export auth and db (Firestore) for use in other files
// export { auth, db };
 

import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Updated Firebase configuration (NEW CREDENTIALS)
const firebaseConfig = {
    apiKey: "AIzaSyDNxQUZDOQXg7GGFw4jxhB0PC9PWIAqmNo",
    authDomain: "locemp-e0340.firebaseapp.com",
    projectId: "locemp-e0340",
    storageBucket: "locemp-e0340.appspot.com", // Fixed storage bucket
    messagingSenderId: "1026054372310",
    appId: "1:1026054372310:web:2f88739baaa98009734277"
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
