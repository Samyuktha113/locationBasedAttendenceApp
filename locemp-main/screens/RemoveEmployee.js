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

