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
