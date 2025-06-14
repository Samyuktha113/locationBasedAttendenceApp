// import React, { useState } from 'react';
// import { Picker } from '@react-native-picker/picker';

// import { View, TextInput, Button, Text, Alert } from 'react-native';
// import { doc, deleteDoc } from 'firebase/firestore';
// import { db } from '../services/firebaseAuth'; // Adjust this path as needed

// export default function RemoveUserScreen() {
//     const [userId, setUserId] = useState('');
//     const [userType, setUserType] = useState('employee'); // State to determine type of user (employee or manager)
//     const [message, setMessage] = useState('');

//     const handleRemoveUser = async () => {
//         if (!userId.trim()) {
//             Alert.alert('Error', 'Please enter a valid User ID');
//             return;
//         }

//         try {
//             const collectionName = userType === 'employee' ? 'employees' : 'managers';

//             // Delete the document from the selected collection
//             await deleteDoc(doc(db, collectionName, userId));

//             setMessage(`${userType.charAt(0).toUpperCase() + userType.slice(1)} with ID ${userId} has been removed successfully.`);
//             setUserId(''); // Clear input
//         } catch (error) {
//             setMessage(`Error removing ${userType}: ${error.message}`);
//         }
//     };

//     return (
//         <View style={{ padding: 20 }}>
//             <Text style={{ fontSize: 24, marginBottom: 20 }}>Remove User</Text>
//             <TextInput
//                 placeholder="Enter User ID"
//                 value={userId}
//                 onChangeText={setUserId}
//                 style={{
//                     borderWidth: 1,
//                     borderColor: '#ccc',
//                     padding: 10,
//                     borderRadius: 5,
//                     marginBottom: 10,
//                     width: '100%',
//                 }}
//             />
//             <Picker
//                 selectedValue={userType}
//                 onValueChange={(itemValue) => setUserType(itemValue)}
//                 style={{
//                     height: 50,
//                     width: '100%',
//                     marginBottom: 20,
//                     borderColor: '#ccc',
//                     borderWidth: 1,
//                     borderRadius: 5,
//                 }}
//             >
//                 <Picker.Item label="Employee" value="employee" />
//                 <Picker.Item label="Manager" value="manager" />
//             </Picker>
//             <Button title="Remove User" onPress={handleRemoveUser} color="#d9534f" />
//             {message ? <Text style={{ marginTop: 20 }}>{message}</Text> : null}
//         </View>
//     );
// }





// import React, { useState, useEffect } from 'react';
// import { Picker } from '@react-native-picker/picker';
// import { View, TextInput, Button, Text, Alert, FlatList, StyleSheet } from 'react-native';
// import { doc, deleteDoc, collection, getDocs, getDoc, setDoc, query, orderBy } from 'firebase/firestore';
// import { db } from '../services/firebaseAuth'; // Adjust this path as needed

// export default function RemoveUserScreen() {
//     const [userId, setUserId] = useState('');
//     const [userType, setUserType] = useState('employee'); // State to determine type of user (employee or manager)
//     const [message, setMessage] = useState('');
//     const [removedEmployees, setRemovedEmployees] = useState([]);

//     // Fetch all removed employees from Firestore, ordered by removedAt in descending order
//     const fetchRemovedEmployees = async () => {
//         try {
//             const removedCollection = query(
//                 collection(db, 'removedEmployees'),
//                 orderBy('removedAt', 'desc') // Sort by removedAt in descending order
//             );
//             const removedData = await getDocs(removedCollection);
//             const employeesList = removedData.docs
//                 .map(doc => ({ ...doc.data(), id: doc.id }));

//             setRemovedEmployees(employeesList);
//         } catch (error) {
//             console.error('Error fetching removed employees:', error);
//         }
//     };

//     // Handle user removal
//     const handleRemoveUser = async () => {
//         if (!userId.trim()) {
//             Alert.alert('Error', 'Please enter a valid User ID');
//             return;
//         }

//         try {
//             const collectionName = userType === 'employee' ? 'employees' : 'managers';

//             // Fetch the employee or manager details before deletion
//             const userDoc = await getDoc(doc(db, collectionName, userId));
//             if (!userDoc.exists()) {
//                 setMessage(`User with ID ${userId} not found`);
//                 return;
//             }

//             const userData = userDoc.data();
            
//             // Delete the document from the selected collection
//             await deleteDoc(doc(db, collectionName, userId));

//             // Store removed employee in the 'removedEmployees' collection using empId as the document ID
//             const removedEmployeeData = {
//                 userId,
//                 userType,
//                 removedAt: new Date(), // Current timestamp of removal
//                 firstName: userData.firstName || 'N/A', // Use real data from Firestore or state
//                 lastName: userData.lastName || 'N/A',   // Use real data from Firestore or state
//             };

//             // Save the removed employee data in the 'removedEmployees' collection
//             await setDoc(doc(db, 'removedEmployees', userId), removedEmployeeData);

//             setMessage(`${userType.charAt(0).toUpperCase() + userType.slice(1)} with ID ${userId} has been removed successfully.`);
//             setUserId(''); // Clear input field
//             fetchRemovedEmployees(); // Refresh the removed employee list
//         } catch (error) {
//             setMessage(`Error removing ${userType}: ${error.message}`);
//         }
//     };

//     useEffect(() => {
//         fetchRemovedEmployees(); // Fetch removed employees when the component mounts
//     }, []);

//     // Render the removed employees list
//     const renderRemovedEmployee = ({ item }) => (
//         <View style={styles.row}>
//             <Text style={styles.text}>ID: {item.userId}</Text>
//             <Text style={styles.text}>Name: {item.firstName} {item.lastName}</Text>
//             <Text style={styles.text}>User Type: {item.userType}</Text>
//             <Text style={styles.text}>Removed At: {new Date(item.removedAt.seconds * 1000).toLocaleString()}</Text>
//         </View>
//     );

//     return (
//         <View style={{ padding: 20 }}>
//             <Text style={{ fontSize: 24, marginBottom: 20 }}>Remove User</Text>
//             <TextInput
//                 placeholder="Enter User ID"
//                 value={userId}
//                 onChangeText={setUserId}
//                 style={{
//                     borderWidth: 1,
//                     borderColor: '#ccc',
//                     padding: 10,
//                     borderRadius: 5,
//                     marginBottom: 10,
//                     width: '100%',
//                 }}
//             />
//             <Picker
//                 selectedValue={userType}
//                 onValueChange={(itemValue) => setUserType(itemValue)}
//                 style={{
//                     height: 50,
//                     width: '100%',
//                     marginBottom: 20,
//                     borderColor: '#ccc',
//                     borderWidth: 1,
//                     borderRadius: 5,
//                 }}
//             >
//                 <Picker.Item label="Employee" value="employee" />
//                 <Picker.Item label="Manager" value="manager" />
//             </Picker>
//             <Button title="Remove User" onPress={handleRemoveUser} color="#d9534f" />
//             {message ? <Text style={{ marginTop: 20 }}>{message}</Text> : null}

//             <Text style={{ fontSize: 24, marginTop: 30 }}>Removed Employees</Text>
//             <FlatList
//                 data={removedEmployees}
//                 keyExtractor={(item) => item.id}
//                 renderItem={renderRemovedEmployee}
//             />
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     row: {
//         flexDirection: 'column',
//         padding: 15,
//         borderBottomWidth: 1,
//         borderBottomColor: '#ddd',
//     },
//     text: {
//         fontSize: 16,
//         color: '#333',
//     },
// });



// import React, { useState } from 'react';
// import { Picker } from '@react-native-picker/picker';
// import { View, TextInput, Button, Text, Alert } from 'react-native';
// import { doc, deleteDoc, getDoc, setDoc } from 'firebase/firestore';
// import { db } from '../services/firebaseAuth'; // Adjust this path as needed

// export default function RemoveUserScreen({ navigation }) {
//     const [userId, setUserId] = useState('');
//     const [userType, setUserType] = useState('employee'); // State to determine type of user (employee or manager)
//     const [message, setMessage] = useState('');

//     const handleRemoveUser = async () => {
//         if (!userId.trim()) {
//             Alert.alert('Error', 'Please enter a valid User ID');
//             return;
//         }

//         try {
//             const collectionName = userType === 'employee' ? 'employees' : 'managers';

//             // Fetch the employee or manager details before deletion
//             const userDoc = await getDoc(doc(db, collectionName, userId));
//             if (!userDoc.exists()) {
//                 setMessage(`User with ID ${userId} not found`);
//                 return;
//             }

//             const userData = userDoc.data();

//             const joinDateStr = userData.joinDate;
//         if (!joinDateStr) {
//             setMessage('Error: User data does not have a valid join date.');
//             return;
//         }

//         const joinDate = new Date(joinDateStr); // Convert "YYYY-MM-DD" to a Date object
//         if (isNaN(joinDate)) {
//             setMessage('Error: Invalid join date format.');
//             return;
//         }
//         const currentDate = new Date();
//         const experienceInMilliseconds = currentDate - joinDate;

//         // Convert milliseconds to years, months, and days
//         const experienceInDays = Math.floor(experienceInMilliseconds / (1000 * 60 * 60 * 24));
//         const experienceInYears = Math.floor(experienceInDays / 365);
//         const experienceInMonths = Math.floor((experienceInDays % 365) / 30);
//         const remainingDays = experienceInDays % 30;

//         const experience = `${experienceInYears} years, ${experienceInMonths} months, ${remainingDays} days`;

//             // Delete the document from the selected collection
//             await deleteDoc(doc(db, collectionName, userId));

//             // Store removed employee in the 'removedEmployees' collection
//             const removedEmployeeData = {
//                 userId,
//                 userType,
//                 removedAt: new Date(), // Current timestamp of removal
//                 createdAt: userData.createdAt.toDate(), // Store the 'createdAt' field
//                 firstName: userData.firstName || 'N/A', // Use real data from Firestore or state
//                 lastName: userData.lastName || 'N/A', 
//                 experience,  // Use real data from Firestore or state
//             };

//             // Save the removed employee data in the 'removedEmployees' collection
//             await setDoc(doc(db, 'removedEmployees', userId), removedEmployeeData);

//             setMessage(`${userType.charAt(0).toUpperCase() + userType.slice(1)} with ID ${userId} has been removed successfully.`);
//             setUserId(''); // Clear input field
//         } catch (error) {
//             setMessage(`Error removing ${userType}: ${error.message}`);
//         }
//     };

//     return (
//         <View style={{ padding: 20 }}>
//             <Text style={{ fontSize: 24, marginBottom: 20 }}>Remove User</Text>
//             <TextInput
//                 placeholder="Enter User ID"
//                 value={userId}
//                 onChangeText={setUserId}
//                 style={{
//                     borderWidth: 1,
//                     borderColor: '#ccc',
//                     padding: 10,
//                     borderRadius: 5,
//                     marginBottom: 10,
//                     width: '100%',
//                 }}
//             />
//             <Picker
//                 selectedValue={userType}
//                 onValueChange={(itemValue) => setUserType(itemValue)}
//                 style={{
//                     height: 50,
//                     width: '100%',
//                     marginBottom: 20,
//                     borderColor: '#ccc',
//                     borderWidth: 1,
//                     borderRadius: 5,
//                 }}
//             >
//                 <Picker.Item label="Employee" value="employee" />
//                 <Picker.Item label="Manager" value="manager" />
//             </Picker>
//             <Button title="Remove User" onPress={handleRemoveUser} color="#d9534f" />
//             {message ? <Text style={{ marginTop: 20 }}>{message}</Text> : null}

//             {/* Add a button to navigate to the See Removed Employees screen */}
//             <View style={{ marginTop: 30 }}>
//                 <Button
//                     title="See Removed Employees"
//                     onPress={() => navigation.navigate('SeeRemovedEmployeesScreen')}
//                     color="#d9534f"
//                 />
//             </View>
//         </View>
//     );
// }


import React, { useState, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';
import { View, Button, Text, Alert ,TouchableOpacity,StyleSheet} from 'react-native';
import { doc, deleteDoc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebaseAuth';
import Icon from "react-native-vector-icons/FontAwesome"; // Adjust this path as needed

export default function RemoveUserScreen({ navigation }) {
    const [userId, setUserId] = useState('');
    const [userType, setUserType] = useState('employee'); // State to determine type of user (employee or manager)
    const [message, setMessage] = useState('');
    const [userOptions, setUserOptions] = useState([]); // State to hold user options for dropdown

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

    // Fetch users from Firestore based on userType when component mounts or userType changes
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const collectionName = userType === 'employee' ? 'employees' : 'managers';
                const querySnapshot = await getDocs(collection(db, collectionName));

                const options = querySnapshot.docs.map((doc) => ({
                    label: doc.data().firstName + ' ' + (doc.data().lastName || ''), // Display name
                    value: doc.id, // Use document ID as value
                }));

                setUserOptions(options);
                setUserId(options.length > 0 ? options[0].value : ''); // Set default value
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, [userType]);

    const handleRemoveUser = async () => {
        if (!userId) {
            Alert.alert('Error', 'Please select a User ID');
            return;
        }

        try {
            const collectionName = userType === 'employee' ? 'employees' : 'managers';

            // Fetch the employee or manager details before deletion
            const userDoc = await getDoc(doc(db, collectionName, userId));
            if (!userDoc.exists()) {
                setMessage(`User with ID ${userId} not found`);
                return;
            }

            const userData = userDoc.data();

            const joinDateStr = userData.joinDate;
            if (!joinDateStr) {
                setMessage('Error: User data does not have a valid join date.');
                return;
            }

            const joinDate = new Date(joinDateStr); // Convert "YYYY-MM-DD" to a Date object
            if (isNaN(joinDate)) {
                setMessage('Error: Invalid join date format.');
                return;
            }
            const currentDate = new Date();
            const experienceInMilliseconds = currentDate - joinDate;

            // Convert milliseconds to years, months, and days
            const experienceInDays = Math.floor(experienceInMilliseconds / (1000 * 60 * 60 * 24));
            const experienceInYears = Math.floor(experienceInDays / 365);
            const experienceInMonths = Math.floor((experienceInDays % 365) / 30);
            const remainingDays = experienceInDays % 30;

            const experience = `${experienceInYears} years, ${experienceInMonths} months, ${remainingDays} days`;

            // Delete the document from the selected collection
            await deleteDoc(doc(db, collectionName, userId));

            // Store removed employee in the 'removedEmployees' collection
            const removedEmployeeData = {
                userId,
                userType,
                removedAt: new Date(), // Current timestamp of removal
                createdAt: userData.createdAt.toDate(), // Store the 'createdAt' field
                firstName: userData.firstName || 'N/A', // Use real data from Firestore or state
                lastName: userData.lastName || 'N/A',
                experience, // Use real data from Firestore or state
            };

            // Save the removed employee data in the 'removedEmployees' collection
            await setDoc(doc(db, 'removedEmployees', userId), removedEmployeeData);

            setMessage(`${userType.charAt(0).toUpperCase() + userType.slice(1)} with ID ${userId} has been removed successfully.`);
            setUserId(''); // Clear input field
        } catch (error) {
            setMessage(`Error removing ${userType}: ${error.message}`);
        }
    };

    return (
        <View View style={styles.container}>
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 24,  fontWeight: 'bold', textAlign:'center', marginBottom: 20 }}>Remove User</Text>
            <Picker
                selectedValue={userType}
                onValueChange={(itemValue) => setUserType(itemValue)}
                style={{
                    height: 50,
                    width: '100%',
                    marginBottom: 20,
                    borderColor: '#ccc',
                    borderWidth: 1,
                    borderRadius: 5,
                }}
            >
                <Picker.Item label="Employee" value="employee" />
                <Picker.Item label="Manager" value="manager" />
            </Picker>
            <Picker
                selectedValue={userId}
                onValueChange={(itemValue) => setUserId(itemValue)}
                style={{
                    height: 50,
                    width: '100%',
                    marginBottom: 20,
                    borderColor: '#ccc',
                    borderWidth: 1,
                    borderRadius: 5,
                }}
            >
                {userOptions.map((option) => (
                    <Picker.Item key={option.value} label={option.label} value={option.value} />
                ))}
            </Picker>
            <Button title="Remove User" onPress={handleRemoveUser} color="lightseagreen" />
            {message ? <Text style={{ marginTop: 20 }}>{message}</Text> : null}

            <View style={{ marginTop: 30 }}>
                <Button
                    title="See Removed Employees"
                    onPress={() => navigation.navigate('SeeRemovedEmployeesScreen')}
                    color="lightseagreen"
                />
            </View>
        </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'antiquewhite', // Background color
        padding: 20,
    },
   
});

