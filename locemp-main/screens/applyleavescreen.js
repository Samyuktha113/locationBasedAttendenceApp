import React, { useState,useEffect } from 'react';
import { View, Text, StyleSheet,TouchableOpacity ,TextInput, Button, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from "react-native-vector-icons/FontAwesome"; 
import { Picker } from '@react-native-picker/picker';
import { setDoc, doc, arrayUnion } from 'firebase/firestore';
import { useEmployee } from '../context/EmployeeContext'; // Ensure this is the correct path
import { db } from '../services/firebaseAuth'; // Ensure this imports your Firestore configuration

export default function ApplyLeave({navigation}) {
  const { employeeData } = useEmployee(); // Access employee data from context
  const [leaveType, setLeaveType] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [reason, setReason] = useState('');
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


  const eid = employeeData?.eid; // Employee ID from context

  const onStartDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowStartDatePicker(false);
    setStartDate(currentDate);
  };

  const onEndDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setShowEndDatePicker(false);
    setEndDate(currentDate);
  };

  const submitLeaveRequest = async () => {
    if (!eid) {
      Alert.alert('Error', 'Employee ID is missing. Please log in again or contact support.');
      return;
    }
  
    if (!leaveType || !reason) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }
  
    const currentDate = new Date();
  
    let enhancedLeaveType = leaveType; // Default for normal leave
  
    // Check if the leave request is for a previous leave
    if (endDate < currentDate) {
      const diffTime = currentDate - endDate;
      const diffDays = diffTime / (1000 * 3600 * 24);
  
      if (diffDays > 15) {
        Alert.alert(
          'Error',
          'You can only apply for a previous leave within 15 days from the last date of the leave period.'
        );
        return;
      }
  
      // Append "lately applied" to leave type for previous leaves
      enhancedLeaveType = `${leaveType}-lately applied`;
  
      // Alert for previous leave
      Alert.alert(
        'Previous Leave Submitted',
        `Leave Type: ${enhancedLeaveType}\nFrom: ${startDate.toLocaleDateString()}\nTo: ${endDate.toLocaleDateString()}\nReason: ${reason}\nStatus: Pending`
      );
    } else {
      // Alert for normal leave
      Alert.alert(
        'Leave Request Submitted',
        `Leave Type: ${leaveType}\nFrom: ${startDate.toLocaleDateString()}\nTo: ${endDate.toLocaleDateString()}\nReason: ${reason}\nStatus: Pending`
      );
    }
  
    const leaveData = {
      leaveType: enhancedLeaveType,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      reason,
      status: endDate < currentDate ? 'Pending' : 'Pending',
      appliedAt: new Date().toISOString(),
    };
  
    try {
      // Add leave data as an array element in Firestore document
      await setDoc(
        doc(db, 'leaveRequests', eid),
        {
          empid: eid, // Add empid as a field
          leaves: arrayUnion(leaveData), // Store leaves in an array
        },
        { merge: true } // Merge with existing data if the document already exists
      );
  
      // Reset form fields
      setLeaveType('');
      setReason('');
    } catch (error) {
      Alert.alert('Error', `Failed to submit leave request: ${error.message}`);
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Apply for Leave</Text>

      <Text style={styles.label}>Employee ID:</Text>
      <TextInput
        style={styles.textInput}
        value={eid}
        editable={false} // Make eid non-editable
      />

      <Text style={styles.label}>Leave Type:</Text>
      <Picker
        selectedValue={leaveType}
        style={styles.picker}
        onValueChange={(itemValue) => setLeaveType(itemValue)}
      >
        <Picker.Item label="Select Leave Type" value=""  />
        <Picker.Item label="Sick Leave" value="sick" />
        <Picker.Item label="Vacation Leave" value="vacation" />
        <Picker.Item label="Casual Leave" value="casual" />
      </Picker>

      <Text style={styles.label}>Start Date:</Text>
      <Button title={startDate.toLocaleDateString()} onPress={() => setShowStartDatePicker(true)}  color="lightseagreen"/>
      {showStartDatePicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={onStartDateChange}
        />
      )}

      <Text style={styles.label}>End Date:</Text>
      <Button title={endDate.toLocaleDateString()} onPress={() => setShowEndDatePicker(true)} color="lightseagreen" borderRadius = "20" />
      {showEndDatePicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display="default"
          onChange={onEndDateChange}
        />
      )}

      <Text style={styles.label}>Reason:</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Enter reason for leave"
        value={reason}
        onChangeText={setReason}
      />

      <Button title="Submit" onPress={submitLeaveRequest} color="lightseagreen" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'antiquewhite',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginVertical: 10,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
});

