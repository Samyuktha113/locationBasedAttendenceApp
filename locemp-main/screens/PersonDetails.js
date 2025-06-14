import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { db } from '../services/firebaseAuth'; // Adjust this import based on your structure
import { collection, getDocs } from 'firebase/firestore';
import Icon from "react-native-vector-icons/FontAwesome"; 

const EmployeeDetailsScreen = ({ navigation }) => {
  const [employees, setEmployees] = useState([]);
  const [managers, setManagers] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filter, setFilter] = useState('all'); // Default to 'all'

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

  // Fetching data from Firestore
  const fetchData = async () => {
    try {
      const employeeCollection = await getDocs(collection(db, 'employees'));
      const managerCollection = await getDocs(collection(db, 'managers'));

      const employeeData = employeeCollection.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      const managerData = managerCollection.docs.map(doc => ({ ...doc.data(), id: doc.id }));

      setEmployees(employeeData);
      setManagers(managerData);
      setFilteredData([...employeeData, ...managerData]); // Initial state for both
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter data based on selection
  const handleFilterChange = (selectedFilter) => {
    setFilter(selectedFilter);
    if (selectedFilter === 'employees') {
      setFilteredData(employees);
    } else if (selectedFilter === 'managers') {
      setFilteredData(managers);
    } else {
      setFilteredData([...employees, ...managers]); // Show all
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text>{item.firstName} {item.lastName}</Text>
      <TouchableOpacity 
        style={styles.modifyButton} 
        onPress={() => navigation.navigate('ModifyScreen', { id: item.id })}
      >
        <Text style={styles.modifyButtonText}>Modify</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Employee Details</Text>

      <Picker
        selectedValue={filter}
        style={styles.picker}
        onValueChange={(itemValue) => handleFilterChange(itemValue)}
      >
        <Picker.Item label="All" value="all" />
        <Picker.Item label="Employees" value="employees" />
        <Picker.Item label="Managers" value="managers" />
      </Picker>

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'antiquewhite',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  modifyButton: {
    backgroundColor: 'lightseagreen',
    padding: 5,
    borderRadius: 5,
  },
  modifyButtonText: {
    color: '#fff',
  },
  picker: {
    height: 50,
    width: 150,
    marginBottom: 20,
  },
});

export default EmployeeDetailsScreen;
