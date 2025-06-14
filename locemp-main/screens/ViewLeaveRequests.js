// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, Button, FlatList, Alert } from 'react-native';
// import { db } from '../services/firebaseAuth'; // Ensure this imports your Firestore configuration
// import { doc, updateDoc, getDocs, collection, query, where } from 'firebase/firestore';

// export default function ManageLeaveRequests() {
//   const [pendingRequests, setPendingRequests] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchPendingRequests = async () => {
//       try {
//         const q = query(collection(db, 'leaveRequests'), where('status', '==', 'Pending'));
//         const querySnapshot = await getDocs(q);
//         const requests = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//         setPendingRequests(requests);
//       } catch (error) {
//         Alert.alert('Error', `Failed to fetch leave requests: ${error.message}`);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPendingRequests();
//   }, []);

//   const handleUpdateStatus = async (requestId, newStatus) => {
//     try {
//       const requestDocRef = doc(db, 'leaveRequests', requestId);
//       await updateDoc(requestDocRef, { status: newStatus });
//       Alert.alert('Success', `Leave request has been ${newStatus.toLowerCase()}.`);

//       // Update the UI to reflect the change
//       setPendingRequests(prevRequests => prevRequests.filter(request => request.id !== requestId));
//     } catch (error) {
//       Alert.alert('Error', `Failed to update leave status: ${error.message}`);
//     }
//   };

//   if (loading) {
//     return <Text>Loading pending requests...</Text>;
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.heading}>Pending Leave Requests</Text>
//       {pendingRequests.length === 0 ? (
//         <Text>No pending leave requests.</Text>
//       ) : (
//         <FlatList
//           data={pendingRequests}
//           keyExtractor={item => item.id}
//           renderItem={({ item }) => (
//             <View style={styles.requestContainer}>
//               <Text style={styles.requestText}>Employee ID: {item.eid}</Text>
//               <Text style={styles.requestText}>Leave Type: {item.leaveType}</Text>
//               <Text style={styles.requestText}>From: {new Date(item.startDate).toLocaleDateString()}</Text>
//               <Text style={styles.requestText}>To: {new Date(item.endDate).toLocaleDateString()}</Text>
//               <Text style={styles.requestText}>Reason: {item.reason}</Text>
//               <View style={styles.buttonContainer}>
//                 <Button title="Approve" onPress={() => handleUpdateStatus(item.id, 'Approved')} />
//                 <Button title="Reject" onPress={() => handleUpdateStatus(item.id, 'Rejected')} color="red" />
//               </View>
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
//   heading: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   requestContainer: {
//     padding: 15,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 5,
//     marginBottom: 15,
//   },
//   requestText: {
//     fontSize: 16,
//     marginBottom: 5,
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 10,
//   },
// });



/*
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, FlatList, Alert } from 'react-native';
import { db } from '../services/firebaseAuth'; // Ensure this imports your Firestore configuration
import { doc, updateDoc, getDocs, collection, query, where } from 'firebase/firestore';

export default function ManageLeaveRequests() {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        // Query the leaveRequests collection to get documents where status is 'Pending'
        const q = query(collection(db, 'leaveRequests'), where('status', '==', 'Pending'));
        const querySnapshot = await getDocs(q);

        // Map through the fetched documents
        const requests = querySnapshot.docs.map(doc => {
          const data = doc.data();
          // Return each leave request with its ID
          return {
            id: doc.id, // Employee ID (document ID)
            leaveType: data.leaveType, // Leave type
            startDate: data.startDate, // Leave start date
            endDate: data.endDate, // Leave end date
            reason: data.reason, // Leave reason
          };
        });

        setPendingRequests(requests); // Update the state with fetched requests
      } catch (error) {
        Alert.alert('Error', `Failed to fetch leave requests: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingRequests(); // Fetch the pending leave requests when the component mounts
  }, []);

  // Function to format date string to a readable format
  const formatDate = (dateString) => {
    if (dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString(); // Format it as a readable date
    }
    return 'N/A'; // Return 'N/A' if no date is provided
  };

  const handleUpdateStatus = async (requestId, newStatus) => {
    try {
      const requestDocRef = doc(db, 'leaveRequests', requestId);
      await updateDoc(requestDocRef, { status: newStatus });

      Alert.alert('Success', `Leave request has been ${newStatus.toLowerCase()}.`);

      // Update the UI by removing the processed request from the pending list
      setPendingRequests(prevRequests => prevRequests.filter(request => request.id !== requestId));
    } catch (error) {
      Alert.alert('Error', `Failed to update leave status: ${error.message}`);
    }
  };

  if (loading) {
    return <Text>Loading pending requests...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Pending Leave Requests</Text>
      {pendingRequests.length === 0 ? (
        <Text>No pending leave requests.</Text>
      ) : (
        <FlatList
          data={pendingRequests}
          keyExtractor={(item) => item.id} // Use the unique leave request ID
          renderItem={({ item }) => (
            <View style={styles.requestContainer}>
              <Text style={styles.requestText}>Employee ID: {item.id}</Text>
              <Text style={styles.requestText}>Leave Type: {item.leaveType}</Text>
              <Text style={styles.requestText}>From: {formatDate(item.startDate)}</Text>
              <Text style={styles.requestText}>To: {formatDate(item.endDate)}</Text>
              <Text style={styles.requestText}>Reason: {item.reason}</Text>
              <View style={styles.buttonContainer}>
                <Button title="Approve" onPress={() => handleUpdateStatus(item.id, 'Approved')} />
                <Button title="Reject" onPress={() => handleUpdateStatus(item.id, 'Rejected')} color="red" />
              </View>
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
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  requestContainer: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
  },
  requestText: {
    fontSize: 16,
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});
*/

// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, Button, FlatList, Alert } from 'react-native';
// import { db } from '../services/firebaseAuth'; // Ensure this imports your Firestore configuration
// import { collection, getDocs } from 'firebase/firestore';

// export default function ManageLeaveRequests() {
//   const [pendingRequests, setPendingRequests] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchPendingRequests = async () => {
//       try {
//         const querySnapshot = await getDocs(collection(db, 'leaveRequests'));
//         const requests = [];

//         querySnapshot.forEach(doc => {
//           const data = doc.data();
//           const leaves = data.leaves || []; // Access the 'leaves' array
//           leaves.forEach((leave, index) => {
//             if (leave.status === 'Pending' || leave.status === 'Previous Leave Pending') {
//               requests.push({
//                 id: `${doc.id}-${index}`, // Combine document ID and index for unique ID
//                 docId: doc.id,
//                 leaveIndex: index,
//                 ...leave,
//               });
//             }
//           });
//         });

//         setPendingRequests(requests);
//       } catch (error) {
//         Alert.alert('Error', `Failed to fetch leave requests: ${error.message}`);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPendingRequests();
//   }, []);

//   const handleUpdateStatus = async (requestId, newStatus) => {
//     try {
//       // Split requestId to extract document ID and leave index
//       const [docId, leaveIndex] = requestId.split('-');
//       const requestDocRef = doc(db, 'leaveRequests', docId); // Correctly reference the document
  
//       // Fetch the document to modify the specific leave entry
//       const requestDoc = await getDoc(requestDocRef);
  
//       if (!requestDoc.exists()) {
//         throw new Error('Document does not exist');
//       }
  
//       const leaves = requestDoc.data().leaves || []; // Ensure leaves array exists
  
//       // Update the specific leave entry's status
//       leaves[leaveIndex].status = newStatus;
  
//       // Update the Firestore document with the modified leaves array
//       await updateDoc(requestDocRef, { leaves });
  
//       Alert.alert('Success', `Leave request has been ${newStatus.toLowerCase()}.`);
  
//       // Update the UI to reflect the change
//       setPendingRequests(prevRequests => prevRequests.filter(request => request.id !== requestId));
//     } catch (error) {
//       Alert.alert('Error', `Failed to update leave status: ${error.message}`);
//     }
//   };
  
  

//   if (loading) {
//     return <Text>Loading pending requests...</Text>;
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.heading}>Pending Leave Requests</Text>
//       {pendingRequests.length === 0 ? (
//         <Text>No pending leave requests.</Text>
//       ) : (
//         <FlatList
//           data={pendingRequests}
//           keyExtractor={item => item.id}
//           renderItem={({ item }) => (
//             <View style={styles.requestContainer}>
//               <Text style={styles.requestText}>Employee ID: {item.docId}</Text>
//               <Text style={styles.requestText}>Leave Type: {item.leaveType}</Text>
//               <Text style={styles.requestText}>From: {new Date(item.startDate).toLocaleDateString()}</Text>
//               <Text style={styles.requestText}>To: {new Date(item.endDate).toLocaleDateString()}</Text>
//               <Text style={styles.requestText}>Reason: {item.reason}</Text>
//               <View style={styles.buttonContainer}>
//                 <Button title="Approve" onPress={() => handleUpdateStatus(item.id, 'Approved')} />
//                 <Button title="Reject" onPress={() => handleUpdateStatus(item.id, 'Rejected')} color="red" />
//               </View>
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
//   heading: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   requestContainer: {
//     padding: 15,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 5,
//     marginBottom: 15,
//   },
//   requestText: {
//     fontSize: 16,
//     marginBottom: 5,
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 10,
//   },
// });



import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet,TouchableOpacity, Button, FlatList, Alert } from 'react-native';
import { db } from '../services/firebaseAuth'; // Ensure this imports your Firestore configuration
import { collection, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import Icon from "react-native-vector-icons/FontAwesome"; 

export default function ManageLeaveRequests({navigation}) {
  const [pendingRequests, setPendingRequests] = useState([]);
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
    const fetchPendingRequests = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'leaveRequests'));
        const requests = [];

        querySnapshot.forEach(doc => {
          const data = doc.data();
          const leaves = data.leaves || []; // Access the 'leaves' array
          leaves.forEach((leave, index) => {
            if (leave.status === 'Pending' || leave.status === 'Previous Leave Pending') {
              requests.push({
                id: `${doc.id}-${index}`, // Combine document ID and index for unique ID
                docId: doc.id,
                leaveIndex: index,
                ...leave,
              });
            }
          });
        });

        setPendingRequests(requests);
      } catch (error) {
        Alert.alert('Error', `Failed to fetch leave requests: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingRequests();
  }, []);

  const handleUpdateStatus = async (requestId, newStatus) => {
    try {
      // Split requestId to extract document ID and leave index
      const [docId, leaveIndex] = requestId.split('-');
      const requestDocRef = doc(db, 'leaveRequests', docId); // Correctly reference the document

      // Fetch the document to modify the specific leave entry
      const requestDoc = await getDoc(requestDocRef);

      if (!requestDoc.exists()) {
        throw new Error('Document does not exist');
      }

      const leaves = requestDoc.data().leaves || []; // Ensure leaves array exists

      // Update the specific leave entry's status
      leaves[leaveIndex].status = newStatus;

      // Update the Firestore document with the modified leaves array
      await updateDoc(requestDocRef, { leaves });

      Alert.alert('Success', `Leave request has been ${newStatus.toLowerCase()}.`);

      // Update the UI to reflect the change
      setPendingRequests(prevRequests => prevRequests.filter(request => request.id !== requestId));
    } catch (error) {
      Alert.alert('Error', `Failed to update leave status: ${error.message}`);
    }
  };

  if (loading) {
    return <Text>Loading pending requests...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Pending Leave Requests</Text>
      {pendingRequests.length === 0 ? (
        <Text>No pending leave requests.</Text>
      ) : (
        <FlatList
          data={pendingRequests}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.requestContainer}>
              <Text style={styles.requestText}>Employee ID : {item.docId}</Text>
              <Text style={styles.requestText}>Leave Type : {item.leaveType}</Text>
              <Text style={styles.requestText}>From : {new Date(item.startDate).toLocaleDateString()}</Text>
              <Text style={styles.requestText}>To : {new Date(item.endDate).toLocaleDateString()}</Text>
              <Text style={styles.requestText}>Reason : {item.reason}</Text>
              <View style={styles.buttonContainer}>
                <Button title="Approve" onPress={() => handleUpdateStatus(item.id, 'Approved')} color="lightseagreen" />
                <Button title="Reject" onPress={() => handleUpdateStatus(item.id, 'Rejected')} color="red" />
              </View>
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
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  requestContainer: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor:'white',
    
  },
  requestText: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight:'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});
