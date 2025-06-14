// import React, { useState, useEffect } from 'react';
// import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
// import { Picker } from '@react-native-picker/picker';
// import { db } from '../services/firebaseAuth'; // Adjust based on your structure
// import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

// const ViewSalary = () => {
//   const [employees, setEmployees] = useState([]);
//   const [managers, setManagers] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [filter, setFilter] = useState('all'); // Default to 'all'
//   const [salaryOptions, setSalaryOptions] = useState([]);
//   const [selectedTotal, setSelectedTotal] = useState({ total: 0, documentName: '' }); // Selected salary info
//   const [selectedEmployee, setSelectedEmployee] = useState(null); // Selected employee/manager

//   // Fetch employees, managers, and salaries from Firestore
//   const fetchData = async () => {
//     try {
//       const employeeCollection = await getDocs(collection(db, 'employees'));
//       const managerCollection = await getDocs(collection(db, 'managers'));
//       const salaryCollection = await getDocs(collection(db, 'salary'));

//       const employeeData = employeeCollection.docs.map(doc => ({ ...doc.data(), id: doc.id, type: 'employees' }));
//       const managerData = managerCollection.docs.map(doc => ({ ...doc.data(), id: doc.id, type: 'managers' }));
//       const salaryData = salaryCollection.docs.map(doc => ({
//         ...doc.data(),
//         id: doc.id, // Document ID
//         display: `${doc.id}: ${doc.data().total}`, // Format for dropdown
//       }));

//       setEmployees(employeeData);
//       setManagers(managerData);
//       setFilteredData([...employeeData, ...managerData]); // Combine employees and managers initially
//       setSalaryOptions(salaryData);
//     } catch (error) {
//       console.error('Error fetching data: ', error);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   // Filter data based on selection
//   const handleFilterChange = (selectedFilter) => {
//     setFilter(selectedFilter);
//     if (selectedFilter === 'employees') {
//       setFilteredData(employees);
//     } else if (selectedFilter === 'managers') {
//       setFilteredData(managers);
//     } else {
//       setFilteredData([...employees, ...managers]); // Show all
//     }
//   };

//   // Handle salary update with confirmation
//   const handleSalaryUpdate = (item) => {
//     setSelectedEmployee(item);

//     // Parse salaries as integers to avoid concatenation
//     const updatedSalary = Number(item.salary) + Number(selectedTotal.total);

//     Alert.alert(
//       'Confirm Salary Update',
//       `Are you sure you want to update ${item.firstName} ${item.lastName}'s salary from ${item.salary} to ${updatedSalary}?`,
//       [
//         {
//           text: 'Cancel',
//           style: 'cancel',
//         },
//         {
//           text: 'OK',
//           onPress: async () => {
//             try {
//               // Update the employee/manager salary in Firestore
//               const docRef = doc(db, item.type, item.id);
//               await updateDoc(docRef, {
//                 salary: updatedSalary,
//               });
//               Alert.alert('Success', 'Salary updated successfully!');
//               fetchData(); // Re-fetch the updated data
//             } catch (error) {
//               console.error('Error updating salary: ', error);
//               Alert.alert('Error', 'Failed to update salary.');
//             }
//           },
//         },
//       ],
//       { cancelable: true }
//     );
//   };

//   // Render each employee/manager item
//   const renderItem = ({ item }) => (
//     <View style={styles.row}>
//       <View>
//         <Text style={styles.text}>
//           Name: {item.firstName} {item.lastName}
//         </Text>
//         <Text style={styles.text}>
//           Salary: {item.salary || 'N/A'}
//         </Text>
//       </View>
//       <TouchableOpacity
//         style={styles.modifyButton}
//         onPress={() => handleSalaryUpdate(item)}
//       >
//         <Text style={styles.modifyButtonText}>Update Salary</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>View Salaries</Text>

//       {/* Filter Dropdown */}
//       <Picker
//         selectedValue={filter}
//         style={styles.picker}
//         onValueChange={(itemValue) => handleFilterChange(itemValue)}
//       >
//         <Picker.Item label="All" value="all" />
//         <Picker.Item label="Employees" value="employees" />
//         <Picker.Item label="Managers" value="managers" />
//       </Picker>

//       {/* Salary Total Dropdown */}
//       <Picker
//         selectedValue={selectedTotal}
//         style={styles.picker}
//         onValueChange={(itemValue) => setSelectedTotal(itemValue)}
//       >
//         <Picker.Item label="Select Total Salary" value={{ total: 0, documentName: '' }} />
//         {salaryOptions.map(option => (
//           <Picker.Item
//             key={option.id}
//             label={option.display} // Display "DocumentName: Total"
//             value={{ total: option.total, documentName: option.id }} // Value includes total and document name
//           />
//         ))}
//       </Picker>

//       {/* List of Salaries */}
//       <FlatList
//         data={filteredData}
//         keyExtractor={(item) => item.id}
//         renderItem={renderItem}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#f8f9fa',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     padding: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ddd',
//   },
//   text: {
//     fontSize: 16,
//     color: '#333',
//   },
//   modifyButton: {
//     backgroundColor: '#007BFF',
//     padding: 8,
//     borderRadius: 5,
//   },
//   modifyButtonText: {
//     color: '#fff',
//     fontSize: 14,
//   },
//   picker: {
//     height: 50,
//     width: '100%',
//     marginBottom: 20,
//     backgroundColor: '#e9ecef',
//     borderRadius: 5,
//   },
// });

// export default ViewSalary;



import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { db } from '../services/firebaseAuth'; // Adjust based on your structure
import { collection, getDocs, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import Icon from "react-native-vector-icons/FontAwesome";
const ViewSalary = ({navigation}) => {
  const [employees, setEmployees] = useState([]);
  const [managers, setManagers] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filter, setFilter] = useState('all'); // Default to 'all'
  const [salaryOptions, setSalaryOptions] = useState([]);
  const [selectedTotal, setSelectedTotal] = useState({ total: 0, documentName: '' }); // Selected salary info
  const [selectedEmployee, setSelectedEmployee] = useState(null); // Selected employee/manager

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
  // Fetch employees, managers, and salaries from Firestore
  const fetchData = async () => {
    try {
      const employeeCollection = await getDocs(collection(db, 'employees'));
      const managerCollection = await getDocs(collection(db, 'managers'));
      const salaryCollection = await getDocs(collection(db, 'salary'));

      const employeeData = employeeCollection.docs.map(doc => ({ ...doc.data(), id: doc.id, type: 'employees' }));
      const managerData = managerCollection.docs.map(doc => ({ ...doc.data(), id: doc.id, type: 'managers' }));
      const salaryData = salaryCollection.docs.map(doc => ({
        ...doc.data(),
        id: doc.id, // Document ID
        display: `${doc.id}: ${doc.data().total}`, // Format for dropdown
      }));

      setEmployees(employeeData);
      setManagers(managerData);
      setFilteredData([...employeeData, ...managerData]); // Combine employees and managers initially
      setSalaryOptions(salaryData);
    } catch (error) {
      console.error('Error fetching data: ', error);
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

  const handleSalaryUpdate = (item) => {
        setSelectedEmployee(item);
    
        // Parse salaries as integers to avoid concatenation
        const updatedSalary = Number(item.salary) + Number(selectedTotal.total);
    
        Alert.alert(
          'Confirm Salary Update',
          `Are you sure you want to update ${item.firstName} ${item.lastName}'s salary from ${item.salary} to ${updatedSalary}?`,
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: async () => {
                try {
                  // Update the employee/manager salary in Firestore
                  const docRef = doc(db, item.type, item.id);
                  await updateDoc(docRef, {
                    salary: updatedSalary,
                  });
                  Alert.alert('Success', 'Salary updated successfully!');
                  fetchData(); // Re-fetch the updated data
                } catch (error) {
                  console.error('Error updating salary: ', error);
                  Alert.alert('Error', 'Failed to update salary.');
                }
              },
            },
          ],
          { cancelable: true }
        );
      };
  // Handle salary update with confirmation
  // const handleSalaryUpdate = (item) => {
  //   setSelectedEmployee(item);

  //   // Parse salaries as integers to avoid concatenation
  //   const updatedSalary = Number(item.salary) + Number(selectedTotal.total);

  //   Alert.alert(
  //     'Confirm Salary Update',
  //     `Are you sure you want to update ${item.firstName} ${item.lastName}'s salary from ${item.salary} to ${updatedSalary}?`,
  //     [
  //       {
  //         text: 'Cancel',
  //         style: 'cancel',
  //       },
  //       {
  //         text: 'OK',
  //         onPress: async () => {
  //           try {
  //             // Update the employee/manager salary in Firestore
  //             const employeeRef = doc(db, item.type, item.id);
  //             const salaryRef = doc(db, 'salary', selectedTotal.documentName);

  //             await updateDoc(employeeRef, {
  //               salary: updatedSalary,
  //             });

  //             // Add empid to the `updatedEmployees` array in the salary collection
  //             await updateDoc(salaryRef, {
  //               updatedEmployees: arrayUnion(item.id),
  //             });

  //             Alert.alert('Success', 'Salary updated successfully!');
  //             fetchData(); // Re-fetch the updated data
  //           } catch (error) {
  //             console.error('Error updating salary: ', error);
  //             Alert.alert('Error', 'Failed to update salary.');
  //           }
  //         },
  //       },
  //     ],
  //     { cancelable: true }
  //   );
  // };

  // Render each employee/manager item
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View>
        <Text style={styles.text}>
          <Text style={styles.label}>Name:</Text> {item.firstName} {item.lastName}
        </Text>
        <Text style={styles.text}>
          <Text style={styles.label}>Salary:</Text> {item.salary || 'N/A'}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.modifyButton}
        onPress={() => handleSalaryUpdate(item)}
      >
        <Text style={styles.modifyButtonText}>Update</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>View Salaries</Text>

      {/* Filter Dropdown */}
      <Text style={styles.subTitle}>Filter:</Text>
      <Picker
        selectedValue={filter}
        style={styles.picker}
        onValueChange={(itemValue) => handleFilterChange(itemValue)}
      >
        <Picker.Item label="All" value="all" />
        <Picker.Item label="Employees" value="employees" />
        <Picker.Item label="Managers" value="managers" />
      </Picker>

      {/* Salary Total Dropdown */}
      <Text style={styles.subTitle}>Select Salary:</Text>
      <Picker
        selectedValue={selectedTotal.documentName ? selectedTotal : { total: 0, documentName: '' }}
        style={styles.picker}
        onValueChange={(itemValue) => {
          // Set selected salary information properly
          setSelectedTotal(itemValue);
        }}
      >
        <Picker.Item label="Select Total Salary" value={{ total: 0, documentName: '' }} />
        {salaryOptions.map(option => (
          <Picker.Item
            key={option.id}
            label={option.display} // Display "DocumentName: Total"
            value={{ total: option.total, documentName: option.id }} // Value includes total and document name
          />
        ))}
      </Picker>

      {/* Display selected salary */}
      {selectedTotal.documentName && (
        <Text style={styles.text}>
          <Text style={styles.label}>Selected Salary:</Text> {selectedTotal.total}
        </Text>
      )}

      {/* List of Salaries */}
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
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  subTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#555',
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
    backgroundColor: 'antiquewhite',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor:'white',
    padding: 15,
    marginVertical: 10,
    borderRadius: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 7,
    elevation: 3,
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
  label: {
    fontWeight: 'bold',
  },
  modifyButton: {
    backgroundColor: 'lightseagreen',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  modifyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ViewSalary;
