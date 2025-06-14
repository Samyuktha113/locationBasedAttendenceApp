import React, { useEffect, useState } from 'react'; 
import { Button, Text, TextInput, View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../services/firebaseAuth';
import DateTimePicker from '@react-native-community/datetimepicker'; 
import { Platform } from 'react-native'; 
import Icon from "react-native-vector-icons/FontAwesome";  // Import Firestore functions


export default function ModifyScreen({ route, navigation }) {
    const { id } = route.params; // Get the employee ID from navigation params
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [employeeId, setEmployeeId] = useState('');
    const [email, setEmail] = useState('');
    const [dob, setDob] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [position, setPosition] = useState('');
    const [salary, setSalary] = useState('');
    const [address, setAddress] = useState('');
    const [onsiteAddress, setOnsiteAddress] = useState('');
    const [contact, setContact] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);


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
    

    // Fetch the employee data from Firestore
    const fetchEmployeeData = async () => {
        const employeeDoc = await getDoc(doc(db, 'employees', id));
        if (employeeDoc.exists()) {
            const data = employeeDoc.data();
            setFirstName(data.firstName);
            setLastName(data.lastName);
            setEmployeeId(data.eid);
            setEmail(data.email);
            setDob(new Date(data.dateOfBirth)); // Ensure the date is a Date object
            setPosition(data.position);
            setSalary(data.salary);
            setAddress(data.address);
            setOnsiteAddress(data.onsiteAddress);
            setContact(data.contact);
        } else {
            console.error("No such document!");
        }
        
    };

    useEffect(() => {

        fetchEmployeeData();
    }, [id]);

    const handleModify = async () => {
        setError('');
        setLoading(true);

        // Validate inputs
        if (!firstName || !lastName || !employeeId || !email || !dob || !position || !salary || !address || !contact || !onsiteAddress) {
            setError('All fields are required');
            setLoading(false);
            return;
        }

        try {
            // Update the employee details in Firestore
            await setDoc(doc(db, 'employees', employeeId), {
                firstName,
                lastName,
                email,
                dateOfBirth: dob.toISOString().split('T')[0], // Format date
                eid: employeeId,
                position,
                salary,
                address,
                onsiteAddress,
                contact,
                updatedAt: new Date(), // Optionally track updates
            });

            navigation.navigate('PersonDetails');  // Navigate back to EmployeeDetails screen
        } catch (error) {
            console.error("Error during modification: ", error);
            setError(error.message);  // Show error message
        } finally {
            setLoading(false);
        }
    };

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || dob;
        setShowDatePicker(Platform.OS === 'ios');
        setDob(currentDate);
    };

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", alignItems: "center",backgroundColor:"antiquewhite" }}>
            <Text className="text-3xl font-bold  mb-4">Modify Employee</Text>

            <TextInput
                value={firstName}
                onChangeText={setFirstName}
                placeholder="First Name"
                className="border border-gray-300 w-64 p-3 mb-4 rounded-md"
            />
            <TextInput
                value={lastName}
                onChangeText={setLastName}
                placeholder="Last Name"
                className="border border-gray-300 w-64 p-3 mb-4 rounded-md"
            />
            <TextInput
                value={employeeId}
                editable={false} // Make Employee ID non-editable
                placeholder="Employee ID"
                className="border border-gray-300 w-64 p-3 mb-4 rounded-md"
            />
            <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                className="border border-gray-300 w-64 p-3 mb-4 rounded-md"
            />

            {/* Date of Birth Field with DateTimePicker */}
            <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                className="border border-gray-300 w-64 p-3 mb-4 rounded-md"
            >
                <Text className="text-gray-500">{dob ? dob.toISOString().split('T')[0] : 'Date of Birth (YYYY-MM-DD)'}</Text>
            </TouchableOpacity>

            {showDatePicker && (
                <DateTimePicker
                    value={dob}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                    maximumDate={new Date()} 
                />
            )}

            <TextInput
                value={position}
                onChangeText={setPosition}
                placeholder="Position"
                className="border border-gray-300 w-64 p-3 mb-4 rounded-md"
            />
            <TextInput
                value={salary}
                onChangeText={setSalary}
                placeholder="Salary"
                keyboardType="numeric"
                className="border border-gray-300 w-64 p-3 mb-4 rounded-md"
            />
            <TextInput
                value={address}
                onChangeText={setAddress}
                placeholder="Address (offsite)"
                className="border border-gray-300 w-64 p-3 mb-4 rounded-md"
            />
            <TextInput
                value={onsiteAddress}
                onChangeText={setOnsiteAddress}
                placeholder="Onsite Address"
                className="border border-gray-300 w-64 p-3 mb-4 rounded-md"
            />
            <TextInput
                value={contact}
                onChangeText={setContact}
                placeholder="Contact"
                keyboardType="phone-pad"
                className="border border-gray-300 w-64 p-3 mb-4 rounded-md"
            />

            <Button 
                title={loading ? "Modifying..." : "Modify"} 
                onPress={handleModify} 
                color="lightseagreen" 
                disabled={loading} 
            />
            {error && <Text className="text-red-500 mt-4">{error}</Text>}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    logoutIcon: {
         // Add spacing around the icon
        padding: 10, // Optional padding for better touch area
    },
});