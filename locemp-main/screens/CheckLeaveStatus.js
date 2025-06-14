import { View, Text, StyleSheet, FlatList, Alert, TouchableOpacity } from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useEmployee } from '../context/EmployeeContext'; // Ensure this is the correct path
import { db } from '../services/firebaseAuth'; // Ensure this imports your Firestore configuration
import { MaterialIcons } from '@expo/vector-icons';
import Icon from "react-native-vector-icons/FontAwesome"; 

export default function CheckLeaveStatus({navigation}) {
  const { employeeData } = useEmployee(); // Access employee data from context
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);


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

  const eid = employeeData?.eid; // Employee ID from context

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      if (!eid) {
        Alert.alert('Error', 'Employee ID is missing. Please log in again or contact support.');
        return;
      }

      try {
        const leaveDoc = await getDoc(doc(db, 'leaveRequests', eid));
        if (leaveDoc.exists()) {
          const leaveData = leaveDoc.data();
          if (leaveData.leaves && Array.isArray(leaveData.leaves)) {
            // Sort leave requests by `appliedAt` date (descending order)
            const sortedLeaves = leaveData.leaves.sort(
              (a, b) => new Date(b.appliedAt) - new Date(a.appliedAt)
            );
            setLeaveRequests(sortedLeaves); // Set sorted leave requests
          } else {
            Alert.alert('No Leave Requests', 'No leave requests found for this employee.');
          }
        } else {
          Alert.alert('Error', 'No leave record found for this employee.');
        }
      } catch (error) {
        Alert.alert('Error', `Failed to fetch leave requests: ${error.message}`);
      } finally {
        setIsLoading(false); // Stop the loading spinner
      }
    };

    fetchLeaveRequests();
  }, [eid]);

  const handleDelete = async (leaveIndex) => {
    Alert.alert(
      'Confirm Deletion',
      'This leave request will be permanently deleted and will not be visible to the manager for approval. Do you want to proceed?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedLeaves = [...leaveRequests];
              updatedLeaves.splice(leaveIndex, 1); // Remove the selected leave request

              await updateDoc(doc(db, 'leaveRequests', eid), {
                leaves: updatedLeaves,
              });

              setLeaveRequests(updatedLeaves); // Update the state
              Alert.alert('Success', 'Leave request deleted successfully.');
            } catch (error) {
              Alert.alert('Error', `Failed to delete leave request: ${error.message}`);
            }
          },
        },
      ]
    );
  };

  const renderLeaveItem = ({ item, index }) => (
    <View style={styles.leaveCard}>
      <Text style={styles.leaveText}>
        <Text style={styles.label}>Leave Type:</Text> {item.leaveType}
      </Text>
      <Text style={styles.leaveText}>
        <Text style={styles.label}>Start Date:</Text> {new Date(item.startDate).toLocaleDateString()}
      </Text>
      <Text style={styles.leaveText}>
        <Text style={styles.label}>End Date:</Text> {new Date(item.endDate).toLocaleDateString()}
      </Text>
      <Text style={styles.leaveText}>
        <Text style={styles.label}>Reason:</Text> {item.reason}
      </Text>
      <Text style={styles.leaveText}>
        <Text style={styles.label}>Status:</Text> {item.status}
      </Text>
      {item.status === 'Pending' && (
        <TouchableOpacity
          style={styles.deleteIcon}
          onPress={() => handleDelete(index)}
        >
          <MaterialIcons name="delete" size={24} color="red" />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Check Leave Status</Text>
      {isLoading ? (
        <Text style={styles.loadingText}>Loading leave requests...</Text>
      ) : leaveRequests.length > 0 ? (
        <FlatList
          data={leaveRequests}
          renderItem={renderLeaveItem}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <Text style={styles.noLeaveText}>No leave requests found.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'antiquewhite',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  leaveCard: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: 'white',
    position: 'relative',
    elevation:5,
  },
  leaveText: {
    fontSize: 16,
    marginVertical: 5,
  },
  label: {
    fontWeight: 'bold',
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  noLeaveText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  deleteIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});
