// /* CORRECT CODE WORK WITHOUT CHECKING"
// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   Button,
//   Image,
//   StyleSheet,
//   Alert,
//   TextInput,
// } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import { doc, getDoc, setDoc } from 'firebase/firestore';
// import { db } from '../services/firebaseAuth'; // Adjust the path as needed
// import DateTimePicker from '@react-native-community/datetimepicker';

// const OnsiteMarkAttendance = ({ navigation }) => {
//   const [image, setImage] = useState(null);
//   const [eid, setEid] = useState(''); // Assume you have the employee ID available
//   const [location, setLocation] = useState('');
//   const [date, setDate] = useState(new Date());
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [loading, setLoading] = useState(false);

//   // Function to pick an image from the gallery
//   const pickImage = async () => {
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (status !== 'granted') {
//       Alert.alert('Permission Denied', 'Camera roll access is needed to upload a photo.');
//       return;
//     }

//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       quality: 1,
//     });

//     if (!result.canceled) {
//       setImage(result.assets[0].uri); // Set the image from the selected result
//       Alert.alert('Photo Selected', 'You have successfully uploaded a photo.');
//     }
//   };

//   // Function to check attendance and submit
//   const markAttendance = async () => {
//     if (!image) {
//       Alert.alert('Error', 'Please upload a photo first.');
//       return;
//     }

//     setLoading(true);
//     try {
//       // Fetch onsite work for the given eid
//       const onsiteWorkDoc = await getDoc(doc(db, 'onsitework', eid));
//       if (!onsiteWorkDoc.exists()) {
//         Alert.alert('Error', 'No onsite work found for today.');
//         return;
//       }

//       const onsiteData = onsiteWorkDoc.data();
//       const onsiteDate = onsiteData.date; // Assuming this field exists in your onsite work document

//       // Check if the date matches today
//       if (onsiteDate !== date.toISOString().split('T')[0]) {
//         Alert.alert('Error', 'No onsite work found for today.');
//         return;
//       }

//       // Mark attendance in the employee attendance collection
//       await setDoc(doc(db, 'employeeAttendance', `${eid}-${onsiteDate}`), {
//         eid,
//         date: onsiteDate,
//         location: onsiteData.location,
//         markedAt: new Date(),
//       });

//       Alert.alert('Success', 'Attendance marked successfully!');
//       navigation.goBack();
//     } catch (error) {
//       console.error(error);
//       Alert.alert('Error', 'Failed to mark attendance. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Mark Attendance</Text>

//       <TextInput
//         placeholder="Employee ID"
//         value={eid}
//         onChangeText={setEid}
//         style={styles.input}
//       />

//       <Button title="Upload Photo" onPress={pickImage} />

//       {image && (
//         <Image source={{ uri: image }} style={styles.image} />
//       )}

//       <Button
//         title={loading ? "Submitting..." : "Submit Attendance"}
//         onPress={markAttendance}
//         disabled={!image || loading} // Disable if no image is uploaded or if loading
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   title: {
//     fontSize: 24,
//     marginBottom: 20,
//   },
//   input: {
//     height: 40,
//     borderColor: 'gray',
//     borderWidth: 1,
//     marginBottom: 12,
//     paddingHorizontal: 8,
//     width: '100%',
//   },
//   image: {
//     width: 300,
//     height: 300,
//     marginTop: 20,
//     marginBottom: 20,
//   },
// });

// export default OnsiteMarkAttendance;*/

// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   Button,
//   Image,
//   StyleSheet,
//   Alert,
//   TextInput,
// } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import * as MediaLibrary from 'expo-media-library';
// import * as Location from 'expo-location'; // Import location library
// import { doc, getDoc, setDoc } from 'firebase/firestore';
// import { db } from '../services/firebaseAuth'; // Adjust the path as needed
// import axios from 'axios'; // Ensure axios is installed

// const OnsiteMarkAttendance = ({ navigation }) => {
//   const [image, setImage] = useState(null);
//   const [eid, setEid] = useState(''); // Assume you have the employee ID available
//   const [loading, setLoading] = useState(false);
//   const [metadata, setMetadata] = useState(null);
//   const [currentLocation, setCurrentLocation] = useState(null);
//   const [isVerified, setIsVerified] = useState(false);

//   const apiKey = 'YOUR_GOOGLE_MAPS_API_KEY'; // Replace with your Google Maps API key

//   const pickImage = async () => {
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (status !== 'granted') {
//       Alert.alert('Permission Denied', 'Camera roll access is needed to upload a photo.');
//       return;
//     }

//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       quality: 1,
//     });

//     if (!result.canceled) {
//       setImage(result.assets[0].uri); // Set the image from the selected result
//       Alert.alert('Photo Selected', 'You have successfully uploaded a photo.');
//       await extractMetadata(result.assets[0].uri); // Extract metadata from the selected image
//     }
//   };

//   const extractMetadata = async (uri) => {
//     try {
//       const asset = await MediaLibrary.getAssetInfoAsync(uri);
//       if (asset && asset.exif) {
//         const { creationTime } = asset;
//         const date = creationTime ? new Date(creationTime).toISOString().split('T')[0] : 'Date not available';
//         const time = creationTime ? new Date(creationTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Time not available';

//         const extractedMetadata = {
//           date,
//           time,
//         };

//         console.log('Extracted Metadata:', extractedMetadata);
//         setMetadata(extractedMetadata);
//       } else {
//         console.log('No EXIF data available for this image.');
//         Alert.alert('Warning', 'No EXIF data available for this image.');
//       }
//     } catch (error) {
//       console.error('Error extracting metadata:', error);
//       Alert.alert('Error', 'Could not extract metadata from the image.');
//     }
//   };

//   const fetchCurrentLocation = async () => {
//     try {
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') {
//         Alert.alert('Permission Denied', 'Location permission is required.');
//         return;
//       }

//       const location = await Location.getCurrentPositionAsync({});
//       const { latitude, longitude } = location.coords;
//       setCurrentLocation({ latitude, longitude });

//       // Convert coordinates to address
//       const address = await convertCoordsToAddress(latitude, longitude);
//       return address;
//     } catch (error) {
//       console.error('Error fetching location:', error);
//       Alert.alert('Error', 'Could not fetch current location.');
//     }
//   };

//   const convertCoordsToAddress = async (latitude, longitude) => {
//     try {
//       const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`);
//       if (response.data.results.length > 0) {
//         const address = response.data.results[0].formatted_address;
//         console.log('Current Location Address:', address);
//         return address;
//       } else {
//         Alert.alert('Error', 'Could not find an address for this location.');
//       }
//     } catch (error) {
//       console.error('Error fetching address:', error);
//       Alert.alert('Error', 'Failed to convert coordinates to address.');
//     }
//   };

//   const verifyDetails = async () => {
//     if (!currentLocation) {
//       Alert.alert('Error', 'No current location available to verify.');
//       return;
//     }

//     // Fetch the current address
//     const address = await fetchCurrentLocation();

//     try {
//       const onsiteWorkDoc = await getDoc(doc(db, 'onsitework', eid));
//       if (!onsiteWorkDoc.exists()) {
//         Alert.alert('Error', 'No onsite work found for today.');
//         return;
//       }

//       const onsiteData = onsiteWorkDoc.data();
//       const onsiteLocation = onsiteData.location; // Assuming this field exists in your onsite work document

//       // Check if the current address matches the onsite location
//       if (onsiteLocation === address) {
//         setIsVerified(true);
//         Alert.alert('Success', 'Details verified successfully! You can now submit attendance.');
//       } else {
//         Alert.alert('Error', 'Current location does not match the onsite work details.');
//       }
//     } catch (error) {
//       console.error('Error verifying details:', error);
//       Alert.alert('Error', 'Failed to verify details. Please try again.');
//     }
//   };

//   const markAttendance = async () => {
//     if (!isVerified) {
//       Alert.alert('Error', 'Please verify the details before submitting.');
//       return;
//     }

//     setLoading(true);
//     try {
//       // Store attendance in the employee attendance collection
//       await setDoc(doc(db, 'employeeAttendance', `${eid}-${metadata.date}`), {
//         eid,
//         date: metadata.date,
//         time: metadata.time,
//         markedAt: new Date(),
//       });

//       Alert.alert('Success', 'Attendance marked successfully!');
//       navigation.goBack();
//     } catch (error) {
//       console.error(error);
//       Alert.alert('Error', 'Failed to mark attendance. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Mark Attendance</Text>

//       <TextInput
//         placeholder="Employee ID"
//         value={eid}
//         onChangeText={setEid}
//         style={styles.input}
//       />

//       <Button title="Upload Photo" onPress={pickImage} />

//       {image && (
//         <Image source={{ uri: image }} style={styles.image} />
//       )}

//       <Button title="Verify Details" onPress={verifyDetails} />
      
//       <Button
//         title={loading ? "Submitting..." : "Submit Attendance"}
//         onPress={markAttendance}
//         disabled={!isVerified || loading} // Disable if not verified or if loading
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   title: {
//     fontSize: 24,
//     marginBottom: 20,
//   },
//   input: {
//     height: 40,
//     borderColor: 'gray',
//     borderWidth: 1,
//     marginBottom: 12,
//     paddingHorizontal: 8,
//     width: '100%',
//   },
//   image: {
//     width: 300,
//     height: 300,
//     marginTop: 20,
//     marginBottom: 20,
//   },
// });

// export default OnsiteMarkAttendance;

// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, Button } from 'react-native';
// import * as Location from 'expo-location';
// import { db } from '../services/firebaseAuth';
// import { collection, addDoc } from 'firebase/firestore';

// // Haversine formula to calculate distance
// const haversineDistance = (coords1, coords2) => {
//   const toRad = (value) => (value * Math.PI) / 180;
//   const R = 6371;
//   const dLat = toRad(coords2.latitude - coords1.latitude);
//   const dLon = toRad(coords2.longitude - coords1.longitude);

//   const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//             Math.cos(toRad(coords1.latitude)) * Math.cos(toRad(coords2.latitude)) *
//             Math.sin(dLon / 2) * Math.sin(dLon / 2);

//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   return R * c * 1000;
// };

// export default function MarkAttendance() {
//   const [userLocation, setUserLocation] = useState(null);
//   const [withinRange, setWithinRange] = useState(false);
//   const [message, setMessage] = useState('');
//   const [isError, setIsError] = useState(false);

//   // Define company location
//   const companyLocation = {
//     latitude: 37.4220936, // Replace with your company's latitude
//     longitude: -122.083922, // Replace with your company's longitude
//   };

//   const getUserLocation = async () => {
//     let { status } = await Location.requestForegroundPermissionsAsync();
//     if (status !== 'granted') {
//       setMessage('Permission to access location was denied');
//       return;
//     }

//     let location = await Location.getCurrentPositionAsync({});
//     setUserLocation(location.coords);
//   };

//   const checkLocation = () => {
//     if (userLocation) {
//       const distance = haversineDistance(userLocation, companyLocation);
//       if (distance <= 1000) {
//         setWithinRange(true);
//         setMessage('');
//         setIsError(false);
//       } else {
//         setWithinRange(false);
//         setMessage('You are outside the allowed range. Attendance cannot be marked.');
//         setIsError(true);
//       }
//     }
//   };

//   const markAttendance = async () => {
//     if (withinRange) {
//       const currentTime = new Date().toLocaleString();
//       setMessage('Attendance marked successfully at ' + currentTime + '!');
//       setIsError(false);

//       // Simple Firestore addition
//       try {
//         await addDoc(collection(db, 'onsitework'), {
//           time: currentTime,
//           location: userLocation,
//         });
//       } catch (error) {
//         setMessage('Error marking attendance. Please try again.');
//         setIsError(true);
//       }
//     } else {
//       setMessage('Attendance cannot be marked because you are outside the allowed range.');
//       setIsError(true);
//     }
//   };

//   useEffect(() => {
//     getUserLocation();
//   }, []);

//   useEffect(() => {
//     checkLocation();
//   }, [userLocation]);

//   return (
//     <View style={styles.container}>
//       <Text>Mark Attendance</Text>
//       {userLocation ? (
//         <Text>Your Location: Lat: {userLocation.latitude}, Lon: {userLocation.longitude}</Text>
//       ) : (
//         <Text>Fetching your location...</Text>
//       )}
//       <Button
//         title="Submit Attendance"
//         onPress={markAttendance}
//         disabled={!withinRange}
//         color={withinRange ? "blue" : "gray"}
//       />
//       <Text style={[styles.message, isError ? styles.errorMessage : null]}>{message}</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 20,
//   },
//   message: {
//     color: 'black',
//     marginTop: 10,
//   },
//   errorMessage: {
//     color: 'red',
//   },
// });


/*
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import * as Location from 'expo-location';
import { db } from '../services/firebaseAuth';
import { doc, setDoc } from 'firebase/firestore';
import { useEmployee } from '../context/EmployeeContext';

// Haversine formula to calculate distance
const haversineDistance = (coords1, coords2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(coords2.latitude - coords1.latitude);
  const dLon = toRad(coords2.longitude - coords1.longitude);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(coords1.latitude)) * Math.cos(toRad(coords2.latitude)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c * 1000;
};

export default function MarkAttendance() {
  const { employeeData } = useEmployee(); // Access employee data
  const [userLocation, setUserLocation] = useState(null);
  const [withinRange, setWithinRange] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  // Define company location
  const companyLocation = {
    latitude: 37.4220936, // Replace with your company's latitude
    longitude: -122.083922, // Replace with your company's longitude
  };

  const getUserLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setMessage('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setUserLocation(location.coords);
  };

  const checkLocation = () => {
    if (userLocation) {
      const distance = haversineDistance(userLocation, companyLocation);
      if (distance <= 1000) {
        setWithinRange(true);
        setMessage('');
        setIsError(false);
      } else {
        setWithinRange(false);
        setMessage('You are outside the allowed range. Attendance cannot be marked.');
        setIsError(true);
      }
    }
  };

  const markAttendance = async () => {
    if (withinRange && employeeData?.eid) {
      const currentTime = new Date().toLocaleString();
      setMessage('Attendance marked successfully at ' + currentTime + '!');
      setIsError(false);

      // Set document using eid as the document ID
      try {
        await setDoc(doc(db, 'onsitework', employeeData.eid), {
          time: currentTime,
          location: userLocation,
        });
      } catch (error) {
        setMessage('Error marking attendance. Please try again.');
        setIsError(true);
      }
    } else {
      setMessage('Attendance cannot be marked because you are outside the allowed range or missing employee ID.');
      setIsError(true);
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    checkLocation();
  }, [userLocation]);

  return (
    <View style={styles.container}>
      <Text>Mark Attendance</Text>
      {userLocation ? (
        <Text>Your Location: Lat: {userLocation.latitude}, Lon: {userLocation.longitude}</Text>
      ) : (
        <Text>Fetching your location...</Text>
      )}
      <Button
        title="Submit Attendance"
        onPress={markAttendance}
        disabled={!withinRange}
        color={withinRange ? "blue" : "gray"}
      />
      <Text style={[styles.message, isError ? styles.errorMessage : null]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  message: {
    color: 'black',
    marginTop: 10,
  },
  errorMessage: {
    color: 'red',
  },
}); */



// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, Button } from 'react-native';
// import * as Location from 'expo-location';
// import { db } from '../services/firebaseAuth';
// import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
// import { useEmployee } from '../context/EmployeeContext';

// // Haversine formula to calculate distance
// const haversineDistance = (coords1, coords2) => {
//   const toRad = (value) => (value * Math.PI) / 180;
//   const R = 6371; // Radius of the Earth in kilometers
//   const dLat = toRad(coords2.latitude - coords1.latitude);
//   const dLon = toRad(coords2.longitude - coords1.longitude);

//   const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//             Math.cos(toRad(coords1.latitude)) * Math.cos(toRad(coords2.latitude)) *
//             Math.sin(dLon / 2) * Math.sin(dLon / 2);

//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   return R * c * 1000; // Return distance in meters
// };

// export default function MarkAttendance() {
//   const { employeeData } = useEmployee(); // Access employee data
//   const [userLocation, setUserLocation] = useState(null);
//   const [withinRange, setWithinRange] = useState(false);
//   const [message, setMessage] = useState('');
//   const [isError, setIsError] = useState(false);

//   // Define company location (adjust with your actual coordinates)
//   const companyLocation = {
//     latitude: 37.4220936, // Replace with your company's latitude
//     longitude: -122.083922, // Replace with your company's longitude
//   };

//   const getUserLocation = async () => {
//     let { status } = await Location.requestForegroundPermissionsAsync();
//     if (status !== 'granted') {
//       setMessage('Permission to access location was denied');
//       return;
//     }

//     let location = await Location.getCurrentPositionAsync({});
//     setUserLocation(location.coords);
//   };

//   const checkLocation = () => {
//     if (userLocation) {
//       const distance = haversineDistance(userLocation, companyLocation);
//       if (distance <= 1000) {
//         setWithinRange(true);
//         setMessage('');
//         setIsError(false);
//       } else {
//         setWithinRange(false);
//         setMessage('You are outside the allowed range. Attendance cannot be marked.');
//         setIsError(true);
//       }
//     }
//   };

//   const markAttendance = async () => {
//     if (withinRange && employeeData?.eid) {
//       const currentTime = new Date().toLocaleString();
//       setMessage('Attendance marked successfully at ' + currentTime + '!');
//       setIsError(false);

//       try {
//         // Reference to the employee's attendance document in the "employeeAttendance" collection
//         const attendanceRef = doc(db, 'employeeAttendance', employeeData.eid);

//         // Get the attendance document to check if it exists
//         const attendanceDoc = await getDoc(attendanceRef);

//         if (attendanceDoc.exists()) {
//           // If the document exists, update the attendance array with the new record
//           await updateDoc(attendanceRef, {
//             attendance: arrayUnion({
//               time: currentTime,
//               location: userLocation,
//             }),
//           });
//         } else {
//           // If the document doesn't exist, create a new one with the first attendance record
//           await setDoc(attendanceRef, {
//             // empid: employeeData.eid,
//             attendance: [{
//               time: currentTime,
//               location: userLocation,
//             }],
//           });
//         }
//       } catch (error) {
//         setMessage('Error marking attendance. Please try again.');
//         setIsError(true);
//       }
//     } else {
//       setMessage('Attendance cannot be marked because you are outside the allowed range or missing employee ID.');
//       setIsError(true);
//     }
//   };

//   useEffect(() => {
//     getUserLocation();
//   }, []);

//   useEffect(() => {
//     checkLocation();
//   }, [userLocation]);

//   return (
//     <View style={styles.container}>
//       <Text>Mark Attendance</Text>
//       {userLocation ? (
//         <Text>Your Location: Lat: {userLocation.latitude}, Lon: {userLocation.longitude}</Text>
//       ) : (
//         <Text>Fetching your location...</Text>
//       )}
//       <Button
//         title="Submit Attendance"
//         onPress={markAttendance}
//         disabled={!withinRange}
//         color={withinRange ? "blue" : "gray"}
//       />
//       <Text style={[styles.message, isError ? styles.errorMessage : null]}>{message}</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 20,
//   },
//   message: {
//     color: 'black',
//     marginTop: 10,
//   },
//   errorMessage: {
//     color: 'red',
//   },
// });




// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, Button } from 'react-native';
// import * as Location from 'expo-location';
// import { db } from '../services/firebaseAuth';
// import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
// import { useEmployee } from '../context/EmployeeContext';

// // Haversine formula to calculate distance
// const haversineDistance = (coords1, coords2) => {
//   const toRad = (value) => (value * Math.PI) / 180;
//   const R = 6371; // Radius of the Earth in kilometers
//   const dLat = toRad(coords2.latitude - coords1.latitude);
//   const dLon = toRad(coords2.longitude - coords1.longitude);

//   const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//             Math.cos(toRad(coords1.latitude)) * Math.cos(toRad(coords2.latitude)) *
//             Math.sin(dLon / 2) * Math.sin(dLon / 2);

//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   return R * c * 1000; // Return distance in meters
// };

// export default function MarkAttendance() {
//   const { employeeData } = useEmployee(); // Access employee data
//   const [userLocation, setUserLocation] = useState(null);
//   const [withinRange, setWithinRange] = useState(false);
//   const [message, setMessage] = useState('');
//   const [isError, setIsError] = useState(false);

//   // Define company location (adjust with your actual coordinates)
//   const companyLocation = {
//     latitude: 37.4219983, // Replace with your company's latitude
//     longitude: -122.084, // Replace with your company's longitude
//   };

//   const getUserLocation = async () => {
//     let { status } = await Location.requestForegroundPermissionsAsync();
//     if (status !== 'granted') {
//       setMessage('Permission to access location was denied');
//       return;
//     }

//     let location = await Location.getCurrentPositionAsync({});
//     setUserLocation(location.coords);
//   };

//   const checkLocation = () => {
//     if (userLocation) {
//       const distance = haversineDistance(userLocation, companyLocation);
//       if (distance <= 100) { // Update the threshold to 100 meters
//         setWithinRange(true);
//         setMessage('');
//         setIsError(false);
//       } else {
//         setWithinRange(false);
//         setMessage('You are outside the allowed range. Attendance cannot be marked.');
//         setIsError(true);
//       }
//     }
//   };

//   const markAttendance = async () => {
//     if (withinRange && employeeData?.eid) {
//       const currentTime = new Date().toLocaleString();
//       setMessage('Attendance marked successfully at ' + currentTime + '!');
//       setIsError(false);

//       try {
//         // Reference to the employee's attendance document in the "employeeAttendance" collection
//         const attendanceRef = doc(db, 'offsiteAttendance', employeeData.eid);

//         // Get the attendance document to check if it exists
//         const attendanceDoc = await getDoc(attendanceRef);

//         if (attendanceDoc.exists()) {
//           // If the document exists, update the attendance array with the new record
//           await updateDoc(attendanceRef, {
//             attendance: arrayUnion({
//               time: currentTime,
//               location: userLocation,
//             }),
//           });
//         } else {
//           // If the document doesn't exist, create a new one with the first attendance record
//           await setDoc(attendanceRef, {
//             // empid: employeeData.eid,
//             attendance: [{
//               time: currentTime,
//               location: userLocation,
//             }],
//           });
//         }
//       } catch (error) {
//         setMessage('Error marking attendance. Please try again.');
//         setIsError(true);
//       }
//     } else {
//       setMessage('Attendance cannot be marked because you are outside the allowed range or missing employee ID.');
//       setIsError(true);
//     }
//   };

//   useEffect(() => {
//     getUserLocation();
//   }, []);

//   useEffect(() => {
//     checkLocation();
//   }, [userLocation]);

//   return (
//     <View style={styles.container}>
//       <Text>Mark Attendance</Text>
//       {userLocation ? (
//         <Text>Your Location: Lat: {userLocation.latitude}, Lon: {userLocation.longitude}</Text>
//       ) : (
//         <Text>Fetching your location...</Text>
//       )}
//       <Button
//         title="Submit Attendance"
//         onPress={markAttendance}
//         disabled={!withinRange}
//         color={withinRange ? "blue" : "gray"}
//       />
//       <Text style={[styles.message, isError ? styles.errorMessage : null]}>{message}</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 20,
//   },
//   message: {
//     color: 'black',
//     marginTop: 10,
//   },
//   errorMessage: {
//     color: 'red',
//   },
// });

// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, Button } from 'react-native';
// import * as Location from 'expo-location';
// import { db } from '../services/firebaseAuth';
// import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
// import { useEmployee } from '../context/EmployeeContext';
// import Icon from "react-native-vector-icons/FontAwesome";

// const GOOGLE_API_KEY = 'AIzaSyDgyc7bzv3S5K7MsU6NwGaiMTxlVJOxPVc'; // Replace with your Google Maps API Key

// // Haversine formula to calculate distance
// const haversineDistance = (coords1, coords2) => {
//   const toRad = (value) => (value * Math.PI) / 180;
//   const R = 6371; // Radius of the Earth in kilometers
//   const dLat = toRad(coords2.latitude - coords1.latitude);
//   const dLon = toRad(coords2.longitude - coords1.longitude);

//   const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//             Math.cos(toRad(coords1.latitude)) * Math.cos(toRad(coords2.latitude)) *
//             Math.sin(dLon / 2) * Math.sin(dLon / 2);

//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   return R * c * 1000; // Return distance in meters
// };

// export default function MarkAttendance({navigation}) {
//   const { employeeData } = useEmployee(); // Access employee data
//   const [userLocation, setUserLocation] = useState(null);
//   const [fetchedAddress, setFetchedAddress] = useState('');
//   const [withinRange, setWithinRange] = useState(false);
//   const [message, setMessage] = useState('');
//   const [isError, setIsError] = useState(false);

//   useEffect(() => {
//     navigation.setOptions({
//       headerStyle: {
//         backgroundColor: "#faebd7", // Background color to match the screen
//         shadowColor: "transparent", // Remove shadow from the header
//         elevation: 0, // Remove Android header elevation
//       },
//       headerTintColor: "#000", // Set icon and text color to dark
//       headerRight: () => (
//         <TouchableOpacity onPress={handleLogout} style={styles.logoutIcon}>
//           <Icon name="sign-out" size={24} color="#000" />
//         </TouchableOpacity>
//       ),
//       headerLeft: () => null, // Remove the back arrow
//       headerShown: true, // Show header for logout icon
//       title: "", // Remove title
//     });
//   }, [navigation]);

//   const handleLogout = async () => {
//     try {
//       console.log("User logged out");
//       navigation.navigate("HomeScreen");
//     } catch (error) {
//       console.error("Logout Error:", error);
//     }
//   };

//   // Define company location (adjust with your actual coordinates)
//   const companyLocation = {
//     latitude: 9.1628746, // Replace with your company's latitude
//     longitude: 77.8684,// Replace with your company's longitude
//   };

//   const getUserLocation = async () => {
//     let { status } = await Location.requestForegroundPermissionsAsync();
//     if (status !== 'granted') {
//       setMessage('Permission to access location was denied');
//       return;
//     }

//     let location = await Location.getCurrentPositionAsync({});
//     setUserLocation(location.coords);

//     // Fetch the address after getting the location
//     const address = await fetchAddress(location.coords.latitude, location.coords.longitude);
//     setFetchedAddress(address);
//   };

//   const checkLocation = () => {
//     if (userLocation) {
//       const distance = haversineDistance(userLocation, companyLocation);
//       if (distance <= 100) { // Update the threshold to 100 meters
//         setWithinRange(true);
//         setMessage('');
//         setIsError(false);
//       } else {
//         setWithinRange(false);
//         setMessage('You are outside the allowed range. Attendance cannot be marked.');
//         setIsError(true);
//       }
//     }
//   };

//   const fetchAddress = async (latitude, longitude) => {
//     try {
//       const response = await fetch(
//         `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`
//       );
//       const data = await response.json();
//       if (data.status === 'OK') {
//         return data.results[0]?.formatted_address || 'Address not found';
//       } else {
//         return 'Address not found';
//       }
//     } catch (error) {
//       console.error('Error fetching address:', error);
//       return 'Address not found';
//     }
//   };

//   const markAttendance = async () => {
//     if (withinRange && employeeData?.eid) {
//       const currentTime = new Date().toLocaleString();
//       setMessage('Attendance marked successfully at ' + currentTime + '!');
//       setIsError(false);

//       try {
//         // Reference to the employee's attendance document in the "onsiteAttendance" collection
//         const attendanceRef = doc(db, 'offsiteAttendance', employeeData.eid);

//         // Get the attendance document to check if it exists
//         const attendanceDoc = await getDoc(attendanceRef);

//         const attendanceData = {
//           time: currentTime,
//           location: userLocation,
//           address: fetchedAddress,
//         };

//         if (attendanceDoc.exists()) {
//           // If the document exists, update the attendance array with the new record
//           await updateDoc(attendanceRef, {
//             attendance: arrayUnion(attendanceData),
//           });
//         } else {
//           // If the document doesn't exist, create a new one with the first attendance record
//           await setDoc(attendanceRef, {
//             attendance: [attendanceData],
//           });
//         }
//       } catch (error) {
//         setMessage('Error marking attendance. Please try again.');
//         setIsError(true);
//       }
//     } else {
//       setMessage('Attendance cannot be marked because you are outside the allowed range or missing employee ID.');
//       setIsError(true);
//     }
//   };

//   useEffect(() => {
//     getUserLocation();
//   }, []);

//   useEffect(() => {
//     checkLocation();
//   }, [userLocation]);

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Mark Attendance</Text>
//       {userLocation ? (
//         <>
//           <Text style={styles.locationText}>Your Location</Text>
//           <Text style={styles.locationText}>Latitude : {userLocation.latitude}</Text>
//           <Text style={styles.locationText}>Longitude : {userLocation.longitude}</Text>
//           <Text style={styles.locationText}>Address : {fetchedAddress || 'Fetching address...'}</Text>
//         </>
//       ) : (
//         <Text style={styles.message}>Fetching your location...</Text>
//       )}
     
//      <TouchableOpacity
//              style={[styles.button, !withinRange && styles.buttonDisabled]}
//              onPress={markAttendance}
//              disabled={!withinRange}
//            >
//              <Text style={styles.buttonText}>Submit Attendance</Text>
//            </TouchableOpacity>
//       <Text style={[styles.message, isError ? styles.errorMessage : null]}>{message}</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 20,
//     backgroundColor: 'antiquewhite', // Antique white background
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   locationText: {
//     fontSize: 16,
//     fontWeight:'bold',
//     marginBottom: 10, // Spacing between each location line
//   },
//   message: {
//     color: 'black',
//     fontWeight:'bold',
//     marginTop: 10,
//     fontSize: 20,
//     textAlign: 'center',
//   },
//   errorMessage: {
//     color: 'red',
//   },
//   button: {
//     width: '80%',
//     padding: 15,
//     backgroundColor: '#20B2AA', // Light Sea Green button color
//     borderRadius: 25, // Rounded corners for button
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 20,
//   },
//   buttonDisabled: {
//     backgroundColor: '#A9A9A9', // Disabled state color (gray)
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });


// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// import * as Location from 'expo-location';
// import { db } from '../services/firebaseAuth';
// import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
// import { fetchApprovedLeaveDates } from '../services/leaveServices'; // Import the leave service
// import { useEmployee } from '../context/EmployeeContext';
// import Icon from "react-native-vector-icons/FontAwesome";

// const GOOGLE_API_KEY = 'AIzaSyDgyc7bzv3S5K7MsU6NwGaiMTxlVJOxPVc'; // Replace with your Google Maps API Key

// // Haversine formula to calculate distance
// const haversineDistance = (coords1, coords2) => {
//   const toRad = (value) => (value * Math.PI) / 180;
//   const R = 6371; // Radius of the Earth in kilometers
//   const dLat = toRad(coords2.latitude - coords1.latitude);
//   const dLon = toRad(coords2.longitude - coords1.longitude);

//   const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//             Math.cos(toRad(coords1.latitude)) * Math.cos(toRad(coords2.latitude)) *
//             Math.sin(dLon / 2) * Math.sin(dLon / 2);

//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   return R * c * 1000; // Return distance in meters
// };

// export default function MarkAttendance({navigation}) {
//   const { employeeData } = useEmployee(); // Access employee data
//   const [userLocation, setUserLocation] = useState(null);
//   const [fetchedAddress, setFetchedAddress] = useState('');
//   const [withinRange, setWithinRange] = useState(false);
//   const [message, setMessage] = useState('');
//   const [isError, setIsError] = useState(false);
//   const [approvedLeaves, setApprovedLeaves] = useState([]);
//   const [isAllowed, setIsAllowed] = useState(true);

//   const currentDate = new Date().toISOString().split("T")[0]; // Format YYYY-MM-DD

//   useEffect(() => {
//     const fetchLeaves = async () => {
//       const leaves = await fetchApprovedLeaveDates(employeeData?.eid);
//       setApprovedLeaves(leaves);

//       // Check if today's date is among approved leave dates
//       setIsAllowed(!leaves.includes(currentDate));
//     };

//     if (employeeData?.eid) {
//       fetchLeaves();
//     }
//   }, [employeeData, currentDate]);

//   useEffect(() => {
//     navigation.setOptions({
//       headerStyle: {
//         backgroundColor: "#faebd7", // Background color to match the screen
//         shadowColor: "transparent", // Remove shadow from the header
//         elevation: 0, // Remove Android header elevation
//       },
//       headerTintColor: "#000", // Set icon and text color to dark
//       headerRight: () => (
//         <TouchableOpacity onPress={handleLogout} style={styles.logoutIcon}>
//           <Icon name="sign-out" size={24} color="#000" />
//         </TouchableOpacity>
//       ),
//       headerLeft: () => null, // Remove the back arrow
//       headerShown: true, // Show header for logout icon
//       title: "", // Remove title
//     });
//   }, [navigation]);

//   const handleLogout = async () => {
//     try {
//       console.log("User logged out");
//       navigation.navigate("HomeScreen");
//     } catch (error) {
//       console.error("Logout Error:", error);
//     }
//   };

//   // Define company location (adjust with your actual coordinates)
//   const companyLocation = {
//     latitude: 9.1628746, // Replace with your company's latitude
//     longitude: 77.8684, // Replace with your company's longitude
//   };

//   const getUserLocation = async () => {
//     let { status } = await Location.requestForegroundPermissionsAsync();
//     if (status !== 'granted') {
//       setMessage('Permission to access location was denied');
//       return;
//     }

//     let location = await Location.getCurrentPositionAsync({});
//     setUserLocation(location.coords);

//     // Fetch the address after getting the location
//     const address = await fetchAddress(location.coords.latitude, location.coords.longitude);
//     setFetchedAddress(address);
//   };

//   const checkLocation = () => {
//     if (userLocation) {
//       const distance = haversineDistance(userLocation, companyLocation);
//       if (distance <= 100) { // Update the threshold to 100 meters
//         setWithinRange(true);
//         setMessage('');
//         setIsError(false);
//       } else {
//         setWithinRange(false);
//         setMessage('You are outside the allowed range. Attendance cannot be marked.');
//         setIsError(true);
//       }
//     }
//   };

//   const fetchAddress = async (latitude, longitude) => {
//     try {
//       const response = await fetch(
//         `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`
//       );
//       const data = await response.json();
//       if (data.status === 'OK') {
//         return data.results[0]?.formatted_address || 'Address not found';
//       } else {
//         return 'Address not found';
//       }
//     } catch (error) {
//       console.error('Error fetching address:', error);
//       return 'Address not found';
//     }
//   };

//   const markAttendance = async () => {
//     if (isAllowed && withinRange && employeeData?.eid) {
//       const currentTime = new Date().toLocaleString();
//       setMessage('Attendance marked successfully at ' + currentTime + '!');
//       setIsError(false);

//       try {
//         // Reference to the employee's attendance document in the "onsiteAttendance" collection
//         const attendanceRef = doc(db, 'offsiteAttendance', employeeData.eid);

//         // Get the attendance document to check if it exists
//         const attendanceDoc = await getDoc(attendanceRef);

//         const attendanceData = {
//           time: currentTime,
//           location: userLocation,
//           address: fetchedAddress,
//         };

//         if (attendanceDoc.exists()) {
//           // If the document exists, update the attendance array with the new record
//           await updateDoc(attendanceRef, {
//             attendance: arrayUnion(attendanceData),
//           });
//         } else {
//           // If the document doesn't exist, create a new one with the first attendance record
//           await setDoc(attendanceRef, {
//             attendance: [attendanceData],
//           });
//         }
//       } catch (error) {
//         setMessage('Error marking attendance. Please try again.');
//         setIsError(true);
//       }
//     } else {
//       setMessage('Attendance cannot be marked because you are outside the allowed range, on leave, or missing employee ID.');
//       setIsError(true);
//     }
//   };

//   useEffect(() => {
//     getUserLocation();
//   }, []);

//   useEffect(() => {
//     checkLocation();
//   }, [userLocation]);

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Mark Attendance</Text>
//       {!isAllowed && (
//         <Text style={styles.errorMessage}>Attendance marking is disabled as your leave is approved for today.</Text>
//       )}
//       {userLocation ? (
//         <>
//           <Text style={styles.locationText}>Your Location</Text>
//           <Text style={styles.locationText}>Latitude : {userLocation.latitude}</Text>
//           <Text style={styles.locationText}>Longitude : {userLocation.longitude}</Text>
//           <Text style={styles.locationText}>Address : {fetchedAddress || 'Fetching address...'}</Text>
//         </>
//       ) : (
//         <Text style={styles.message}>Fetching your location...</Text>
//       )}
     
//       <TouchableOpacity
//         style={[styles.button, !withinRange || !isAllowed && styles.buttonDisabled]}
//         onPress={markAttendance}
//         disabled={!withinRange || !isAllowed}
//       >
//         <Text style={styles.buttonText}>Submit Attendance</Text>
//       </TouchableOpacity>
//       <Text style={[styles.message, isError ? styles.errorMessage : null]}>{message}</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 20,
//     backgroundColor: 'antiquewhite',
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   locationText: {
//     fontSize: 16,
//     fontWeight:'bold',
//     marginBottom: 10,
//   },
//   message: {
//     color: 'black',
//     fontWeight:'bold',
//     marginTop: 10,
//     fontSize: 20,
//     textAlign: 'center',
//   },
//   errorMessage: {
//     color: 'red',
//   },
//   button: {
//     width: '80%',
//     padding: 15,
//     backgroundColor: '#20B2AA',
//     borderRadius: 25,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 20,
//   },
//   buttonDisabled: {
//     backgroundColor: '#A9A9A9',
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });



import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import { db } from '../services/firebaseAuth';
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { useEmployee } from '../context/EmployeeContext';
import Icon from "react-native-vector-icons/FontAwesome";

export default function MarkAttendance({ navigation }) {
  const { employeeData } = useEmployee();
  const [userLocation, setUserLocation] = useState(null);
  const [fetchedAddress, setFetchedAddress] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: "#faebd7",
        shadowColor: "transparent",
        elevation: 0,
      },
      headerTintColor: "#000",
      headerRight: () => (
        <TouchableOpacity onPress={handleLogout} style={styles.logoutIcon}>
          <Icon name="sign-out" size={24} color="#000" />
        </TouchableOpacity>
      ),
      headerLeft: () => null,
      headerShown: true,
      title: "",
    });
  }, [navigation]);

  const handleLogout = () => {
    console.log("User logged out");
    navigation.navigate("HomeScreen");
  };

  const getUserLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setMessage('Permission to access location was denied');
      setIsError(true);
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setUserLocation(location.coords);
    const address = await fetchAddress(location.coords.latitude, location.coords.longitude);
    setFetchedAddress(address);
  };

  const fetchAddress = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=YOUR_GOOGLE_API_KEY`
      );
      const data = await response.json();
      return data.status === 'OK' ? data.results[0]?.formatted_address || 'Address not found' : 'Address not found';
    } catch (error) {
      console.error('Error fetching address:', error);
      return 'Address not found';
    }
  };

  const markAttendance = async () => {
    if (employeeData?.eid && userLocation) {
      const currentTime = new Date().toLocaleString();
      setMessage('Attendance marked successfully at ' + currentTime + '!');
      setIsError(false);

      try {
        const attendanceRef = doc(db, 'offsiteAttendance', employeeData.eid);
        const attendanceDoc = await getDoc(attendanceRef);

        const attendanceData = {
          time: currentTime,
          location: userLocation,
          address: fetchedAddress,
        };

        if (attendanceDoc.exists()) {
          await updateDoc(attendanceRef, {
            attendance: arrayUnion(attendanceData),
          });
        } else {
          await setDoc(attendanceRef, {
            attendance: [attendanceData],
          });
        }
      } catch (error) {
        setMessage('Error marking attendance. Please try again.');
        setIsError(true);
      }
    } else {
      setMessage('Location not fetched or employee ID missing.');
      setIsError(true);
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mark Attendance</Text>
      {userLocation ? (
        <>
          <Text style={styles.locationText}>Latitude: {userLocation.latitude}</Text>
          <Text style={styles.locationText}>Longitude: {userLocation.longitude}</Text>
          <Text style={styles.locationText}>Address: {fetchedAddress || 'Fetching address...'}</Text>
        </>
      ) : (
        <Text style={styles.message}>Fetching your location...</Text>
      )}

      <TouchableOpacity style={styles.button} onPress={markAttendance}>
        <Text style={styles.buttonText}>Submit Attendance</Text>
      </TouchableOpacity>
      <Text style={[styles.message, isError ? styles.errorMessage : null]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'antiquewhite',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  locationText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    color: 'black',
    fontWeight: 'bold',
    marginTop: 10,
    fontSize: 20,
    textAlign: 'center',
  },
  errorMessage: {
    color: 'red',
  },
  button: {
    width: '80%',
    padding: 15,
    backgroundColor: '#20B2AA',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
