// // import { signOut } from "firebase/auth";
// // import { Button, View, Text, TouchableOpacity, StyleSheet } from "react-native";
// // import React, { useState } from 'react';
// // import auth from "../services/firebaseAuth";
// // import AsyncStorage from "@react-native-async-storage/async-storage";
// // import {doc, updateDoc} from "firebase/firestore"
// // import db from "../services/firebaseAuth"

// // export default function DashboardScreen({ navigation }) {
    
// //     const [attendanceMarked, setAttendanceMarked] = useState(false);
// //     // Function to log the user out
// //     const handleLogout = async () => {
// //         try {
// //             const userId = await AsyncStorage.getItem('userId'); // Retrieve userId from local storage
            
// //             if (userId) {
// //                 // Optional: Update Firestore to mark the user as logged out (if needed in your logic)
// //                 const userRef = doc(db, "users", userId);
// //                 await updateDoc(userRef, {
// //                     isLoggedIn: false, // Update any field to indicate the user logged out
// //                 });
                
// //                 // Clear any session data stored in AsyncStorage
// //                 await AsyncStorage.removeItem('userId');
// //                 await AsyncStorage.removeItem('userSession'); // Remove other session-related data
                
// //                 // Navigate the user to the login screen after logout
// //                 navigation.navigate('Login');
// //             } else {
// //                 // If no userId is found, navigate directly to the login screen
// //                 navigation.navigate('Login');
// //             }
// //         } catch (error) {
// //             console.error("Logout Error:", error);
// //         }
// //     };

// //     const navigateToAttendance = () => {
// //         // Navigate to Attendance screen
// //         console.log("Navigate to Attendance");
// //     };

// //     const navigateToLeave = () => {
// //         // Navigate to Leave screen
// //         console.log("Navigate to Leave");
// //     };

// //     const navigateToTasks = () => {
// //         // Navigate to Tasks screen
// //         console.log("Navigate to Tasks");
// //     };
     
// //     const navigateToMap = () => {
// //         navigation.navigate('MapScreen'); // Ensure 'Map' matches the name defined in your navigation stack
// //     };
// //     const toggleAttendance = () => {
// //         setAttendanceMarked(!attendanceMarked);
// //         console.log(attendanceMarked ? 'Attendance marked!' : 'Attendance not marked');
// //     };
// //     return (
// //         <View className="flex-1 justify-center items-center bg-gray-100">
// //             <Text className="text-2xl font-bold mb-5">Welcome</Text>

// //             {/* Attendance Toggle Button */}
// //             <TouchableOpacity 
// //                 onPress={toggleAttendance}
// //                 style={[
// //                     styles.button,
// //                     { backgroundColor: attendanceMarked ? 'green' : 'blue' } // Conditional styling
// //                 ]}
// //             >
// //                 <Text style={styles.buttonText}>
// //                     {attendanceMarked ? 'Attendance Marked' : 'Mark Attendance'}
// //                 </Text>
// //             </TouchableOpacity>

// //             <TouchableOpacity 
// //                 onPress={navigateToAttendance} 
// //                 className="bg-blue-500 p-4 rounded-lg mb-4 w-3/4"
// //             >
// //                 <Text className="text-white text-center">View Attendance</Text>
// //             </TouchableOpacity>

// //             <TouchableOpacity 
// //                 onPress={navigateToLeave} 
// //                 className="bg-blue-500 p-4 rounded-lg mb-4 w-3/4"
// //             >
// //                 <Text className="text-white text-center">Leave</Text>
// //             </TouchableOpacity>
            
// //             <TouchableOpacity 
// //                 onPress={navigateToTasks} 
// //                 className="bg-blue-500 p-4 rounded-lg mb-4 w-3/4"
// //             >
// //                 <Text className="text-white text-center">Task of the Day</Text>
// //             </TouchableOpacity>
// //             <TouchableOpacity 
// //                 onPress={navigateToMap} 
// //                 className="bg-blue-500 p-4 rounded-lg mb-4 w-3/4"
// //             >
// //                 <Text className="text-white text-center">View Map</Text>
// //             </TouchableOpacity>
// //             <Button onPress={handleLogout} title="Logout" color="#e3342f" />
// //         </View>
// //     );
// // }

// // const styles = StyleSheet.create({
// //     container: {
// //         flex: 1,
// //         justifyContent: 'center',
// //         alignItems: 'center',
// //         backgroundColor: '#f0f0f0',
// //     },
// //     title: {
// //         fontSize: 24,
// //         fontWeight: 'bold',
// //         marginBottom: 20,
// //     },
// //     button: {
// //         padding: 15,
// //         borderRadius: 10,
// //         marginBottom: 10,
// //         width: '75%',
// //         alignItems: 'center',
// //     },
// //     buttonText: {
// //         color: '#fff',
// //         fontSize: 16,
// //     },
// // });


// import { Button, View, Text, TouchableOpacity, StyleSheet } from "react-native";
// import React, { useState } from 'react';
// import auth from "../services/firebaseAuth";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import {doc, updateDoc} from "firebase/firestore"
// import db from "../services/firebaseAuth"
// import { LinearGradient } from 'expo-linear-gradient'; // For Gradient effect
// import Icon from 'react-native-vector-icons/FontAwesome'; // Icons

// export default function DashboardScreen({ navigation }) {
  
//     const handleLogout = async () => {
//                 try {
//                    const userId = await AsyncStorage.getItem('userId'); // Retrieve userId from local storage
                    
//                  if (userId) {
//                    // Optional: Update Firestore to mark the user as logged out (if needed in your logic)
//                     const userRef = doc(db, "users", userId);
//                     await updateDoc(userRef, {
//                         isLoggedIn: false, // Update any field to indicate the user logged out
//                       });
                        
//         //                 // Clear any session data stored in AsyncStorage
//                      await AsyncStorage.removeItem('userId');
//                      await AsyncStorage.removeItem('userSession'); // Remove other session-related data
                        
//         //                 // Navigate the user to the login screen after logout
//                  navigation.navigate('Login');
//                  } else {
//                       // If no userId is found, navigate directly to the login screen
//                     navigation.navigate('Login');
//                }
//            } catch (error) {
//                  console.error("Logout Error:", error);
//            }
        
//     console.log('User logged out');
//     navigation.navigate('Login');
//   };

//   const navigateToAttendance = () => {
//     console.log('Navigate to Attendance');
//   };

//   const navigateToLeave = () => {
//     console.log('Navigate to Leave');
//   };

//   const navigateToTasks = () => {
//     console.log('Navigate to Tasks');
//   };

//   const navigateToMap = () => {
//     console.log('Navigate to Map');
//     navigation.navigate('MapScreen');
//   };

//   const navigateToGenerateReport = () => {
//     console.log('Generate Report');
//   };

//   const navigateToProfile = () => {
//     console.log('Navigate to Profile');
//     // Add navigation logic here
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Welcome</Text>

//       <View style={styles.row}>
//         {/* Button 1: View Profile */}
//         <TouchableOpacity onPress={navigateToProfile} style={styles.button}>
//           <LinearGradient
//             colors={['#f5a623', '#f76b1c']}
//             start={[0, 0]}
//             end={[1, 1]}
//             style={styles.gradient}
//           >
//             <Icon name="user" size={30} color="#fff" />
//             <Text style={styles.buttonText}>View Profile</Text>
//           </LinearGradient>
//         </TouchableOpacity>

//         {/* Button 2: Mark Attendance */}
//         <TouchableOpacity style={styles.button}>
//           <LinearGradient
//             colors={['#00c6ff', '#0072ff']}
//             start={[0, 0]}
//             end={[1, 1]}
//             style={styles.gradient}
//           >
//             <Icon name="calendar" size={30} color="#fff" />
//             <Text style={styles.buttonText}>Mark Attendance</Text>
//           </LinearGradient>
//         </TouchableOpacity>
//       </View>

//       <View style={styles.row}>
//         {/* Button 3: View Attendance */}
//         <TouchableOpacity onPress={navigateToAttendance} style={styles.button}>
//           <LinearGradient
//             colors={['#f7971e', '#ffd200']}
//             start={[0, 0]}
//             end={[1, 1]}
//             style={styles.gradient}
//           >
//             <Icon name="eye" size={30} color="#fff" />
//             <Text style={styles.buttonText}>View Attendance</Text>
//           </LinearGradient>
//         </TouchableOpacity>

//         {/* Button 4: Leave */}
//         <TouchableOpacity onPress={navigateToLeave} style={styles.button}>
//           <LinearGradient
//             colors={['#ff5f6d', '#ffc371']}
//             start={[0, 0]}
//             end={[1, 1]}
//             style={styles.gradient}
//           >
//             <Icon name="briefcase" size={30} color="#fff" />
//             <Text style={styles.buttonText}>Leave</Text>
//           </LinearGradient>
//         </TouchableOpacity>
//       </View>

//       <View style={styles.row}>
//         {/* Button 5: Task of the Day */}
//         <TouchableOpacity onPress={navigateToTasks} style={styles.button}>
//           <LinearGradient
//             colors={['#8e2de2', '#4a00e0']}
//             start={[0, 0]}
//             end={[1, 1]}
//             style={styles.gradient}
//           >
//             <Icon name="tasks" size={30} color="#fff" />
//             <Text style={styles.buttonText}>Task of the Day</Text>
//           </LinearGradient>
//         </TouchableOpacity>

//         {/* Button 6: View Map */}
//         <TouchableOpacity onPress={navigateToMap} style={styles.button}>
//           <LinearGradient
//             colors={['#36d1dc', '#5b86e5']}
//             start={[0, 0]}
//             end={[1, 1]}
//             style={styles.gradient}
//           >
//             <Icon name="map" size={30} color="#fff" />
//             <Text style={styles.buttonText}>View Map</Text>
//           </LinearGradient>
//         </TouchableOpacity>
//       </View>

//       <View style={styles.row}>
//         {/* Button 7: Generate Report */}
//         <TouchableOpacity onPress={navigateToGenerateReport} style={styles.button}>
//           <LinearGradient
//             colors={['#34e89e', '#0f3443']}
//             start={[0, 0]}
//             end={[1, 1]}
//             style={styles.gradient}
//           >
//             <Icon name="file" size={30} color="#fff" />
//             <Text style={styles.buttonText}>Generate Report</Text>
//           </LinearGradient>
//         </TouchableOpacity>

//         {/* Button 8: Logout */}
//         <TouchableOpacity onPress={handleLogout} style={styles.button}>
//           <LinearGradient
//             colors={['#ff512f', '#dd2476']}
//             start={[0, 0]}
//             end={[1, 1]}
//             style={styles.gradient}
//           >
//             <Icon name="sign-out" size={30} color="#fff" />
//             <Text style={styles.buttonText}>Logout</Text>
//           </LinearGradient>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     justifyContent: 'center',
//     backgroundColor: '#f0f0f0',
//   },
//   title: {
//     fontSize: 34,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 30,
//   },
//   button: {
//     width: '48%',
//     height: 150, // Maximized height for two buttons per row
//     borderRadius: 10,
//     overflow: 'hidden',
//   },
//   gradient: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 10,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 20,
//     marginTop: 10,
//   },
// });

import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, StatusBar } from "react-native";
import { LinearGradient } from "expo-linear-gradient"; // For Gradient effect
import Icon from "react-native-vector-icons/FontAwesome"; // Icons

export default function DashboardScreen({ navigation }) {
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

  const navigateToProfile = () => {
    navigation.navigate("ViewProfile");
  };

  const navigateToMarkAttendance = () => {
    navigation.navigate("MarkAttendanceScreen");
  };

  const navigateToViewAttendance = () => {
    navigation.navigate("ViewAttendance");
  };

  const navigateToLeave = () => {
    navigation.navigate("ViewLeaveRequests");
  };

  const navigateToAddRemarks = () => {
    navigation.navigate("AddRemarks");
  };

  // const navigateToMap = () => {
  //   navigation.navigate("MapScreen");
  // };

  const navigateToOnsiteWorkDetails = () => {
    navigation.navigate("GetOnsiteWorkDetails");
  };

  const handleLogout = async () => {
    try {
      console.log("User logged out");
      navigation.navigate("HomeScreen");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#faebd7" />
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.row}>
            <TouchableOpacity onPress={navigateToProfile} style={styles.button}>
              <View style={styles.buttonContent}>
                <Icon name="user" size={30} color="#000" />
                <Text style={styles.buttonText}>View Profile</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={navigateToMarkAttendance} style={styles.button}>
              <View style={styles.buttonContent}>
                <Icon name="calendar" size={30} color="#000" />
                <Text style={styles.buttonText}>Mark Attendance</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <TouchableOpacity onPress={navigateToViewAttendance} style={styles.button}>
              <View style={styles.buttonContent}>
                <Icon name="eye" size={30} color="#000" />
                <Text style={styles.buttonText}>View Attendance</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={navigateToLeave} style={styles.button}>
              <View style={styles.buttonContent}>
                <Icon name="briefcase" size={30} color="#000" />
                <Text style={styles.buttonText}>View Leave Requests</Text>
              </View>
            </TouchableOpacity>
          </View>

        
            <View style={styles.row}>
            <TouchableOpacity onPress={navigateToAddRemarks} style={styles.button}>
              <View style={styles.buttonContent}>
                <Icon name="comments" size={30} color="#000" />
                <Text style={styles.buttonText}>Remarks </Text>
              </View>
            </TouchableOpacity>

      
            <TouchableOpacity onPress={navigateToOnsiteWorkDetails} style={styles.button}>
              <View style={styles.buttonContent}>
                <Icon name="file" size={30} color="#000" />
                <Text style={styles.buttonText}>Onsite Works</Text>
              </View>
            </TouchableOpacity>
  
            
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#faebd7", // Background color to match the screen
    padding: 10,
    justifyContent: "space-between", // Distribute space between rows
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
    flexWrap: "wrap", // Allow wrapping of buttons to next row
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    marginVertical: 5, // Add vertical margin for spacing
    minHeight: 165, // Increased minimum height to adjust the button size
    borderRadius: 10,
    backgroundColor: "#20b2aa", // Solid background color
    justifyContent: "center", // Center content vertically
    alignItems: "center", // Center content horizontally
  },
  buttonContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    height: "100%", // Ensure button takes up full height
    borderRadius: 10,
  },
  buttonText: {
    color: "#000", // Set text color to black
    fontSize: 16,
    marginTop: 10,
  },
  scrollView: {
    flexGrow: 1, // Ensure the scroll view takes up the available space
    justifyContent: "center", // Center content vertically
  },
  logoutIcon: {
    marginRight: 15,
  },
});
