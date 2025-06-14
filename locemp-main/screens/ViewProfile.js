import React,{useEffect} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useEmployee } from '../context/EmployeeContext';
import Icon from "react-native-vector-icons/FontAwesome"; // Import the context
import Ionicons from 'react-native-vector-icons/Ionicons'; // For icons

export default function ViewProfile({navigation}) {
    const { employeeData } = useEmployee(); // Get employee data from the global context

    if (!employeeData) {
        return <Text style={styles.loadingText}>Loading...</Text>; // Handle loading state
    }


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
    
    return (
        <View style={styles.container}>
            <View style={styles.profileContainer}>
                {/* Profile Picture */}
                <Image
                    source={{ uri: employeeData.profilePhoto || 'https://via.placeholder.com/150' }} // Fallback if no photo
                    style={styles.profilePicture}
                />
                <Text style={styles.title}>Your Profile</Text>
            </View>

            <View style={styles.detailsContainer}>
                <DetailCard icon="person" label="Name" value={`${employeeData.firstName} ${employeeData.lastName}`} />
                <DetailCard icon="briefcase" label="Position" value={employeeData.position} />
                <DetailCard icon="calendar" label="Date of Birth" value={employeeData.dateOfBirth} />
                <DetailCard icon="call" label="Contact Number" value={employeeData.contact} />
                <DetailCard icon="location" label="Address" value={employeeData.address} />
                <DetailCard icon="location" label="Onsite Address" value={employeeData.onsiteAddress} />
            </View>

            
        </View>
    );
}

const DetailCard = ({ icon, label, value }) => {
    return (
        <View style={styles.card}>
            <Ionicons name={icon} size={24} color="lightseagreen" style={styles.icon} />
            <View style={styles.cardTextContainer}>
                <Text style={styles.cardLabel}>{label}</Text>
                <Text style={styles.cardValue}>{value}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'antiquewhite', // Background color
        padding: 20,
    },
    profileContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    // profilePicture: {
    //     width: 120,
    //     height: 120,
    //     borderRadius: 60, // Circular profile picture
    //     marginBottom: 15,
    // },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: 'black', // Profile title color
    },
    detailsContainer: {
        marginTop: 20,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        elevation: 5, // Add shadow for elevation effect
        borderLeftWidth: 5,
        borderLeftColor: 'lightseagreen', // Highlight with left border
    },
    icon: {
        marginRight: 15,
    },
    cardTextContainer: {
        flex: 1,
    },
    cardLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'lightseagreen', // Label color
    },
    cardValue: {
        fontSize: 14,
        color: '#333', // Value color
        marginTop: 5,
    },
    editButton: {
        backgroundColor: 'lightseagreen',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 30,
        marginTop: 30,
        alignSelf: 'center',
        width: '60%',
        alignItems: 'center',
    },
    editButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loadingText: {
        textAlign: 'center',
        fontSize: 18,
        color: 'lightseagreen',
        marginTop: 20,
    },
});
