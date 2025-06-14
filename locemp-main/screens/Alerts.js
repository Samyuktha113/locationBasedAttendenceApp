import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet,TouchableOpacity } from 'react-native';
import { db } from '../services/firebaseAuth'; // Import Firestore db
import { collection, getDocs } from 'firebase/firestore';
import Icon from "react-native-vector-icons/FontAwesome";  // Import Firestore functions

const AdminAlertsScreen = ({navigation}) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
    // Fetch alerts from Firestore
    const fetchAlerts = async () => {
      try {
        const alertsCollection = collection(db, 'alerts'); // Fetch the 'alerts' collection
        const alertsSnapshot = await getDocs(alertsCollection); // Get all documents from the collection
        const alertsList = alertsSnapshot.docs.map(doc => ({
          id: doc.id, 
          ...doc.data(),
        }));
        setAlerts(alertsList); // Set the alerts data into state
      } catch (err) {
        setError('Failed to load alerts.');
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  // Render each alert item in the list
  const renderAlertItem = ({ item }) => (
    <View style={styles.alertCard}>
      <Text style={styles.alertTitle}>{item.type}</Text>
      <Text style={styles.alertDescription}>{item.description}</Text>
      <Text style={styles.alertTimestamp}>
        {new Date(item.timestamp.seconds * 1000).toLocaleString()}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading alerts...</Text>
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <>
          <Text style={styles.header}>Admin Alerts</Text>
          <FlatList
            data={alerts}
            renderItem={renderAlertItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.alertList}
          />
        </>
      )}
    </View>
  );
};

// Styles for the Admin Alerts Screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'antiquewhite',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign:'center',
  },
  alertList: {
    paddingBottom: 20,
  },
  alertCard: {
    padding: 16,
    marginBottom: 12,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation:5,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  alertDescription: {
    fontSize: 14,
    marginVertical: 8,
  },
  alertTimestamp: {
    fontSize: 12,
    color: '#555',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});

export default AdminAlertsScreen;
