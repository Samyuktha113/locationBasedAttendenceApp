// // import React, { useEffect, useState } from 'react';
// // import { View, StyleSheet, Text } from 'react-native';
// // import MapView, { Marker } from 'react-native-maps';
// // import { db } from '../services/firebaseAuth'; // Import your Firebase configuration
// // import { collection, onSnapshot } from 'firebase/firestore';

// // export default function AdminMap() {
// //   const [employeeLocations, setEmployeeLocations] = useState([]);
// //   const [region, setRegion] = useState({
// //     latitude: 37.4220936, // Default coordinates (update to initial center)
// //     longitude: -122.083922,
// //     latitudeDelta: 0.1,
// //     longitudeDelta: 0.1,
// //   });

// //   // Fetch employee locations from Firestore in real-time
// //   useEffect(() => {
// //     const unsubscribe = onSnapshot(collection(db, 'locations'), (snapshot) => {
// //       const locations = snapshot.docs.map((doc) => ({
// //         id: doc.id,
// //         ...doc.data(),
// //       }));

// //       // Update employee locations
// //       setEmployeeLocations(locations);

// //       // Set map center to the first employee's location (or center of all locations)
// //       if (locations.length > 0) {
// //         const firstLocation = locations[0];
// //         setRegion({
// //           latitude: firstLocation.latitude,
// //           longitude: firstLocation.longitude,
// //           latitudeDelta: 0.1,
// //           longitudeDelta: 0.1,
// //         });
// //       }
// //     });

// //     return () => unsubscribe(); // Cleanup listener on component unmount
// //   }, []);

// //   return (
// //     <View style={styles.container}>
// //       <MapView
// //         style={styles.map}
// //         region={region} // Dynamically update map center
// //         onRegionChangeComplete={(newRegion) => setRegion(newRegion)} // Allow region change by user
// //       >
// //         {employeeLocations.map((location) => (
// //           <Marker
// //             key={location.id}
// //             coordinate={{
// //               latitude: location.latitude,
// //               longitude: location.longitude,
// //             }}
// //             title={`Employee ID: ${location.eid}`}
// //             description={`Last updated: ${new Date(location.timestamp).toLocaleString()}`}
// //           />
// //         ))}
// //       </MapView>
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //   },
// //   map: {
// //     flex: 1,
// //   },
// // });


// // import React, { useEffect, useState } from 'react';
// // import { View, StyleSheet, Text, Alert } from 'react-native';
// // import MapView, { Marker, Circle } from 'react-native-maps';
// // import Geolocation from '@react-native-community/geolocation';
// // import { db } from '../services/firebaseAuth'; // Import Firebase configuration
// // import { doc, setDoc } from 'firebase/firestore'; // For adding or updating document

// // export default function AdminMap() {
// //   const [employeesLocation, setEmployeesLocation] = useState([]); // Store multiple employee locations
// //   const [siteLocation, setSiteLocation] = useState({
// //     latitude: 13.0133052, // Replace with your site latitude
// //     longitude: 80.2379202, // Replace with your site longitude
// //   });
// //   const radius = 100; // Radius in meters

// //   const employeeIds = ['nithi27', 'employee2', 'employee3']; // Example list of employee IDs

// //   // Haversine formula to calculate distance
// //   const calculateDistance = (lat1, lon1, lat2, lon2) => {
// //     const R = 6371e3; // Radius of Earth in meters
// //     const toRad = (value) => (value * Math.PI) / 180;
// //     const dLat = toRad(lat2 - lat1);
// //     const dLon = toRad(lon2 - lon1);

// //     const a =
// //       Math.sin(dLat / 2) * Math.sin(dLat / 2) +
// //       Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
// //     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

// //     return R * c; // Distance in meters
// //   };

// //   // Update the employee's location in Firestore
// //   const updateEmployeeLocation = async (employeeId, latitude, longitude) => {
// //     try {
// //       const employeeLocationRef = doc(db, 'employee_locations', employeeId);
// //       await setDoc(employeeLocationRef, {
// //         latitude,
// //         longitude,
// //         accuracy: 100, // Add accuracy if available
// //         timestamp: new Date().toISOString(),
// //       });
// //       console.log(`Updated location for Employee ID: ${employeeId}`);
// //     } catch (error) {
// //       console.error('Error updating employee location:', error);
// //     }
// //   };

// //   // Watch the positions of multiple employees
// //   useEffect(() => {
// //     const watchPositions = employeeIds.map((employeeId) => {
// //       return Geolocation.watchPosition(
// //         (position) => {
// //           const { latitude, longitude } = position.coords;
// //           setEmployeesLocation((prevLocations) => [
// //             ...prevLocations.filter((emp) => emp.id !== employeeId),
// //             { id: employeeId, latitude, longitude },
// //           ]);

// //           updateEmployeeLocation(employeeId, latitude, longitude);

// //           const distance = calculateDistance(
// //             siteLocation.latitude,
// //             siteLocation.longitude,
// //             latitude,
// //             longitude
// //           );
// //           console.log(`Employee ${employeeId} Distance from Site: ${distance.toFixed(2)} meters`);
// //         },
// //         (error) => {
// //           console.error('Error getting location:', error);
// //           Alert.alert('Error', 'Could not retrieve location.');
// //         },
// //         { enableHighAccuracy: true, distanceFilter: 10, interval: 1000 }
// //       );
// //     });

// //     // Clean up the watch on component unmount
// //     return () => {
// //       watchPositions.forEach((watchId) => Geolocation.clearWatch(watchId));
// //     };
// //   }, [siteLocation, employeeIds]);

// //   return (
// //     <View style={styles.container}>
// //       <MapView
// //         style={styles.map}
// //         initialRegion={{
// //           latitude: siteLocation.latitude,
// //           longitude: siteLocation.longitude,
// //           latitudeDelta: 0.01,
// //           longitudeDelta: 0.01,
// //         }}
// //       >
// //         {/* Site Location Marker */}
// //         <Marker
// //           coordinate={siteLocation}
// //           title="Site Location"
// //           description="Center of operation"
// //         />
// //         <Circle
// //           center={siteLocation}
// //           radius={radius}
// //           strokeColor="rgba(0, 122, 255, 0.5)"
// //           fillColor="rgba(0, 122, 255, 0.2)"
// //         />
// //         {/* Employee Location Markers */}
// //         {employeesLocation.map((employee) => (
// //           <Marker
// //             key={employee.id}
// //             coordinate={{
// //               latitude: employee.latitude,
// //               longitude: employee.longitude,
// //             }}
// //             title={`Employee ID: ${employee.id}`}
// //             description={`Distance from site: ${calculateDistance(
// //               siteLocation.latitude,
// //               siteLocation.longitude,
// //               employee.latitude,
// //               employee.longitude
// //             ).toFixed(2)} meters`}
// //             pinColor="blue"
// //           />
// //         ))}
// //       </MapView>

// //       {employeesLocation.length > 0 ? (
// //         <Text style={styles.infoText}>Tracking multiple employees...</Text>
// //       ) : (
// //         <Text style={styles.infoText}>Waiting for location updates...</Text>
// //       )}
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //   },
// //   map: {
// //     flex: 1,
// //   },
// //   infoText: {
// //     textAlign: 'center',
// //     marginVertical: 10,
// //     fontSize: 16,
// //     fontWeight: 'bold',
// //   },
// // });


// import React, { useEffect, useState } from 'react';
// import { View, StyleSheet, Text, Alert ,TouchableOpacity} from 'react-native';
// import MapView, { Marker, Circle } from 'react-native-maps';
// import * as Location from 'expo-location';
// import Icon from "react-native-vector-icons/FontAwesome";  // Import Firestore functions


// export default function AdminMap({navigation}) {
//   const [employeesLocation, setEmployeesLocation] = useState([]);
//   const [siteLocation, setSiteLocation] = useState({
//     latitude: 13.0133052,
//     longitude: 80.2379202,
//   });
//   const radius = 100;

//   const employeeIds = ['nithi27', 'employee2', 'employee3'];

//   const calculateDistance = (lat1, lon1, lat2, lon2) => {
//     const R = 6371e3; // Earth's radius in meters
//     const toRad = (value) => (value * Math.PI) / 180;
//     const dLat = toRad(lat2 - lat1);
//     const dLon = toRad(lon2 - lon1);

//     const a =
//       Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//       Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

//     return R * c; // Distance in meters
//   };
//   useEffect(() => {
//           navigation.setOptions({
//             headerStyle: {
//               backgroundColor: "#faebd7", // Background color to match the screen
//               shadowColor: "transparent", // Remove shadow from the header
//               elevation: 0, // Remove Android header elevation
//             },
//             headerTintColor: "#000", // Set icon and text color to dark
//             headerRight: () => (
//               <TouchableOpacity onPress={handleLogout} style={styles.logoutIcon}>
//                 <Icon name="sign-out" size={24} color="#000" />
//               </TouchableOpacity>
//             ),
//             headerLeft: () => null, // Remove the back arrow
//             headerShown: true, // Show header for logout icon
           
//             title: "", // Remove title
//           });
//         }, [navigation]);
      
//         const handleLogout = async () => {
//           try {
//             console.log("User logged out");
//             navigation.navigate("HomeScreen");
//           } catch (error) {
//             console.error("Logout Error:", error);
//           }
//         };

//   useEffect(() => {
//     const watchPositions = async () => {
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') {
//         Alert.alert('Permission Denied', 'Location permission is required.');
//         return;
//       }

//       employeeIds.forEach(async (employeeId) => {
//         await Location.watchPositionAsync(
//           {
//             accuracy: Location.Accuracy.High,
//             distanceInterval: 10,
//           },
//           (location) => {
//             const { latitude, longitude } = location.coords;

//             setEmployeesLocation((prevLocations) => {
//               const updatedLocations = prevLocations.filter((emp) => emp.id !== employeeId);
//               return [...updatedLocations, { id: employeeId, latitude, longitude }];
//             });

//             const distance = calculateDistance(
//               siteLocation.latitude,
//               siteLocation.longitude,
//               latitude,
//               longitude
//             );
//             console.log(`Employee ${employeeId} Distance from Site: ${distance.toFixed(2)} meters`);
//           }
//         );
//       });
//     };

//     watchPositions();
//   }, [employeeIds, siteLocation]);

//   return (
//     <View style={styles.container}>
//       <MapView
//         style={styles.map}
//         initialRegion={{
//           latitude: siteLocation.latitude,
//           longitude: siteLocation.longitude,
//           latitudeDelta: 0.01,
//           longitudeDelta: 0.01,
//         }}
//       >
//         {/* Site Location */}
//         <Marker coordinate={siteLocation} title="Site Location" />
//         <Circle center={siteLocation} radius={radius} strokeColor="blue" fillColor="rgba(0, 0, 255, 0.2)" />

//         {/* Employee Locations */}
//         {employeesLocation.map((employee) => (
//           <Marker
//             key={employee.id}
//             coordinate={{
//               latitude: employee.latitude,
//               longitude: employee.longitude,
//             }}
//             title={`Employee ID: ${employee.id}`}
//             pinColor="green" // Unique color for employees
//           />
//         ))}
//       </MapView>
//       <Text style={styles.infoText}>Tracking employees...</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   map: {
//     flex: 1,
//   },
//   infoText: {
//     textAlign: 'center',
//     marginVertical: 10,
//     fontSize: 16,
//     // fontWeight: 'bold',
//   },
// });

