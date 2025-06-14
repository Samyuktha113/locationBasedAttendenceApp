import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator,TouchableOpacity, StyleSheet } from 'react-native';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../services/firebaseAuth'; // Adjust the path as needed
import Ionicons from 'react-native-vector-icons/Ionicons'; // Importing Ionicons for delete icon
import Icon from "react-native-vector-icons/FontAwesome";
export default function SeeRemovedEmployeesScreen({navigation}) {
    const [removedEmployees, setRemovedEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
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
    
    useEffect(() => {
         
        const fetchRemovedEmployees = async () => {
            try {
                const q = query(collection(db, 'removedEmployees'), orderBy('removedAt', 'desc'));
                const querySnapshot = await getDocs(q);

                const employees = [];
                querySnapshot.forEach((doc) => {
                    employees.push({ id: doc.id, ...doc.data() });
                });

                setRemovedEmployees(employees);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching removed employees:', error.message);
                setLoading(false);
            }
        };

        fetchRemovedEmployees();
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007bff" />
                <Text>Loading removed employees...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Removed Employees</Text>
            {removedEmployees.length === 0 ? (
                <Text style={styles.noDataText}>No removed employees to display.</Text>
            ) : (
                <FlatList
                    data={removedEmployees}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.employeeCard}>
                            <Text style={styles.employeeText}>
                                Name: {item.firstName || 'N/A'} {item.lastName || 'N/A'}
                            </Text>
                            <Text style={styles.employeeText}>ID: {item.id}</Text>
                            <Text style={styles.employeeText}>
                                Removed At: {item.removedAt ? new Date(item.removedAt.seconds * 1000).toLocaleString() : 'N/A'}
                            </Text>
                            <Text style={styles.employeeText}>
                                Total Experience: {item.experience}
                            </Text>
                        </View>
                    )}
                />
            )}
        </View>
    );
}

const calculateExperience = (createdAt, removedAt) => {
    if (!createdAt || !removedAt) return 'N/A';

    const createdDate = createdAt.seconds ? new Date(createdAt.seconds * 1000) : new Date(createdAt);
    const removedDate = removedAt.seconds ? new Date(removedAt.seconds * 1000) : new Date(removedAt);

    const diffInMs = removedDate - createdDate;
    if (diffInMs < 0) return 'Invalid dates';

    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    return `${Math.floor(diffInDays)} days`;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor:'antiquewhite'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    noDataText: {
        fontSize: 18,
        color: 'gray',
        textAlign: 'center',
    },
    employeeCard: {
        padding: 15,
        marginBottom: 10,
        backgroundColor: 'white',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    employeeText: {
        fontSize: 16,
        marginBottom: 5,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
