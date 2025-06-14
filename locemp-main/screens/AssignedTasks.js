// import React, { useEffect, useState, useContext } from 'react';
// import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
// import { AuthContext } from '../context/AuthContext'; // Adjust the import path as needed
// import { db } from '../services/firebaseAuth'; // Adjust the path as needed
// import { doc, getDoc } from 'firebase/firestore';

// // Component to display assigned tasks
// export default function AssignedTasks() {
//   const { user } = useContext(AuthContext);  // Retrieve user context to get the employee ID
//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(true);
  
//   useEffect(() => {
//     const fetchAssignedTasks = async () => {
//       if (user?.eid) {
//         try {
//           // Fetch tasks from the onsitework collection for the logged-in employee
//           const onsiteWorkRef = doc(db, 'onsitework', user.eid);
//           const onsiteWorkDoc = await getDoc(onsiteWorkRef);
          
//           if (onsiteWorkDoc.exists()) {
//             const workDetails = onsiteWorkDoc.data().workDetails;
            
//             // Sort the tasks by date (recent to last)
//             const sortedTasks = workDetails.sort((a, b) => {
//               const dateA = new Date(a.date);
//               const dateB = new Date(b.date);
//               return dateB - dateA; // Descending order
//             });

//             // Set the tasks to the state
//             setTasks(sortedTasks);
//           } else {
//             setTasks([]);
//           }
//         } catch (error) {
//           console.error('Error fetching tasks:', error);
//         } finally {
//           setLoading(false);
//         }
//       }
//     };
    
//     fetchAssignedTasks();
//   }, [user?.eid]); // Re-fetch when user ID changes

//   if (loading) {
//     return (
//       <View style={styles.container}>
//         <ActivityIndicator size="large" color="#0000ff" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Assigned Tasks</Text>

//       {/* Check if there are no tasks assigned */}
//       {tasks.length === 0 ? (
//         <Text style={styles.noTasksText}>No tasks assigned yet.</Text>
//       ) : (
//         <FlatList
//           data={tasks}
//           keyExtractor={(item, index) => index.toString()}
//           renderItem={({ item }) => (
//             <View style={styles.taskItem}>
//               <Text style={styles.taskText}>
//                 <Text style={styles.boldText}>Location: </Text>{item.location}
//               </Text>
//               <Text style={styles.taskText}>
//                 <Text style={styles.boldText}>Details: </Text>{item.details}
//               </Text>
//               <Text style={styles.taskText}>
//                 <Text style={styles.boldText}>Date: </Text>{item.date}
//               </Text>
//               <Text style={styles.taskText}>
//                 <Text style={styles.boldText}>Reporting Time: </Text>{new Date(item.reportingTime).toLocaleTimeString()}
//               </Text>
//             </View>
//           )}
//         />
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   noTasksText: {
//     textAlign: 'center',
//     fontSize: 18,
//     color: '#888',
//   },
//   taskItem: {
//     marginBottom: 20,
//     padding: 10,
//     backgroundColor: '#f9f9f9',
//     borderRadius: 5,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//   },
//   taskText: {
//     fontSize: 16,
//     marginBottom: 5,
//   },
//   boldText: {
//     fontWeight: 'bold',
//   },
// });




// import React, { useEffect, useState, useContext } from 'react';
// import { View, Text, StyleSheet, FlatList, Button, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
// import { AuthContext } from '../context/AuthContext'; // Adjust the import path as needed
// import { db } from '../services/firebaseAuth'; // Adjust the path as needed
// import { doc, getDoc, updateDoc } from 'firebase/firestore';

// // Component to display assigned tasks
// export default function AssignedTasks() {
//   const { user } = useContext(AuthContext);  // Retrieve user context to get the employee ID
//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(true);
  
//   useEffect(() => {
//     const fetchAssignedTasks = async () => {
//       if (user?.eid) {
//         try {
//           // Fetch tasks from the onsitework collection for the logged-in employee
//           const onsiteWorkRef = doc(db, 'onsitework', user.eid);
//           const onsiteWorkDoc = await getDoc(onsiteWorkRef);
          
//           if (onsiteWorkDoc.exists()) {
//             const workDetails = onsiteWorkDoc.data().workDetails;
            
//             // Sort the tasks by date (recent to last)
//             const sortedTasks = workDetails.sort((a, b) => {
//               const dateA = new Date(a.date);
//               const dateB = new Date(b.date);
//               return dateB - dateA; // Descending order
//             });

//             // Set the tasks to the state
//             setTasks(sortedTasks);
//           } else {
//             setTasks([]);
//           }
//         } catch (error) {
//           console.error('Error fetching tasks:', error);
//         } finally {
//           setLoading(false);
//         }
//       }
//     };
    
//     fetchAssignedTasks();
//   }, [user?.eid]); // Re-fetch when user ID changes

//   const handleTaskCompletion = (task, status) => {
//     // Prompt the user to confirm the completion status
//     Alert.alert(
//       "Task Completion Status",
//       `Are you sure you want to mark this task as ${status}?`,
//       [
//         { text: "Cancel", onPress: () => console.log("Cancel pressed"), style: "cancel" },
//         { text: "OK", onPress: () => updateTaskStatus(task, status) }
//       ]
//     );
//   };

//   const updateTaskStatus = async (task, status) => {
//     try {
//       // Retrieve the employee's onsite work document from Firestore
//       const onsiteWorkRef = doc(db, 'onsitework', user.eid);
//       const onsiteWorkDoc = await getDoc(onsiteWorkRef);
      
//       if (onsiteWorkDoc.exists()) {
//         const workDetails = onsiteWorkDoc.data().workDetails;
        
//         // Find the task and update its completion status
//         const taskIndex = workDetails.findIndex(t => t.date === task.date && t.reportingTime === task.reportingTime);
        
//         if (taskIndex !== -1) {
//           workDetails[taskIndex].completed = status;

//           // Update the Firestore document with the new completion status
//           await updateDoc(onsiteWorkRef, {
//             workDetails: workDetails
//           });

//           // Refresh the tasks list with the updated status
//           setTasks([...workDetails]);

//           Alert.alert("Success", `Task marked as ${status} successfully.`);
//         }
//       }
//     } catch (error) {
//       console.error('Error updating task status:', error);
//       Alert.alert("Error", "Failed to update the task status. Please try again.");
//     }
//   };

//   if (loading) {
//     return (
//       <View style={styles.container}>
//         <ActivityIndicator size="large" color="#0000ff" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Assigned Tasks</Text>

//       {/* Check if there are no tasks assigned */}
//       {tasks.length === 0 ? (
//         <Text style={styles.noTasksText}>No tasks assigned yet.</Text>
//       ) : (
//         <FlatList
//           data={tasks}
//           keyExtractor={(item, index) => index.toString()}
//           renderItem={({ item }) => (
//             <View
//               style={[
//                 styles.taskItem,
//                 item.completed ? styles.completedTask : styles.incompleteTask
//               ]}
//             >
//               <Text style={styles.taskText}>
//                 <Text style={styles.boldText}>Location: </Text>{item.location}
//               </Text>
//               <Text style={styles.taskText}>
//                 <Text style={styles.boldText}>Details: </Text>{item.details}
//               </Text>
//               <Text style={styles.taskText}>
//                 <Text style={styles.boldText}>Date: </Text>{item.date}
//               </Text>
//               <Text style={styles.taskText}>
//                 <Text style={styles.boldText}>Reporting Time: </Text>{new Date(item.reportingTime).toLocaleTimeString()}
//               </Text>
//               <Text style={styles.taskText}>
//                 <Text style={styles.boldText}>Completion Status: </Text>{item.completed ? "Completed" : "Not Completed"}
//               </Text>

//               {/* Button to mark task as completed or not completed */}
//               <TouchableOpacity
//                 style={[styles.button, item.completed ? styles.greenButton : styles.redButton]}
//                 onPress={() => handleTaskCompletion(item, item.completed ? "Not Completed" : "Completed")}
//               >
//                 <Text style={styles.buttonText}>{item.completed ? "Completed" : "Pending Work"}</Text>
//               </TouchableOpacity>
//             </View>
//           )}
//         />
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#f5f5f5',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   noTasksText: {
//     textAlign: 'center',
//     fontSize: 18,
//     color: '#888',
//   },
//   taskItem: {
//     marginBottom: 20,
//     padding: 15,
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//   },
//   completedTask: {
//     borderLeftWidth: 5,
//     borderLeftColor: 'green',
//   },
//   incompleteTask: {
//     borderLeftWidth: 5,
//     borderLeftColor: '#f1c40f', // Yellow for incomplete tasks
//   },
//   taskText: {
//     fontSize: 16,
//     marginBottom: 5,
//   },
//   boldText: {
//     fontWeight: 'bold',
//   },
//   button: {
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     borderRadius: 5,
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   greenButton: {
//     backgroundColor: 'green',
//   },
//   redButton: {
//     backgroundColor: 'red',
//   },
//   buttonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
// });



// import React, { useEffect, useState, useContext } from 'react';
// import { View, Text, StyleSheet, FlatList, Button, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
// import { AuthContext } from '../context/AuthContext'; // Adjust the import path as needed
// import { db } from '../services/firebaseAuth'; // Adjust the path as needed
// import { doc, getDoc, updateDoc } from 'firebase/firestore';

// // Component to display assigned tasks
// export default function AssignedTasks() {
//   const { user } = useContext(AuthContext);  // Retrieve user context to get the employee ID
//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(true);
  
//   useEffect(() => {
//     const fetchAssignedTasks = async () => {
//       if (user?.eid) {
//         try {
//           // Fetch tasks from the onsitework collection for the logged-in employee
//           const onsiteWorkRef = doc(db, 'onsitework', user.eid);
//           const onsiteWorkDoc = await getDoc(onsiteWorkRef);
          
//           if (onsiteWorkDoc.exists()) {
//             const workDetails = onsiteWorkDoc.data().workDetails;
            
//             // Sort the tasks by date (recent to last)
//             const sortedTasks = workDetails.sort((a, b) => {
//               const dateA = new Date(a.date);
//               const dateB = new Date(b.date);
//               return dateB - dateA; // Descending order
//             });

//             // Set the tasks to the state
//             setTasks(sortedTasks);
//           } else {
//             setTasks([]);
//           }
//         } catch (error) {
//           console.error('Error fetching tasks:', error);
//         } finally {
//           setLoading(false);
//         }
//       }
//     };
    
//     fetchAssignedTasks();
//   }, [user?.eid]); // Re-fetch when user ID changes

//   const handleTaskCompletion = (task, status) => {
//     // Check if the task is verified
//     if (task.verified) {
//       Alert.alert("Error", "This task has already been verified and cannot be modified.");
//       return;
//     }

//     // Prompt the user to confirm the completion status
//     Alert.alert(
//       "Task Completion Status",
//       `Are you sure you want to mark this task as ${status}?`,
//       [
//         { text: "Cancel", onPress: () => console.log("Cancel pressed"), style: "cancel" },
//         { text: "OK", onPress: () => updateTaskStatus(task, status) }
//       ]
//     );
//   };

//   const updateTaskStatus = async (task, status) => {
//     try {
//       // Retrieve the employee's onsite work document from Firestore
//       const onsiteWorkRef = doc(db, 'onsitework', user.eid);
//       const onsiteWorkDoc = await getDoc(onsiteWorkRef);
      
//       if (onsiteWorkDoc.exists()) {
//         const workDetails = onsiteWorkDoc.data().workDetails;
        
//         // Find the task and update its completion status
//         const taskIndex = workDetails.findIndex(t => t.date === task.date && t.reportingTime === task.reportingTime);
        
//         if (taskIndex !== -1) {
//           // Update task status and mark it as "Verification Pending"
//           workDetails[taskIndex].completed = status === "Completed";
//           if (status === "Completed") {
//             workDetails[taskIndex].verified = false; // If completed, it's pending verification
//           }

//           // Update the Firestore document with the new completion status
//           await updateDoc(onsiteWorkRef, {
//             workDetails: workDetails
//           });

//           // Refresh the tasks list with the updated status
//           setTasks([...workDetails]);

//           Alert.alert("Success", `Task marked as ${status} successfully.`);
//         }
//       }
//     } catch (error) {
//       console.error('Error updating task status:', error);
//       Alert.alert("Error", "Failed to update the task status. Please try again.");
//     }
//   };

//   if (loading) {
//     return (
//       <View style={styles.container}>
//         <ActivityIndicator size="large" color="#0000ff" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Assigned Tasks</Text>

//       {/* Check if there are no tasks assigned */}
//       {tasks.length === 0 ? (
//         <Text style={styles.noTasksText}>No tasks assigned yet.</Text>
//       ) : (
//         <FlatList
//           data={tasks}
//           keyExtractor={(item, index) => index.toString()}
//           renderItem={({ item }) => (
//             <View
//               style={[
//                 styles.taskItem,
//                 item.completed ? styles.completedTask : styles.incompleteTask
//               ]}
//             >
//               <Text style={styles.taskText}>
//                 <Text style={styles.boldText}>Location: </Text>{item.location}
//               </Text>
//               <Text style={styles.taskText}>
//                 <Text style={styles.boldText}>Details: </Text>{item.details}
//               </Text>
//               <Text style={styles.taskText}>
//                 <Text style={styles.boldText}>Date: </Text>{item.date}
//               </Text>
//               <Text style={styles.taskText}>
//                 <Text style={styles.boldText}>Reporting Time: </Text>{new Date(item.reportingTime).toLocaleTimeString()}
//               </Text>
//               <Text style={styles.taskText}>
//                 <Text style={styles.boldText}>Completion Status: </Text>{item.completed ? (item.verified ? "Verified" : "Verification Pending") : "Not Completed"}
//               </Text>

//               {/* Button to mark task as completed or not completed */}
//               <TouchableOpacity
//                 style={[styles.button, item.completed ? styles.greenButton : styles.redButton]}
//                 onPress={() => handleTaskCompletion(item, item.completed ? "Not Completed" : "Completed")}
//                 disabled={item.verified} // Disable if verified
//               >
//                 <Text style={styles.buttonText}>{item.completed ? "Completed" : "Pending Work"}</Text>
//               </TouchableOpacity>
//             </View>
//           )}
//         />
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#f5f5f5',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   noTasksText: {
//     textAlign: 'center',
//     fontSize: 18,
//     color: '#888',
//   },
//   taskItem: {
//     marginBottom: 20,
//     padding: 15,
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//   },
//   completedTask: {
//     borderLeftWidth: 5,
//     borderLeftColor: 'green',
//   },
//   incompleteTask: {
//     borderLeftWidth: 5,
//     borderLeftColor: '#f1c40f', // Yellow for incomplete tasks
//   },
//   taskText: {
//     fontSize: 16,
//     marginBottom: 5,
//   },
//   boldText: {
//     fontWeight: 'bold',
//   },
//   button: {
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     borderRadius: 5,
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   greenButton: {
//     backgroundColor: 'green',
//   },
//   redButton: {
//     backgroundColor: 'red',
//   },
//   buttonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
// });


// //employee side

// import React, { useEffect, useState, useContext } from 'react';
// import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
// import { AuthContext } from '../context/AuthContext'; // Adjust as needed
// import { db } from '../services/firebaseAuth'; // Adjust as needed
// import { doc, getDoc, updateDoc } from 'firebase/firestore';

// export default function AssignedTasks() {
//   const { user } = useContext(AuthContext);
//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchAssignedTasks = async () => {
//       if (user?.eid) {
//         try {
//           const onsiteWorkRef = doc(db, 'onsitework', user.eid);
//           const onsiteWorkDoc = await getDoc(onsiteWorkRef);

//           if (onsiteWorkDoc.exists()) {
//             const workDetails = onsiteWorkDoc.data().workDetails;
//             setTasks(workDetails);
//           } else {
//             setTasks([]);
//           }
//         } catch (error) {
//           console.error('Error fetching tasks:', error);
//         } finally {
//           setLoading(false);
//         }
//       }
//     };

//     fetchAssignedTasks();
//   }, [user?.eid]);

//   const handleToggleCompletion = async (task) => {
//     if (task.status === 'verified') {
//       Alert.alert('Task Already Verified', 'This task is verified and cannot be changed.');
//       return;
//     }

//     const newStatus = task.status === 'pending' ? 'completed' : 'pending';

//     try {
//       const onsiteWorkRef = doc(db, 'onsitework', user.eid);
//       const onsiteWorkDoc = await getDoc(onsiteWorkRef);

//       if (onsiteWorkDoc.exists()) {
//         const workDetails = onsiteWorkDoc.data().workDetails;
//         const updatedTasks = workDetails.map((t) => {
//           if (t.date === task.date && t.reportingTime === task.reportingTime) {
//             return { ...t, status: newStatus };
//           }
//           return t;
//         });

//         await updateDoc(onsiteWorkRef, { workDetails: updatedTasks });
//         setTasks(updatedTasks);
//         Alert.alert('Success', `Task marked as ${newStatus}.`);
//       }
//     } catch (error) {
//       console.error('Error updating task:', error);
//       Alert.alert('Error', 'Could not update the task.');
//     }
//   };

//   if (loading) {
//     return (
//       <View style={styles.loaderContainer}>
//         <ActivityIndicator size="large" color="#0000ff" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Assigned Tasks</Text>

//       {tasks.length === 0 ? (
//         <Text style={styles.noTasksText}>No tasks assigned yet.</Text>
//       ) : (
//         <FlatList
//           data={tasks}
//           keyExtractor={(item, index) => index.toString()}
//           renderItem={({ item }) => (
//             <View style={styles.taskItem}>
//               <Text style={styles.taskText}>
//                 <Text style={styles.boldText}>Location:</Text> {item.location}
//               </Text>
//               <Text style={styles.taskText}>
//                 <Text style={styles.boldText}>Details:</Text> {item.details}
//               </Text>
//               <Text style={styles.taskText}>
//                 <Text style={styles.boldText}>Date:</Text> {item.date}
//               </Text>
//               <Text style={styles.taskText}>
//                 <Text style={styles.boldText}>Reporting Time:</Text> {new Date(item.reportingTime).toLocaleTimeString()}
//               </Text>

//               {/* Display status */}
//               <Text style={styles.taskText}>
//                 <Text style={styles.boldText}>Status:</Text> {item.status}
//               </Text>

//               {/* Button based on status */}
//               <TouchableOpacity
//                 style={[
//                   styles.button,
//                   item.status === 'verified'
//                     ? styles.verifiedButton
//                     : item.status === 'completed'
//                     ? styles.pendingVerificationButton
//                     : styles.pendingWorkButton,
//                 ]}
//                 onPress={() => handleToggleCompletion(item)}
//                 disabled={item.status === 'verified'}
//               >
//                 <Text style={styles.buttonText}>
//                   {item.status === 'verified'
//                     ? 'Verified'
//                     : item.status === 'completed'
//                     ? 'Verification Pending'
//                     : 'Pending Work'}
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           )}
//         />
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#f5f5f5',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   noTasksText: {
//     textAlign: 'center',
//     fontSize: 18,
//     color: '#888',
//   },
//   taskItem: {
//     marginBottom: 20,
//     padding: 15,
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//   },
//   taskText: {
//     fontSize: 16,
//     marginVertical: 5,
//   },
//   boldText: {
//     fontWeight: 'bold',
//   },
//   button: {
//     marginTop: 10,
//     padding: 10,
//     borderRadius: 5,
//     alignItems: 'center',
//   },
//   pendingWorkButton: {
//     backgroundColor: '#f39c12',
//   },
//   pendingVerificationButton: {
//     backgroundColor: '#3498db',
//   },
//   verifiedButton: {
//     backgroundColor: '#27ae60',
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   loaderContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });




//emp side
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
