import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity,StyleSheet } from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebaseAuth";
import { useEmployee } from "../context/EmployeeContext";
import Icon from "react-native-vector-icons/FontAwesome"; 

export default function EmployeeRemarks({navigation}) {
  const { employeeData } = useEmployee(); // Get employee data (contains eid)
  const [remarks, setRemarks] = useState([]);
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
    if (employeeData?.eid) {
      fetchRemarks();
    }
  }, [employeeData]);

  const fetchRemarks = async () => {
    try {
      const employeeRef = doc(db, "employees", employeeData.eid);
      const docSnap = await getDoc(employeeRef);

      if (docSnap.exists()) {
        const employee = docSnap.data();
        setRemarks(employee.remarks || []); // Use empty array if no remarks
      } else {
        console.error("No such document!");
      }
    } catch (error) {
      console.error("Error fetching remarks: ", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (remarks.length === 0) {
    return (
      <View style={styles.center}>
        <Text>No remarks available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Remarks</Text>
      <FlatList
        data={remarks}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.remarkCard}>
            <Text style={styles.remarkText}>Remark : {item.remark}</Text>
            <Text style={styles.managerText}>Manager : {item.managerName}</Text>
            <Text style={styles.dateText}>Date : {new Date(item.datePosted).toLocaleDateString()}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "antiquewhite",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  remarkCard: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    elevation: 5,
  },
  remarkText: {
    fontSize: 16,
    fontWeight:'bold',
    marginBottom: 4,
  },
  managerText: {
    fontSize: 14,
    color: "#555",
  },
  dateText: {
    fontSize: 12,
    color: "#888",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
