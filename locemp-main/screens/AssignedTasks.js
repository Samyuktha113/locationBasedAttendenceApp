import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext'; // Adjust as needed
import { db } from '../services/firebaseAuth'; // Adjust as needed
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import Icon from "react-native-vector-icons/FontAwesome"; 


export default function AssignedTasks({navigation}) {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
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
    const fetchAssignedTasks = async () => {
      if (user?.eid) {
        try {
          const onsiteWorkRef = doc(db, 'onsitework', user.eid);
          const onsiteWorkDoc = await getDoc(onsiteWorkRef);

          if (onsiteWorkDoc.exists()) {
            const workDetails = onsiteWorkDoc.data().workDetails;
            setTasks(workDetails);
          } else {
            setTasks([]);
          }
        } catch (error) {
          console.error('Error fetching tasks:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAssignedTasks();
  }, [user?.eid]);

  const handleToggleCompletion = async (task) => {
    if (task.status === 'verified') {
      Alert.alert('Task Verified', 'This task has already been verified by the manager.');
      return;
    }

    const newStatus = task.status === 'pending' ? 'completed' : 'pending';

    try {
      const onsiteWorkRef = doc(db, 'onsitework', user.eid);
      const onsiteWorkDoc = await getDoc(onsiteWorkRef);

      if (onsiteWorkDoc.exists()) {
        const workDetails = onsiteWorkDoc.data().workDetails;
        const updatedTasks = workDetails.map((t) => {
          if (t.date === task.date && t.reportingTime === task.reportingTime) {
            return { ...t, status: newStatus };
          }
          return t;
        });

        await updateDoc(onsiteWorkRef, { workDetails: updatedTasks });
        setTasks(updatedTasks);
        Alert.alert('Success', `Task marked as ${newStatus}.`);
      }
    } catch (error) {
      console.error('Error updating task:', error);
      Alert.alert('Error', 'Could not update the task.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Assigned Tasks</Text>

      {tasks.length === 0 ? (
        <Text style={styles.noTasksText}>No tasks assigned yet.</Text>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.taskItem}>
              <Text style={styles.taskText}>
                <Text style={styles.boldText}>Location:</Text> {item.location}
              </Text>
              <Text style={styles.taskText}>
                <Text style={styles.boldText}>Details:</Text> {item.details}
              </Text>
              <Text style={styles.taskText}>
                <Text style={styles.boldText}>Date:</Text> {item.date}
              </Text>
              <Text style={styles.taskText}>
                <Text style={styles.boldText}>Reporting Time:</Text>{' '}
                {new Date(item.reportingTime).toLocaleTimeString()}
              </Text>

              {/* Display status */}
              <Text style={styles.taskText}>
                <Text style={styles.boldText}>Status:</Text> {item.status}
              </Text>

              {/* Button based on status */}
              <TouchableOpacity
                style={[
                  styles.button,
                  item.status === 'verified'
                    ? styles.verifiedButton
                    : item.status === 'completed'
                    ? styles.pendingVerificationButton
                    : styles.pendingWorkButton,
                ]}
                onPress={() => {
                  if (item.status === 'verified') {
                    Alert.alert(
                      'Task Verified',
                      'This task has already been verified by the manager.'
                    );
                  } else {
                    handleToggleCompletion(item);
                  }
                }}
              >
                <Text style={styles.buttonText}>
                  {item.status === 'verified'
                    ? 'Verified'
                    : item.status === 'completed'
                    ? 'Verification Pending'
                    : 'Pending Work'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  noTasksText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#888',
  },
  taskItem: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation:10,
  },
  taskText: {
    fontSize: 16,
    marginVertical: 5,
  },
  boldText: {
    fontWeight: 'bold',
  },
  button: {
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  pendingWorkButton: {
    backgroundColor: '#f39c12',
  },
  pendingVerificationButton: {
    backgroundColor: '#3498db',
  },
  verifiedButton: {
    backgroundColor: '#27ae60',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
