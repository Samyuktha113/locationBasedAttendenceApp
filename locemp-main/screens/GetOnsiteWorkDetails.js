

import React, { useState, useEffect } from 'react';
import {
  View,
  Button,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebaseAuth'; // Adjust the path as needed
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

import Icon from "react-native-vector-icons/FontAwesome"; 

import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'; // Import for Google Places Autocomplete


const GetOnsiteWorkDetails = () => {
  const [eid, setEid] = useState('');
  const [employeeIds, setEmployeeIds] = useState([]);
  const [location, setLocation] = useState('');
  const [details, setDetails] = useState('');
  const [date, setDate] = useState(new Date());
  const [reportingTime, setReportingTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingEmployees, setFetchingEmployees] = useState(true);

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

  const navigation = useNavigation(); // Initialize the navigation hook

  useEffect(() => {
    // Fetch employee IDs from Firestore when the component mounts
    const fetchEmployeeIds = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'employees'));
        const ids = querySnapshot.docs.map(doc => doc.id);
        setEmployeeIds(ids);
      } catch (error) {
        console.error('Error fetching employee IDs:', error);
        Alert.alert('Error', 'Failed to load employee IDs.');
      } finally {
        setFetchingEmployees(false);
      }
    };

    fetchEmployeeIds();
  }, []);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const handleTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || reportingTime;
    setShowTimePicker(false);
    setReportingTime(currentTime);
  };

  const handleSubmit = async () => {
    if (!eid || !location || !details) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const onsiteWorkRef = doc(db, 'onsitework', eid);
      const onsiteWorkDoc = await getDoc(onsiteWorkRef);

      let existingWorkDetails = onsiteWorkDoc.exists() ? onsiteWorkDoc.data().workDetails : [];

      existingWorkDetails.push({
        location,
        details,
        date: date.toISOString().split('T')[0],
        reportingTime: reportingTime.toISOString(),
        status: "pending", // Default status is "Pending"
      });

      await setDoc(onsiteWorkRef, {
        workDetails: existingWorkDetails,
      });

      Alert.alert('Success', 'Onsite work details submitted successfully.');
      setEid('');
      setLocation('');
      setDetails('');
      setDate(new Date());
      setReportingTime(new Date());
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to submit details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewAssignedTask = () => {
    navigation.navigate('ViewAssignedTask');
  };

  return (
    <View style={styles.container}>
      {fetchingEmployees ? (
        <ActivityIndicator size="large" color="#4CAF50" />
      ) : (
        <Picker
          selectedValue={eid}
          onValueChange={(itemValue) => setEid(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select Employee ID" value="" />
          {employeeIds.map((id) => (
            <Picker.Item key={id} label={id} value={id} />
          ))}
        </Picker>
      )}

      {/* Google Places Autocomplete for Location */}
      <GooglePlacesAutocomplete
        placeholder="Search Location"
        minLength={2}
        autoFocus={false}
        returnKeyType={'search'}
        fetchDetails={true}
        onPress={(data, details = null) => {
          console.log(data, details); // Debugging: Logs the place details
          setLocation(details?.formatted_address || data.description); // Updates `location` with the selected address
        }}
        query={{
          key: 'AIzaSyDgyc7bzv3S5K7MsU6NwGaiMTxlVJOxPVc', // Replace with your Google Places API key
          language: 'en',
        }}
        styles={{
          textInput: styles.input,
          predefinedPlacesDescription: {
            color: '#1faadb',
          },
        }}
        enablePoweredByContainer={false} // Optional: Hides "Powered by Google" label
      />

      <TextInput
        placeholder="Details"
        value={details}
        onChangeText={setDetails}
        style={styles.input}
      />

      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
        <Text style={styles.placeholderText}>{date.toISOString().split('T')[0]}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.input}>
        <Text style={styles.placeholderText}>{reportingTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
      </TouchableOpacity>
      {showTimePicker && (
        <DateTimePicker
          value={reportingTime}
          mode="time"
          display="default"
          onChange={handleTimeChange}
        />
      )}

      <Button title={loading ? "Submitting..." : "Submit"} onPress={handleSubmit} disabled={loading} color="lightseagreen" />

      <TouchableOpacity onPress={handleViewAssignedTask} style={styles.viewTaskButton}>
        <Text style={styles.viewTaskButtonText}>View Assigned Task</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor:'antiquewhite',
  },
  picker: {
    height: 50,
    marginBottom: 12,
    backgroundColor: '#ffebcd',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    justifyContent: 'center',
    backgroundColor:'white',
  },
  placeholderText: {
    color: 'gray',
  },
  viewTaskButton: {
    marginTop: 20,
    backgroundColor: 'lightseagreen',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  viewTaskButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default GetOnsiteWorkDetails;
