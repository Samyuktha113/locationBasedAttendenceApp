// import React, { useEffect, useState } from 'react';
// import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
// import { Picker } from '@react-native-picker/picker'; // Updated import
// import { db } from '../services/firebaseAuth'; // Adjust based on your structure
// import { collection, getDocs } from 'firebase/firestore';

// const SalaryScreen = ({ navigation }) => {
//   const [employees, setEmployees] = useState([]);
//   const [managers, setManagers] = useState([]);
//   const [admins, setadmins] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [filter, setFilter] = useState('all'); // Default to 'all'

//   // Fetching data from Firestore
//   const fetchData = async () => {
//     try {
//       const employeeCollection = await getDocs(collection(db, 'employees'));
//       const managerCollection = await getDocs(collection(db, 'managers'));

//       const employeeData = employeeCollection.docs.map(doc => ({ ...doc.data(), id: doc.id }));
//       const managerData = managerCollection.docs.map(doc => ({ ...doc.data(), id: doc.id }));

//       setEmployees(employeeData);
//       setManagers(managerData);
//       setFilteredData([...employeeData, ...managerData]); // Initial state for both
//     } catch (error) {
//       console.error('Error fetching salary data: ', error);
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

//   // Render each employee/manager item
//   const renderItem = ({ item }) => (
//     <View style={styles.row}>
//       <View>
//         <Text style={styles.text}>Name: {item.firstName} {item.lastName}</Text>
//         <Text style={styles.text}>Salary: {item.salary || 'N/A'}</Text>
//       </View>

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

// export default SalaryScreen;






// import React, { useEffect, useState } from 'react';
// import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
// import DropDownPicker from 'react-native-dropdown-picker';
// import { db } from '../services/firebaseAuth'; // Adjust based on your structure
// import {
//   collection,
//   doc,
//   getDocs,
//   updateDoc,
//   setDoc,
//   getDoc,
// } from 'firebase/firestore';

// const SalaryScreen = () => {
//   const [employees, setEmployees] = useState([]);
//   const [managers, setManagers] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [filter, setFilter] = useState('all'); // Default to 'all'
//   const [open, setOpen] = useState(false); // For dropdown
//   const [items, setItems] = useState([
//     { label: 'All', value: 'all' },
//     { label: 'Employees', value: 'employees' },
//     { label: 'Managers', value: 'managers' },
//   ]);
//   const [selectedEmployee, setSelectedEmployee] = useState(null); // Employee selected for modification
//   const [fieldName, setFieldName] = useState(''); // Dynamic field name
//   const [amount, setAmount] = useState(''); // Amount to add/subtract

//   const COLLECTION_NAME = 'salaryAdjustments'; // Fixed collection name

//   // Fetching employee and manager data
//   const fetchData = async () => {
//     try {
//       const employeeCollection = await getDocs(collection(db, 'employees'));
//       const managerCollection = await getDocs(collection(db, 'managers'));

//       const employeeData = employeeCollection.docs.map((doc) => ({
//         ...doc.data(),
//         id: doc.id,
//       }));
//       const managerData = managerCollection.docs.map((doc) => ({
//         ...doc.data(),
//         id: doc.id,
//       }));

//       setEmployees(employeeData);
//       setManagers(managerData);
//       setFilteredData([...employeeData, ...managerData]); // Initial state for all
//     } catch (error) {
//       console.error('Error fetching salary data:', error);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   // Handle filtering
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

//   // Handle salary adjustment
//   const handleAdjustSalary = async () => {
//     if (!selectedEmployee || !fieldName || !amount) {
//       alert('Please fill in all fields.');
//       return;
//     }

//     const employeeId = selectedEmployee.id;
//     const employeeDocRef = doc(db, 'employees', employeeId);
//     const salaryAdjustmentDocRef = doc(collection(db, COLLECTION_NAME), employeeId);

//     try {
//       // Get current salary
//       const employeeDoc = await getDoc(employeeDocRef);
//       if (!employeeDoc.exists()) {
//         alert('Employee record not found.');
//         return;
//       }

//       const currentSalary = employeeDoc.data().salary || 0;

//       // Update salary in the main collection
//       const updatedSalary = currentSalary + parseFloat(amount);
//       await updateDoc(employeeDocRef, { salary: updatedSalary });

//       // Add adjustment entry in the fixed collection
//       await setDoc(
//         salaryAdjustmentDocRef,
//         {
//           [fieldName]: parseFloat(amount),
//         },
//         { merge: true }
//       );

//       alert('Salary adjusted successfully!');
//       fetchData(); // Refresh the data
//     } catch (error) {
//       console.error('Error adjusting salary:', error);
//       alert('Failed to adjust salary.');
//     }
//   };

//   // Render employee/manager item
//   const renderItem = ({ item }) => (
//     <TouchableOpacity
//       style={[
//         styles.row,
//         selectedEmployee?.id === item.id && styles.selectedRow,
//       ]}
//       onPress={() => setSelectedEmployee(item)}
//     >
//       <View>
//         <Text style={styles.text}>
//           Name: {item.firstName} {item.lastName}
//         </Text>
//         <Text style={styles.text}>Salary: {item.salary || 'N/A'}</Text>
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Adjust Salaries</Text>

//       {/* Filter Dropdown */}
//       <DropDownPicker
//         open={open}
//         value={filter}
//         items={items}
//         setOpen={setOpen}
//         setValue={setFilter}
//         setItems={setItems}
//         onChangeValue={handleFilterChange}
//         placeholder="Select Filter"
//         style={styles.dropdown}
//         containerStyle={{ marginBottom: 20 }}
//       />

//       {/* Employee/Manager List */}
//       <FlatList
//         data={filteredData}
//         keyExtractor={(item) => item.id}
//         renderItem={renderItem}
//         style={{ marginBottom: 20 }}
//       />

//       {/* Salary Adjustment Form */}
//       {selectedEmployee && (
//         <View>
//           <Text style={styles.subtitle}>
//             Adjust Salary for: {selectedEmployee.firstName}{' '}
//             {selectedEmployee.lastName}
//           </Text>
//           <TextInput
//             placeholder="Field Name (e.g., Bonus, Deduction)"
//             style={styles.input}
//             value={fieldName}
//             onChangeText={setFieldName}
//           />
//           <TextInput
//             placeholder="Amount (+/-)"
//             style={styles.input}
//             value={amount}
//             onChangeText={setAmount}
//             keyboardType="numeric"
//           />
//           <TouchableOpacity
//             style={styles.modifyButton}
//             onPress={handleAdjustSalary}
//           >
//             <Text style={styles.modifyButtonText}>Adjust Salary</Text>
//           </TouchableOpacity>
//         </View>
//       )}
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
//   subtitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     padding: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ddd',
//   },
//   selectedRow: {
//     backgroundColor: '#e0e0e0',
//   },
//   text: {
//     fontSize: 16,
//     color: '#333',
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 5,
//     padding: 10,
//     marginBottom: 10,
//   },
//   modifyButton: {
//     backgroundColor: '#007bff',
//     padding: 10,
//     borderRadius: 5,
//     alignItems: 'center',
//   },
//   modifyButtonText: {
//     color: '#fff',
//     fontSize: 16,
//   },
//   dropdown: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 5,
//   },
// });

// export default SalaryScreen;








// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   Alert,
// } from 'react-native';
// import { db } from '../services/firebaseAuth'; // Adjust based on your structure
// import { collection, doc, setDoc, getDoc } from 'firebase/firestore';
// import Ionicons from 'react-native-vector-icons/Ionicons'; // Importing Ionicons for delete icon

// const SalaryScreen = () => {
//   const [docName, setDocName] = useState('');
//   const [fields, setFields] = useState([{ fieldName: '', amount: '' }]);
//   const [total, setTotal] = useState(0);

//   const handleDocNameChange = (text) => {
//     setDocName(text);
//   };

//   const addField = () => {
//     setFields([...fields, { fieldName: '', amount: '' }]);
//   };

//   const deleteField = (index) => {
//     const newFields = fields.filter((_, i) => i !== index);
//     setFields(newFields);
//     calculateTotal(newFields); // Recalculate total after deleting a field
//   };

//   const calculateTotal = (fieldsArray = fields) => {
//     const totalSum = fieldsArray.reduce(
//       (sum, field) => sum + (parseFloat(field.amount) || 0),
//       0
//     );
//     setTotal(totalSum);
//   };

//   const saveData = async () => {
//     if (!docName) {
//       alert('Please provide a document name.');
//       return;
//     }

//     try {
//       const docRef = doc(collection(db, 'salary'), docName);

//       // Check if the document already exists
//       const existingDoc = await getDoc(docRef);

//       if (existingDoc.exists()) {
//         // If document already exists, alert the user to provide a new name
//         Alert.alert(
//           'Document Name Already Exists',
//           'Please provide a new document name.'
//         );
//         return;
//       }

//       // Prepare new data to save
//       const newFields = {};
//       fields.forEach((field) => {
//         newFields[field.fieldName] = parseFloat(field.amount || 0);
//       });

//       // Add total field to new data
//       const updatedData = { ...newFields, total: total };

//       // Save the new document to Firestore
//       await setDoc(docRef, updatedData);

//       alert('Data saved successfully!');
//       setFields([{ fieldName: '', amount: '' }]);
//       setTotal(0);
//       setDocName('');
//     } catch (error) {
//       console.error('Error saving data:', error);
//       alert('Failed to save data.');
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.title}>Dynamic Salary Adjustment</Text>

//       {/* Document name input */}
//       <TextInput
//         placeholder="Enter Document Name"
//         style={styles.input}
//         value={docName}
//         onChangeText={handleDocNameChange}
//       />

//       {fields.map((field, index) => (
//         <View key={index} style={styles.fieldContainer}>
//           <TextInput
//             placeholder="Field Name"
//             style={styles.input}
//             value={field.fieldName}
//             onChangeText={(text) =>
//               setFields(
//                 fields.map((f, i) =>
//                   i === index ? { ...f, fieldName: text } : f
//                 )
//               )
//             }
//           />
//           <TextInput
//             placeholder="Amount"
//             style={styles.input}
//             value={field.amount}
//             onChangeText={(text) =>
//               setFields(
//                 fields.map((f, i) =>
//                   i === index ? { ...f, amount: text } : f
//                 )
//               )
//             }
//             keyboardType="numeric"
//           />

//           {/* Delete icon */}
//           <TouchableOpacity
//             style={styles.deleteIcon}
//             onPress={() => deleteField(index)}
//           >
//             <Ionicons name="trash-bin" size={20} color="red" />
//           </TouchableOpacity>
//         </View>
//       ))}

//       <TouchableOpacity style={styles.addButton} onPress={addField}>
//         <Text style={styles.addButtonText}>Add Field</Text>
//       </TouchableOpacity>

//       <TouchableOpacity style={styles.totalButton} onPress={() => calculateTotal()}>
//         <Text style={styles.totalButtonText}>Calculate Total</Text>
//       </TouchableOpacity>

//       <Text style={styles.totalText}>Total: {total.toFixed(2).toString()}</Text>

//       <TouchableOpacity style={styles.saveButton} onPress={saveData}>
//         <Text style={styles.saveButtonText}>Save Data</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     padding: 20,
//     backgroundColor: '#f9f9f9',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 8,
//     padding: 10,
//     marginBottom: 10,
//     backgroundColor: '#fff',
//   },
//   fieldContainer: {
//     marginBottom: 15,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   addButton: {
//     backgroundColor: '#28a745',
//     padding: 15,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   addButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   totalButton: {
//     backgroundColor: '#007bff',
//     padding: 15,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   totalButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   totalText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   saveButton: {
//     backgroundColor: '#ff5722',
//     padding: 15,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   saveButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   deleteIcon: {
//     marginLeft: 10,
//     padding: 5,
//   },
// });

// export default SalaryScreen;





// import React, { useState,useEffect } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   Alert,
// } from 'react-native';
// import { db } from '../services/firebaseAuth'; // Adjust based on your structure
// import { collection, doc, setDoc, getDoc } from 'firebase/firestore';
// import Ionicons from 'react-native-vector-icons/Ionicons'; // Importing Ionicons for delete icon
// import Icon from "react-native-vector-icons/FontAwesome";
// const SalaryScreen = ({ navigation }) => { // Destructuring navigation to handle navigation
//   const [userId, setUserId] = useState('');
//   const [docName, setDocName] = useState('');
//   const [fields, setFields] = useState([{ fieldName: '', amount: '' }]);
//   const [total, setTotal] = useState(0);
//   const [totalCalculated, setTotalCalculated] = useState(false); // New state to track if total is calculated

//     useEffect(() => {
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
//   const handleLogout = async () => {
//     try {
//       console.log("User logged out");
//       navigation.navigate("HomeScreen");
//     } catch (error) {
//       console.error("Logout Error:", error);
//     }
//   };
//   const handleDocNameChange = (text) => {
//     setDocName(text);
//   };

//   const addField = () => {
//     setFields([...fields, { fieldName: '', amount: '' }]);
//   };

//   const deleteField = (index) => {
//     const newFields = fields.filter((_, i) => i !== index);
//     setFields(newFields);
//     calculateTotal(newFields); // Recalculate total after deleting a field
//   };

//   const calculateTotal = (fieldsArray = fields) => {
//     const totalSum = fieldsArray.reduce(
//       (sum, field) => sum + (parseFloat(field.amount) || 0),
//       0
//     );
//     setTotal(totalSum);
//     setTotalCalculated(true); // Set the flag to true once the total is calculated
//   };

//   const saveData = async () => {
//     if (!totalCalculated) {
//       alert('Please calculate the total first before saving.');
//       return;
//     }

//     if (!docName) {
//       alert('Please provide a document name.');
//       return;
//     }

//     try {
//       const docRef = doc(collection(db, 'salary'), docName);

//       // Check if the document already exists
//       const existingDoc = await getDoc(docRef);

//       if (existingDoc.exists()) {
//         // If document already exists, alert the user to provide a new name
//         Alert.alert(
//           'Document Name Already Exists',
//           'Please provide a new document name.'
//         );
//         return;
//       }

//       // Prepare new data to save
//       const newFields = {};
//       fields.forEach((field) => {
//         newFields[field.fieldName] = parseFloat(field.amount || 0);
//       });

//       // Add total field to new data
//       const updatedData = { ...newFields, total: total };

//       // Save the new document to Firestore
//       await setDoc(docRef, updatedData);

//       alert('Data saved successfully!');
//       setFields([{ fieldName: '', amount: '' }]);
//       setTotal(0);
//       setTotalCalculated(false); // Reset the flag after saving
//       setDocName('');
//     } catch (error) {
//       console.error('Error saving data:', error);
//       alert('Failed to save data.');
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.title}>Dynamic Salary Adjustment</Text>

//       {/* Document name input */}
//       <TextInput
//         placeholder="Enter Document Name"
//         style={styles.input}
//         value={docName}
//         onChangeText={handleDocNameChange}
//       />

//       {fields.map((field, index) => (
//         <View key={index} style={styles.fieldContainer}>
//           <TextInput
//             placeholder="Field Name"
//             style={styles.input}
//             value={field.fieldName}
//             onChangeText={(text) =>
//               setFields(
//                 fields.map((f, i) =>
//                   i === index ? { ...f, fieldName: text } : f
//                 )
//               )
//             }
//           />
//           <TextInput
//             placeholder="Amount"
//             style={styles.input}
//             value={field.amount}
//             onChangeText={(text) =>
//               setFields(
//                 fields.map((f, i) =>
//                   i === index ? { ...f, amount: text } : f
//                 )
//               )
//             }
//             keyboardType="numeric"
//           />

//           {/* Delete icon */}
//           <TouchableOpacity
//             style={styles.deleteIcon}
//             onPress={() => deleteField(index)}
//           >
//             <Ionicons name="trash-bin" size={20} color="red" />
//           </TouchableOpacity>
//         </View>
//       ))}

//       <TouchableOpacity style={styles.addButton} onPress={addField}>
//         <Text style={styles.addButtonText}>Add Field</Text>
//       </TouchableOpacity>

//       <TouchableOpacity
//         style={styles.totalButton}
//         onPress={() => calculateTotal()}
//       >
//         <Text style={styles.totalButtonText}>Calculate Total</Text>
//       </TouchableOpacity>

//       <Text style={styles.totalText}>Total: {total.toFixed(2).toString()}</Text>

//       {/* Disable Save button if total is not calculated */}
//       <TouchableOpacity
//         style={[styles.saveButton, !totalCalculated && styles.disabledButton]}
//         onPress={saveData}
//         disabled={!totalCalculated} // Disable button if total is not calculated
//       >
//         <Text style={styles.saveButtonText}>Save Data</Text>
//       </TouchableOpacity>

//       {/* New button for navigating to View/Assign Salary */}
//       <TouchableOpacity
//         style={styles.viewSalaryButton}
//         onPress={() => navigation.navigate('ViewSalary')}
//       >
//         <Text style={styles.viewSalaryButtonText}>View/Assign Salary</Text>
//       </TouchableOpacity>
//       <TouchableOpacity
//         style={styles.additionalButton}
//         onPress={() => navigation.navigate('ViewCalculatedSalary')} // Navigate to your desired screen
//       >
//         <Text style={styles.additionalButtonText}>View Calculated Salary</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     padding: 20,
//     backgroundColor: 'antiquewhite',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 8,
//     padding: 10,
//     marginBottom: 10,
//     backgroundColor: 'antiquewhite',
    
//   },
//   fieldContainer: {
//     marginBottom: 15,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   addButton: {
//     backgroundColor: 'lightseagreen',
//     padding: 15,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginBottom: 10,
    
//   },
//   addButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   totalButton: {
//     backgroundColor: 'lightseagreen',
//     padding: 15,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   totalButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   totalText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   saveButton: {
//     backgroundColor: 'lightseagreen',
//     padding: 15,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   saveButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   disabledButton: {
//     backgroundColor: '#b5b5b5', // Disabled color
//   },
//   deleteIcon: {
//     marginLeft: 10,
//     padding: 5,
//   },
//   viewSalaryButton: {
//     backgroundColor: 'lightseagreen',
//     padding: 15,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop: 20,
//   },
//   viewSalaryButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//     additionalButton: {
//     backgroundColor: 'lightseagreen', // New button color
//     padding: 15,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop: 20,
//   },
//   additionalButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',

//   },
// });

// export default SalaryScreen;


// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   Alert,
// } from 'react-native';
// import { db } from '../services/firebaseAuth'; // Adjust based on your structure

// //import { collection, getDocs } from 'firebase/firestore';
// import Icon from "react-native-vector-icons/FontAwesome";

// import { collection, doc, setDoc, getDoc, Timestamp } from 'firebase/firestore';
// import Ionicons from 'react-native-vector-icons/Ionicons'; // Importing Ionicons for delete icon

// const SalaryScreen = ({ navigation }) => { // Destructuring navigation to handle navigation
//   const [docName, setDocName] = useState('');
//   const [fields, setFields] = useState([{ fieldName: '', amount: '' }]);
//   const [total, setTotal] = useState(0);
//   const [totalCalculated, setTotalCalculated] = useState(false); // New state to track if total is calculated

//   const handleDocNameChange = (text) => {
//     setDocName(text);
//   };

//   const addField = () => {
//     setFields([...fields, { fieldName: '', amount: '' }]);
//   };

//   const deleteField = (index) => {
//     const newFields = fields.filter((_, i) => i !== index);
//     setFields(newFields);
//     calculateTotal(newFields); // Recalculate total after deleting a field
//   };

//   const calculateTotal = (fieldsArray = fields) => {
//     const totalSum = fieldsArray.reduce(
//       (sum, field) => sum + (parseFloat(field.amount) || 0),
//       0
//     );
//     setTotal(totalSum);
//     setTotalCalculated(true); // Set the flag to true once the total is calculated
//   };


//   const saveData = async () => {
//     if (!totalCalculated) {
//       alert('Please calculate the total first before saving.');
//       return;
//     }

//     if (!docName) {
//       alert('Please provide a document name.');
//       return;
//     }
  

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

//   // Fetching data from Firestore
//   const fetchData = async () => {

//     try {
//       const docRef = doc(collection(db, 'salary'), docName);

//       // Check if the document already exists
//       const existingDoc = await getDoc(docRef);

//       if (existingDoc.exists()) {
//         // If document already exists, alert the user to provide a new name
//         Alert.alert(
//           'Document Name Already Exists',
//           'Please provide a new document name.'
//         );
//         return;
//       }
    
//       // Prepare new data to save
//       const newFields = {};
//       fields.forEach((field) => {
//         newFields[field.fieldName] = parseFloat(field.amount || 0);
//       });

//       // Add total and createdAt fields to new data
//       const updatedData = { ...newFields, total: total, createdAt: Timestamp.now() }; // Add createdAt

//       // Save the new document to Firestore
//       await setDoc(docRef, updatedData);

//       alert('Data saved successfully!');
//       setFields([{ fieldName: '', amount: '' }]);
//       setTotal(0);
//       setTotalCalculated(false); // Reset the flag after saving
//       setDocName('');
//     } catch (error) {
//       console.error('Error saving data:', error);
//       alert('Failed to save data.');
//     }
//   }};

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.title}>Dynamic Salary Adjustment</Text>

//       {/* Document name input */}
//       <TextInput
//         placeholder="Enter Document Name"
//         style={styles.input}
//         value={docName}
//         onChangeText={handleDocNameChange}
//       />

//       {fields.map((field, index) => (
//         <View key={index} style={styles.fieldContainer}>
//           <TextInput
//             placeholder="Field Name"
//             style={styles.input}
//             value={field.fieldName}
//             onChangeText={(text) =>
//               setFields(
//                 fields.map((f, i) =>
//                   i === index ? { ...f, fieldName: text } : f
//                 )
//               )
//             }
//           />
//           <TextInput
//             placeholder="Amount"
//             style={styles.input}
//             value={field.amount}
//             onChangeText={(text) =>
//               setFields(
//                 fields.map((f, i) =>
//                   i === index ? { ...f, amount: text } : f
//                 )
//               )
//             }
//             keyboardType="numeric"
//           />

//           {/* Delete icon */}
//           <TouchableOpacity
//             style={styles.deleteIcon}
//             onPress={() => deleteField(index)}
//           >
//             <Ionicons name="trash-bin" size={20} color="red" />
//           </TouchableOpacity>
//         </View>
//       ))}

//       <TouchableOpacity style={styles.addButton} onPress={addField}>
//         <Text style={styles.addButtonText}>Add Field</Text>
//       </TouchableOpacity>

//       <TouchableOpacity
//         style={styles.totalButton}
//         onPress={() => calculateTotal()}
//       >
//         <Text style={styles.totalButtonText}>Calculate Total</Text>
//       </TouchableOpacity>

//       <Text style={styles.totalText}>Total: {total.toFixed(2).toString()}</Text>

//       {/* Disable Save button if total is not calculated */}
//       <TouchableOpacity
//         style={[styles.saveButton, !totalCalculated && styles.disabledButton]}
//         onPress={saveData}
//         disabled={!totalCalculated} // Disable button if total is not calculated
//       >
//         <Text style={styles.saveButtonText}>Save Data</Text>
//       </TouchableOpacity>

//       {/* New button for navigating to View/Assign Salary */}
//       <TouchableOpacity
//         style={styles.viewSalaryButton}
//         onPress={() => navigation.navigate('ViewSalary')}
//       >
//         <Text style={styles.viewSalaryButtonText}>View/Assign Salary</Text>
//       </TouchableOpacity>

//       {/* New button below "View/Assign Salary" */}
//       <TouchableOpacity
//         style={styles.additionalButton}
//         onPress={() => navigation.navigate('ViewCalculatedSalary')} // Navigate to your desired screen
//       >
//         <Text style={styles.additionalButtonText}>View Calculated Salary</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     padding: 20,

//     backgroundColor: 'antiquewhite',

//     backgroundColor: '#f9f9f9',

//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 20,
//     textAlign:'center',
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 8,
//     padding: 10,
//     marginBottom: 10,
//     backgroundColor: '#fff',
//   },
//   fieldContainer: {
//     marginBottom: 15,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   addButton: {
//     backgroundColor: '#28a745',
//     padding: 15,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   addButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },

//   modifyButton: {
//     backgroundColor: 'antiquewhite',
//     padding: 8,
//     borderRadius: 5,

//   totalButton: {
//     backgroundColor: '#007bff',
//     padding: 15,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginBottom: 10,

//   },
//   totalButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   totalText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 20,

//     backgroundColor: 'antiquewhite',
//     borderRadius: 5,

//   },
//   saveButton: {
//     backgroundColor: '#ff5722',
//     padding: 15,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   saveButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   disabledButton: {
//     backgroundColor: '#b5b5b5', // Disabled color
//   },
//   deleteIcon: {
//     marginLeft: 10,
//     padding: 5,
//   },
//   viewSalaryButton: {
//     backgroundColor: '#17a2b8',
//     padding: 15,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop: 20,
//   },
//   viewSalaryButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   additionalButton: {
//     backgroundColor: '#17a2b8', // New button color
//     padding: 15,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop: 20,
//   },
//   additionalButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',

//   },
// }});

// export default SalaryScreen;
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { db } from '../services/firebaseAuth'; // Adjust based on your structure
import { collection, doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Importing Ionicons for delete icon
import Icon from "react-native-vector-icons/FontAwesome";

const SalaryScreen = ({ navigation }) => {
  const [userId, setUserId] = useState('');
  const [docName, setDocName] = useState('');
  const [fields, setFields] = useState([{ fieldName: '', amount: '' }]);
  const [total, setTotal] = useState(0);
  const [totalCalculated, setTotalCalculated] = useState(false);

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

  const handleLogout = async () => {
    try {
      console.log("User logged out");
      navigation.navigate("HomeScreen");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const handleDocNameChange = (text) => {
    setDocName(text);
  };

  const addField = () => {
    setFields([...fields, { fieldName: '', amount: '' }]);
  };

  const deleteField = (index) => {
    const newFields = fields.filter((_, i) => i !== index);
    setFields(newFields);
    calculateTotal(newFields);
  };

  const calculateTotal = (fieldsArray = fields) => {
    const totalSum = fieldsArray.reduce(
      (sum, field) => sum + (parseFloat(field.amount) || 0),
      0
    );
    setTotal(totalSum);
    setTotalCalculated(true);
  };

  const saveData = async () => {
    if (!totalCalculated) {
      alert('Please calculate the total first before saving.');
      return;
    }

    if (!docName) {
      alert('Please provide a document name.');
      return;
    }

    try {
      const docRef = doc(collection(db, 'salary'), docName);
      const existingDoc = await getDoc(docRef);

      if (existingDoc.exists()) {
        Alert.alert(
          'Document Name Already Exists',
          'Please provide a new document name.'
        );
        return;
      }

      const newFields = {};
      const updatedEmployees = []; // To store names of employees whose salaries were updated

      fields.forEach((field) => {
        if (field.fieldName.trim()) {
          newFields[field.fieldName] = parseFloat(field.amount || 0);
          updatedEmployees.push(field.fieldName); // Storing employee names
        }
      });

      const updatedData = {
        ...newFields,
        total: total,
        createdAt: serverTimestamp(), // Adding timestamp
        // Storing updated employee names
      };

      await setDoc(docRef, updatedData);

      alert('Data saved successfully!');
      setFields([{ fieldName: '', amount: '' }]);
      setTotal(0);
      setTotalCalculated(false);
      setDocName('');
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Failed to save data.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Dynamic Salary Adjustment</Text>

      <TextInput
        placeholder="Enter Document Name"
        style={styles.input}
        value={docName}
        onChangeText={handleDocNameChange}
      />

      {fields.map((field, index) => (
        <View key={index} style={styles.fieldContainer}>
          <TextInput
            placeholder="Field Name"
            style={styles.input}
            value={field.fieldName}
            onChangeText={(text) =>
              setFields(fields.map((f, i) => (i === index ? { ...f, fieldName: text } : f)))
            }
          />
          <TextInput
            placeholder="Amount"
            style={styles.input}
            value={field.amount}
            onChangeText={(text) =>
              setFields(fields.map((f, i) => (i === index ? { ...f, amount: text } : f)))
            }
            keyboardType="numeric"
          />

          <TouchableOpacity style={styles.deleteIcon} onPress={() => deleteField(index)}>
            <Ionicons name="trash-bin" size={20} color="red" />
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity style={styles.addButton} onPress={addField}>
        <Text style={styles.addButtonText}>Add Field</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.totalButton} onPress={() => calculateTotal()}>
        <Text style={styles.totalButtonText}>Calculate Total</Text>
      </TouchableOpacity>

      <Text style={styles.totalText}>Total: {total.toFixed(2).toString()}</Text>

      <TouchableOpacity
        style={[styles.saveButton, !totalCalculated && styles.disabledButton]}
        onPress={saveData}
        disabled={!totalCalculated}
      >
        <Text style={styles.saveButtonText}>Save Data</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.viewSalaryButton} onPress={() => navigation.navigate('ViewSalary')}>
        <Text style={styles.viewSalaryButtonText}>View/Assign Salary</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.additionalButton} onPress={() => navigation.navigate('ViewCalculatedSalary')}>
        <Text style={styles.additionalButtonText}>View Calculated Salary</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: 'antiquewhite',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: 'antiquewhite',
  },
  fieldContainer: {
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: 'lightseagreen',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  totalButton: {
    backgroundColor: 'lightseagreen',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: 'lightseagreen',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#b5b5b5',
  },
  deleteIcon: {
    marginLeft: 10,
    padding: 5,
  },
  viewSalaryButton: {
    backgroundColor: 'lightseagreen',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  additionalButton: {
    backgroundColor: 'lightseagreen',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
});

export default SalaryScreen;
