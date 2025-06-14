import React, { useEffect } from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome";

export default function MarkAttendanceScreen({ navigation }) {
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
      <Text style={styles.title}>Mark Attendance</Text>

      <Button 
        title="Onsite Attendance" 
        onPress={() => navigation.navigate('OnsiteMarkAttendance')} 
        color="lightseagreen"
        style={styles.button} // Light Shagreen color for the button
      />
      
      <View style={styles.spacing} />

      <Button 
        title="Offsite Attendance" 
        onPress={() => navigation.navigate('OffsiteMarkAttendance')} 
        color="lightseagreen"
        style={styles.button} // Light Shagreen color for the button
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#faebd7", // Antique white background color
  },
  title: {
    fontSize: 24,
    marginBottom: 30,
    fontWeight: 'bold',
    color: '#000', // Black color for title text
  },
  spacing: {
    marginVertical: 15, // Add spacing between buttons
  },
  button: {
    width: '80%', // Adjust width for spaciousness
    padding: 15,
    backgroundColor: 'lightseagreen', // Light Shagreen button color
    borderRadius: 10, // Apply border radius
    marginBottom: 20, // Space between buttons
  },
  logoutIcon: {
    marginRight: 10,
  }
});
