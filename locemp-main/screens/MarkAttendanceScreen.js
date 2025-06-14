

// import React, { useState } from 'react';
// import { View, Text, Button, Image, StyleSheet, Alert, ActivityIndicator } from 'react-native';
// import { launchImageLibrary } from 'react-native-image-picker'; // Updated import for image picker
// import Exif from 'react-native-exif';  // For extracting EXIF data

// export default function MarkAttendanceScreen({ navigation }) {
//   const [image, setImage] = useState(null);
//   const [photoLocation, setPhotoLocation] = useState(null);
//   const [withinRange, setWithinRange] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [locationError, setLocationError] = useState(null);

//   // Office location coordinates (update with your actual office coordinates)
//   const officeLocation = {
//     latitude: 37.4220936,  // Replace with your office latitude
//     longitude: -122.083922,  // Replace with your office longitude
//   };

//   // Function to pick an image from the gallery
//   const pickImage = async () => {
//     const options = {
//       mediaType: 'photo',
//       includeBase64: false,
//     };
//     launchImageLibrary(options, (response) => {
//       if (response.didCancel) {
//         console.log('User cancelled image picker');
//       } else if (response.error) {
//         console.log('ImagePicker Error: ', response.error);
//       } else {
//         setImage(response.assets[0].uri);
//         extractLocationFromImage(response.assets[0].uri);
//       }
//     });
//   };

//   // Extract location from EXIF data using react-native-exif
//   const extractLocationFromImage = (imageUri) => {
//     setLoading(true);
//     Exif.getExif(imageUri.replace('file://', '')).then((metadata) => {
//       if (metadata.GPSLatitude && metadata.GPSLongitude) {
//         const photoLocation = {
//           latitude: metadata.GPSLatitude,
//           longitude: metadata.GPSLongitude,
//         };
//         setPhotoLocation(photoLocation);

//         const distance = geolib.getDistance(photoLocation, officeLocation);

//         if (distance <= 1000) {  // within 1km range
//           setWithinRange(true);
//           Alert.alert('Success', 'You are within the allowed range.');
//         } else {
//           setWithinRange(false);
//           Alert.alert('Warning', 'You are outside the allowed range.');
//         }
//       } else {
//         setLocationError('No GPS location found in this photo. Please ensure the photo is geotagged.');
//         Alert.alert('Error', 'No geotagged location found in the photo.');
//       }
//     }).catch((error) => {
//       console.log('Error extracting EXIF: ', error);
//       setLocationError('Unable to extract location from photo. Please try again.');
//       Alert.alert('Error', 'Failed to extract location. Ensure the photo has GPS data.');
//     }).finally(() => {
//       setLoading(false);
//     });
//   };

//   const submitAttendance = () => {
//     if (!image) {
//       Alert.alert('Error', 'Please upload a geotagged photo first.');
//       return;
//     }

//     if (withinRange) {
//       Alert.alert('Success', 'Attendance marked successfully!');
//       navigation.goBack();
//     } else {
//       Alert.alert('Error', 'You are not within the office location range.');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Mark Attendance</Text>

//       <Button title="Upload Geotagged Photo" onPress={pickImage} />

//       {loading && <ActivityIndicator size="large" color="#0000ff" />}

//       {image && (
//         <Image source={{ uri: image }} style={styles.image} />
//       )}

//       <Button
//         title="Submit Attendance"
//         onPress={submitAttendance}
//         disabled={!image || !withinRange || loading}
//       />

//       {!withinRange && image && (
//         <Text style={styles.warning}>You are not within 1km of the office.</Text>
//       )}

//       {locationError && (
//         <Text style={styles.error}>{locationError}</Text>
//       )}
//     </View>
//   );
// }

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
//   image: {
//     width: 300,
//     height: 300,
//     marginTop: 20,
//     marginBottom: 20,
//   },
//   warning: {
//     color: 'red',
//     marginTop: 20,
//   },
//   error: {
//     color: 'red',
//     marginTop: 10,
//   },
// });

// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, Button } from 'react-native';
// import * as Location from 'expo-location';

// // Haversine formula to calculate distance between two points
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
//   const [userLocation, setUserLocation] = useState(null); // Stores user's current location
//   const [withinRange, setWithinRange] = useState(false); // Determines if user is within 1km range of company
//   const [attendanceMarked, setAttendanceMarked] = useState(false); // Track if attendance has been marked
//   const [message, setMessage] = useState(''); // Message to display feedback to user
//   const [isError, setIsError] = useState(false); // Track if there's an error message

//   // Define your company location (latitude and longitude)
//   const companyLocation = {
//     latitude: 37.4220936, // Replace with your company latitude
//     longitude: -122.083922, // Replace with your company longitude
//   };

//   // Function to get user's current location
//   const getUserLocation = async () => {
//     let { status } = await Location.requestForegroundPermissionsAsync();
//     if (status !== 'granted') {
//       setMessage('Permission to access location was denied');
//       return;
//     }

//     let location = await Location.getCurrentPositionAsync({});
//     setUserLocation(location.coords);
//   };

//   // Function to check if the user is within range
//   const checkLocation = () => { 
//     if (userLocation) {
//       const distance = haversineDistance(userLocation, companyLocation);
//       if (distance <= 1000) {
//         setWithinRange(true); // User is within range
//         setMessage(''); // Clear any previous messages
//         setIsError(false); // No error
//       } else {
//         setWithinRange(false); // User is outside range
//         setMessage('You are outside the allowed range. Attendance cannot be marked.'); // Set error message
//         setAttendanceMarked(false); // Reset attendance state if out of range
//         setIsError(true); // Set error state
//       }
//     }
//   };

//   // Function to mark attendance
//   const markAttendance = () => {
//     if (withinRange) {
//       setAttendanceMarked(true); // Set attendance marked to true
//       const currentTime = new Date().toLocaleString(); // Get current time
//       setMessage('Attendance marked successfully at ' + currentTime + '!'); // Set success message using concatenation
//       setIsError(false); // No error

//       // Here, you can add the logic to store the attendance time in the database
//       // For example:
//       // await storeAttendanceInDatabase({ time: currentTime, location: userLocation });
//     } else {
//       setMessage('Attendance cannot be marked because you are outside the allowed range.');
//       setIsError(true); // Set error state
//     }
//   };

//   // Fetch user's location and check range when the component is mounted
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
//         <Text>
//           Your Location: Lat: {userLocation.latitude}, Lon: {userLocation.longitude}
//         </Text>
//       ) : (
//         <Text>Fetching your location...</Text>
//       )}

//       <Button
//         title={attendanceMarked ? "Attendance Marked!" : "Submit Attendance"}
//         onPress={markAttendance}
//         disabled={!withinRange} // Disable button if outside range
//         color={attendanceMarked ? "green" : (withinRange ? "blue" : "gray")} // Change button color based on attendance status

// import React from 'react';
// import { View, Text, Button, StyleSheet } from 'react-native';

// export default function MarkAttendanceScreen({ navigation }) {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Mark Attendance</Text>

//       <Button 
//         title="Onsite Attendance" 
//         onPress={() => navigation.navigate('OnsiteMarkAttendance')} 
//       />
//       <Button 
//         title="Offsite Attendance" 
//         onPress={() => navigation.navigate('OffsiteMarkAttendance')} 
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
//     color: 'black', // Default message color
//     marginTop: 10,
//   },

//   errorMessage: {
//     color: 'red', // Error message color
//   },

// });


import React, { useEffect } from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome";

export default function MarkAttendanceScreen({ navigation }) {
  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: "#faebd7", // Background color to match the screen
        shadowColor: "transparent", // Remove shadow from the header
        elevation: 0, // Remove Android header elevation
      },
      headerTintColor: "#000", // Set icon and text color to dark
      headerRight: () => (
        <TouchableOpacity onPress={handleLogout} style={styles.logoutIcon}>
          <Icon name="sign-out" size={24} color="#000" />
        </TouchableOpacity>
      ),
      headerLeft: () => null, // Remove the back arrow
      headerShown: true, // Show header for logout icon
      title: "", // Remove title
    });
  }, [navigation]);

  const handleLogout = async () => {
    try {
      console.log("User logged out");
      navigation.navigate("HomeScreen");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mark Attendance</Text>

      <Button 
        title="Onsite Attendance" 
        onPress={() => navigation.navigate('OnsiteMarkAttendance')} 
        color="lightseagreen"
        style={styles.button} // Light Shagreen color for the button
      />
      
      <View style={styles.spacing} />

      <Button 
        title="Offsite Attendance" 
        onPress={() => navigation.navigate('OffsiteMarkAttendance')} 
        color="lightseagreen"
        style={styles.button} // Light Shagreen color for the button
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#faebd7", // Antique white background color
  },
  title: {
    fontSize: 24,
    marginBottom: 30,
    fontWeight: 'bold',
    color: '#000', // Black color for title text
  },
  spacing: {
    marginVertical: 15, // Add spacing between buttons
  },
  button: {
    width: '80%', // Adjust width for spaciousness
    padding: 15,
    backgroundColor: 'lightseagreen', // Light Shagreen button color
    borderRadius: 10, // Apply border radius
    marginBottom: 20, // Space between buttons
  },
  logoutIcon: {
    marginRight: 10,
  }
});
