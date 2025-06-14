import React, {useEffect} from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome"; 

export default function LeaveManagementScreen({ navigation }) {
  // Handle navigation for Apply Leave
  const handleApplyLeave = () => {
    navigation.navigate('applyleavescreen');
  };

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

  // Handle navigation for Check Leave Status
  const handleCheckLeaveStatus = () => {
    navigation.navigate('CheckLeaveStatus');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leave Management</Text>
      
      <TouchableOpacity
        style={styles.button}
        onPress={handleApplyLeave}
      >
        <Text style={styles.buttonText}>Apply New Leave</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.button}
        onPress={handleCheckLeaveStatus}
      >
        <Text style={styles.buttonText}>Check Leave Status</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAEBD7', // Antique white background
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#444',
  },
  button: {
    backgroundColor: 'lightseagreen', // Light green button color
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
});
