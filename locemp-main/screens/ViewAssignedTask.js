import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, Alert, TouchableOpacity } from 'react-native';
import { db } from '../services/firebaseAuth';
import { collection, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import Icon from "react-native-vector-icons/FontAwesome";

const ViewAssignedTask = ({navigation}) => {
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [employeeIds, setEmployeeIds] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
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
  const fetchTasks = async () => {
    try {
      const employeeRef = collection(db, 'onsitework');
      const employeeSnapshot = await getDocs(employeeRef);

      let taskData = [];
      let empIdsSet = new Set();

      for (const docSnap of employeeSnapshot.docs) {
        const data = docSnap.data();
        const workDetails = data.workDetails || [];

        workDetails.forEach((task, index) => {
          taskData.push({
            id: `${docSnap.id}_${index}`, // Unique ID for each task
            employeeId: docSnap.id,
            location: task.location,
            details: task.details,
            date: task.date,
            reportingTime: task.reportingTime,
            status: task.status,
          });

          empIdsSet.add(docSnap.id);
        });
      }

      setAssignedTasks(taskData);
      setEmployeeIds([...empIdsSet]);
    } catch (error) {
      console.error('Error fetching tasks data: ', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleFilterChange = (selectedFilter) => {
    setFilter(selectedFilter);
  };

  const handleDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date.toISOString().split('T')[0]);
    }
  };
  const handleChangeStatus = async (task) => {
        Alert.alert(
          'Confirm Verification',
          `Are you sure you want to mark the task for Employee ID: ${task.employeeId} as Verified?`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Confirm',
              onPress: async () => {
                try {
                  const taskRef = doc(db, 'onsitework', task.employeeId);
                  const taskDoc = await getDoc(taskRef);
    
                  if (taskDoc.exists()) {
                    const data = taskDoc.data();
                    const updatedWorkDetails = data.workDetails.map((t) =>
                      t.details === task.details && t.date === task.date && t.reportingTime === task.reportingTime
                        ? { ...t, status: 'verified' }
                        : t
                    );
    
                    // Update the document with the modified workDetails array
                    await updateDoc(taskRef, {
                      workDetails: updatedWorkDetails,
                    });
    
                    // Update the local state
                    const updatedTasks = assignedTasks.map((t) =>
                      t.id === task.id ? { ...t, status: 'verified' } : t
                    );
                    setAssignedTasks(updatedTasks);
                  }
                } catch (error) {
                  console.error('Error updating status: ', error);
                }
              },
            },
          ]
        );
      };
  const clearDateSelection = () => {
    setSelectedDate(null);
  };

  const handleDeleteTask = (task) => {
    Alert.alert(
      'Confirm Deletion',
      `Are you sure you want to delete this task for Employee ID: ${task.employeeId}? This action is irreversible and will be permanently deleted. The Task will not get assigned to this employee.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              const taskRef = doc(db, 'onsitework', task.employeeId);
              const taskDoc = await getDoc(taskRef);

              if (taskDoc.exists()) {
                const data = taskDoc.data();
                const updatedWorkDetails = (data.workDetails || []).filter(
                  (t) =>
                    t.details !== task.details ||
                    t.date !== task.date ||
                    t.reportingTime !== task.reportingTime
                );

                await updateDoc(taskRef, {
                  workDetails: updatedWorkDetails,
                });

                const updatedTasks = assignedTasks.filter((t) => t.id !== task.id);
                setAssignedTasks(updatedTasks);

                Alert.alert('Task Deleted', 'The task has been successfully deleted.');
              } else {
                console.error('Document does not exist.');
              }
            } catch (error) {
              console.error('Error deleting task: ', error);
            }
          },
        },
      ]
    );
  };

  const filteredTasks = assignedTasks.filter((task) => {
    const matchesEmployee = filter === 'all' || task.employeeId === filter;
    const matchesDate = !selectedDate || task.date === selectedDate;
    return matchesEmployee && matchesDate;
  });

  const sortedTasks = filteredTasks.sort((a, b) => new Date(b.date) - new Date(a.date));

  const formatTime = (reportingTime) => {
    const date = new Date(reportingTime);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusWordColor = (status) => {
    if (status === 'pending') {
      return { color: 'red' };
    } else if (status === 'verified' || status === 'completed') {
      return { color: 'green' };
    }
    return { color: 'black' };
  };

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.text}>Employee ID: {item.employeeId}</Text>
      <Text style={styles.text}>Location: {item.location}</Text>
      <Text style={styles.text}>Details: {item.details}</Text>
      <Text style={styles.text}>Date: {item.date}</Text>
      <Text style={styles.text}>Reporting Time: {formatTime(item.reportingTime)}</Text>
      <Text style={styles.text}>
        Status: <Text style={getStatusWordColor(item.status)}>{item.status}</Text>
      </Text>
      {(item.status === 'pending' || item.status === 'completed') && (
        <TouchableOpacity
          style={styles.verifyButton}
          onPress={() => handleChangeStatus(item)}
        >
          <Text style={styles.buttonText}>Mark as Verified</Text>
        </TouchableOpacity>
      )}
      {item.status === 'pending' && (
        <TouchableOpacity
          style={styles.deleteIcon}
          onPress={() => handleDeleteTask(item)}
        >
          <Ionicons name="trash" size={24} color="red" />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>View Assigned Tasks</Text>

      <Picker
        selectedValue={filter}
        style={styles.picker}
        onValueChange={handleFilterChange}
      >
        <Picker.Item label="All Tasks" value="all" />
        {employeeIds.map((empId) => (
          <Picker.Item key={empId} label={`${empId}`} value={empId} />
        ))}
      </Picker>

      <View style={styles.dateFilter}>
        <Button 
           title="Select Date" 
           onPress={() => setShowDatePicker(true)} 
            color="lightseagreen"
           />
        <Text style={styles.selectedDate}>
          {selectedDate ? `${selectedDate}` : 'No Date Selected'}
        </Text>
        {selectedDate && (
          <Text style={styles.clearDate} onPress={clearDateSelection}>
            Clear Date
          </Text>
        )}
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      {sortedTasks.length === 0 ? (
        <Text style={styles.noDataText}>No data is available for the selected filters.</Text>
      ) : (
        <FlatList
          data={sortedTasks}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'antiquewhite',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    padding: 15,
    borderBottomWidth: 4,
    borderBottomColor: '#ddd',
    position: 'relative',
    backgroundColor:'white',
    borderRadius:10,
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
    backgroundColor: 'antiquewhite',
    borderRadius: 5,
  },
  dateFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  selectedDate: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  clearDate: {
    marginLeft: 10,
    fontSize: 14,
    color: '#555',
    textDecorationLine: 'underline',
  },
  noDataText: {
    fontSize: 18,
    color: '#777',
    textAlign: 'center',
    marginTop: 20,
  },
  verifyButton: {
    marginTop: 10,
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    backgroundColor:'lightseagreen'
  },
  deleteIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  
});

export default ViewAssignedTask;
