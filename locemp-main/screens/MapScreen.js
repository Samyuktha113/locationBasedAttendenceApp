
// import React, {useEffect, useState} from 'react';
// import MapView, {Marker} from 'react-native-maps';
// import { StyleSheet, View, Dimensions,TouchableOpacity, Button } from 'react-native';
// import * as Location from 'expo-location';
// import Icon from "react-native-vector-icons/FontAwesome"; 

// export default function MapScreen({navigation}) {
//   const [mapRegion, setMapRegion] = useState({
//     latitude: 13.0067,
//     longitude: 80.2423,
//     latitudeDelta: 0.0922,
//     longitudeDelta: 0.0421,
//   });


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

//   const [errorMsg, setErrorMsg] = useState(null);
//   const userLocation = async () => {
//     let {status} = await Location.requestForegroundPermissionsAsync();
//     if (status !== 'granted') {
//       setErrorMsg('Permission denied');
//       return;
//     }
//     let location = await Location.getCurrentPositionAsync({enableHighAccuracy: true});
//     setMapRegion({
//       latitude: location.coords.latitude,
//       longitude: location.coords.longitude,
//       latitudeDelta: 0.0922,
//       longitudeDelta: 0.0421,
//     });
//     console.log(location.coords.latitude, location.coords.longitude);
//   }

//   useEffect(() => {
//     userLocation();
//   }, [])
//   return (
//     <View style={styles.container}>
//       <MapView
//         style={styles.map}
//         region={mapRegion}
//       >
//         {/* Marker should be inside MapView */}
//         <Marker
//            coordinate={mapRegion}
//            title="User Location"
//            description={`Lat: ${mapRegion.latitude}, Lon: ${mapRegion.longitude}`}
//         />
//       </MapView>
//       <Button title='Get Location' onPress={userLocation} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   map: {
//     width: Dimensions.get('window').width,
//     height: Dimensions.get('window').height,
//   },
// }); 



