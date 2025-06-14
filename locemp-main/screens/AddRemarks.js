import React, { useEffect, useState } from "react";
import { Button, TextInput, Text, View, Alert, StyleSheet,TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker"; // Install if not already
import { doc, updateDoc, arrayUnion, getDoc, collection, getDocs } from "firebase/firestore";

import { db } from "../services/firebaseAuth"; // Firebase Firestore
import { useEmployee } from "../context/EmployeeContext";
import Icon from "react-native-vector-icons/FontAwesome";  // Employee Context for manager details


//import {  getDoc, updateDoc, arrayUnion, setDoc } from "firebase/firestore";


const ManagerRemarksScreen = ({navigation}) => {

// const ManagerRemarksScreen = () => {

  const { employeeData } = useEmployee(); // Access manager's data from context

  const managerId = employeeData?.eid; // Manager ID from context
  const managerName = `${employeeData?.firstName} ${employeeData?.lastName}`; // Manager's full name from context

  const [eid, setEid] = useState(""); // Selected Employee ID
  const [remark, setRemark] = useState(""); // Remark content

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
  const [employeeList, setEmployeeList] = useState([]); // List of employees for the dropdown

  // Fetch all employees from Firestore
  const fetchEmployees = async () => {
    try {
      const employeesRef = collection(db, "employees");
      const snapshot = await getDocs(employeesRef);
      const employees = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEmployeeList(employees);
    } catch (error) {
      console.error("Failed to fetch employees: ", error);

    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const addRemark = async () => {
    if (!eid || !remark) {
      Alert.alert("Error", "Please select an Employee ID and provide a Remark.");
      return;
    }

    if (!managerId || !managerName) {
      Alert.alert("Error", "Manager details are missing. Please check your context setup.");
      return;
    }

    const employeeRef = doc(db, "employees", eid);

    try {
      const docSnap = await getDoc(employeeRef);

      // If the document exists
      if (docSnap.exists()) {
        const datePosted = new Date().toISOString();

        // Initialize remarks field as an empty array if it doesn't exist
        const employeeData = docSnap.data();
        if (!employeeData.remarks) {
          await updateDoc(employeeRef, { remarks: [] });
        }

        // Add the remark
        await updateDoc(employeeRef, {
          remarks: arrayUnion({
            remark,
            managerName,
            managerId,
            datePosted,
          }),
        });

        Alert.alert("Success", "Remark added successfully!");
        setEid("");
        setRemark("");
      } else {
        Alert.alert("Error", `No employee found with ID: ${eid}`);
      }
    } catch (error) {
      console.error("Failed to add remark: ", error);
      Alert.alert("Error", "Failed to add remark: " + error.message);
    }
  };

  return (
    <View style={styles.container}>

    <View style={{ padding: 20 }}>
     
      
     

      <Text style={styles.label}>Select Employee ID:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={eid}
          onValueChange={(itemValue) => setEid(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select Employee" value="" />
          {employeeList.map((employee) => (
            <Picker.Item
              key={employee.id}
              label={`${employee.firstName} ${employee.lastName} (${employee.id})`}
              value={employee.id}
            />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Enter Remark:</Text>

      <TextInput
        value={remark}
        onChangeText={setRemark}
        style={styles.textInput}
        placeholder="Remark"
        multiline
      />
      <Button title="Submit Remark" onPress={addRemark} color="lightseagreen"/>
    </View>
    </View>
  );
};

// const styles = StyleSheet.create({
//   container: {
//       flex: 1,
//       backgroundColor: 'antiquewhite', // Background color
//       padding: 20,
//   },
//   textcontainer:{
//     fontWeight:'bold',
//   }
 
// });





const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "antiquewhite",
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 20,
    backgroundColor:'antiquewhite'
  },
  picker: {
    height: 50,
    width: "100%",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
});
  

export default ManagerRemarksScreen;
