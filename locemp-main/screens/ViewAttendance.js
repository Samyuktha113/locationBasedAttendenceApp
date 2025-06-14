// import React, { useEffect, useState, useContext } from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import { Calendar } from 'react-native-calendars';
// import { AuthContext } from '../context/AuthContext';
// import { db } from '../services/firebaseAuth'; // Adjust the import based on your setup
// import { collection, query, where, getDocs } from 'firebase/firestore';

// export default function AttendanceCalendarScreen() {
//   const { user } = useContext(AuthContext);
//   const [markedDates, setMarkedDates] = useState({});

//   useEffect(() => {
//     const fetchAttendanceData = async () => {
//       if (user?.eid) {
//         try {
//           const attendanceRef = collection(db, 'employeeAttendance');
//           const q = query(attendanceRef, where('employeeId', '==', user.eid));
//           const querySnapshot = await getDocs(q);

//           const attendanceData = {};
//           querySnapshot.forEach((doc) => {
//             const data = doc.data();
//             const date = new Date(data.date).toISOString().split('T')[0]; // Format date to 'YYYY-MM-DD'
//             attendanceData[date] = { marked: true };
//           });

//           setMarkedDates(attendanceData);
//         } catch (error) {
//           console.error('Error fetching attendance data:', error);
//         }
//       }
//     };

//     fetchAttendanceData();
//   }, [user?.eid]);

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Attendance Calendar</Text>
//       <Calendar
//         markedDates={markedDates}
//         markingType={'multi-dot'}
//         // Additional props for customization can go here
//       />
//       <Text style={styles.instructions}>
//         Unmarked days are considered as leave (except Saturdays and Sundays).
//       </Text>
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
//   instructions: {
//     marginTop: 20,
//     textAlign: 'center',
//     color: '#888',
//   },
// });


import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { AuthContext } from '../context/AuthContext';
import { db } from '../services/firebaseAuth'; // Adjust the import based on your setup
import { doc, getDoc } from 'firebase/firestore';
import Icon from "react-native-vector-icons/FontAwesome";

// Function to parse the "MM/DD/YYYY, HH:mm:ss PM" format into a valid Date object
const parseDate = (dateString) => {
  const [datePart, timePart] = dateString.split(', ');
  const [month, day, year] = datePart.split('/');
  const [hourMinute, period] = timePart.split(' ');
  const [hour, minute] = hourMinute.split(':');

  let hour24 = parseInt(hour, 10);
  if (period === 'PM' && hour24 !== 12) hour24 += 12; // Convert PM to 24-hour format
  if (period === 'AM' && hour24 === 12) hour24 = 0; // Handle 12 AM case

  const formattedDateString = `${year}-${month}-${day}T${String(hour24).padStart(2, '0')}:${minute}:00Z`; 
  return new Date(formattedDateString); // Return a valid Date object
};

export default function AttendanceCalendarScreen({navigation}) {
  const { user } = useContext(AuthContext);
  const [markedDates, setMarkedDates] = useState({});


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
    const fetchAttendanceData = async () => {
      if (user?.eid) {
        try {
          // Initialize an empty object to store marked dates
          const attendanceData = {};

          // Fetch attendance data from both onsite and offsite
          const fetchFromCollection = async (collectionName) => {
            const attendanceRef = doc(db, collectionName, user.eid);
            const attendanceDoc = await getDoc(attendanceRef);

            if (attendanceDoc.exists()) {
              const records = attendanceDoc.data()?.attendance;

              // Parse the attendance time and mark dates
              records.forEach((record) => {
                const timeString = record.time;

                const dateObj = parseDate(timeString); // Parse the date string
                if (!isNaN(dateObj)) {
                  const date = dateObj.toISOString().split('T')[0]; // Format date to 'YYYY-MM-DD'
                  attendanceData[date] = {
                    selected: true,
                    selectedColor: 'lightseagreen', // Mark the date with green color
                  };
                } else {
                  console.log('Invalid timestamp:', timeString);
                }
              });
            } else {
              console.log(`No attendance data found in ${collectionName} for this employee.`);
            }
          };

          // Fetch data from both onsiteAttendance and offsiteAttendance collections
          await fetchFromCollection('onsiteAttendance');
          await fetchFromCollection('offsiteAttendance');

          // Set the marked dates on the calendar
          setMarkedDates(attendanceData);

        } catch (error) {
          console.error('Error fetching attendance data:', error);
        }
      }
    };

    fetchAttendanceData();
  }, [user?.eid]);

  return (
    <View style={styles.container}>
      {/* Display employee ID */}
      <Text style={styles.empId}>EmpID: {user?.eid || 'N/A'}</Text>
      <Text style={styles.title}>Attendance Calendar</Text>
      <Calendar
        markedDates={markedDates}
        markingType={'simple'}
      />
      <Text style={styles.instructions}>
        Unmarked days are considered as leave (except Saturdays and Sundays).
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FAEBD7', // Set background color to antiquewhite
  },
  empId: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
    color: '#444',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  instructions: {
    marginTop: 20,
    textAlign: 'center',
    color: '#888',
  },
});
























// import React, { useEffect, useState, useContext } from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import { Calendar } from 'react-native-calendars';
// import { AuthContext } from '../context/AuthContext';
// import { db } from '../services/firebaseAuth'; // Adjust the import based on your setup
// import { collection, query, where, getDocs } from 'firebase/firestore';

// export default function AttendanceCalendarScreen() {
//   const { user } = useContext(AuthContext);
//   const [markedDates, setMarkedDates] = useState({});

//   useEffect(() => {
//     const fetchAttendanceData = async () => {
//       if (user?.eid) {
//         try {
//           const attendanceRef = collection(db, 'employeeAttendance');
//           const q = query(attendanceRef, where('eid', '==', user.eid)); // Changed to 'eid' to match your Firestore setup
//           const querySnapshot = await getDocs(q);

//           const attendanceData = {};
//           querySnapshot.forEach((doc) => {
//             const data = doc.data();
//             const date = data.date; // Use the date string directly from Firestore
//             attendanceData[date] = { marked: true }; // Mark the date directly
//           });

//           setMarkedDates(attendanceData);
//         } catch (error) {
//           console.error('Error fetching attendance data:', error);
//         }
//       }
//     };

//     fetchAttendanceData();
//   }, [user?.eid]);

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Attendance Calendar</Text>
//       <Calendar
//         markedDates={markedDates}
//         markingType={'multi-dot'} // You can change marking type based on your requirement
//       />
//       <Text style={styles.instructions}>
//         Unmarked days are considered as leave (except Saturdays and Sundays).
//       </Text>
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
//   instructions: {
//     marginTop: 20,
//     textAlign: 'center',
//     color: '#888',
//   },
// });


/*import React, { useEffect, useState, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { AuthContext } from '../context/AuthContext';
import { db } from '../firebase'; // Ensure you import your Firebase config
import { collection, getDocs, query, where } from 'firebase/firestore';

const ViewAttendance = () => {
  const { user } = useContext(AuthContext);
  const [markedDates, setMarkedDates] = useState({});

  useEffect(() => {
    if (user && user.eid) {
      const fetchAttendanceData = async () => {
        try {
          const attendanceQuery = query(
            collection(db, 'employeeAttendance'),
            where('eid', '==', user.eid)
          );

          const querySnapshot = await getDocs(attendanceQuery);
          const dates = {};

          querySnapshot.forEach((doc) => {
            const { date } = doc.data();
            const formattedDate = date.split('T')[0]; // Ensure the date is in YYYY-MM-DD format
            dates[formattedDate] = { marked: true }; // Mark the date
          });

          setMarkedDates(dates);
        } catch (error) {
          console.error('Error fetching attendance data:', error);
        }
      };

      fetchAttendanceData();
    }
  }, [user]);

  return (
    <View style={styles.container}>
      <Calendar
        markedDates={markedDates}
        markingType={'simple'}
        theme={{
          // You can customize your calendar theme here
          backgroundColor: '#ffffff',
          calendarBackground: '#ffffff',
          textSectionTitleColor: '#b6c1cd',
          textSectionTitleDisabledColor: '#d9e1e8',
          selectedDayBackgroundColor: '#00adf5',
          todayTextColor: '#00adf5',
          dayTextColor: '#2d4150',
          textDisabledColor: '#d9e1e8',
          dotColor: '#00adf5',
          selectedDotColor: '#ffffff',
          arrowColor: '#00adf5',
          disabledArrowColor: '#d9e1e8',
          monthTextColor: '#00adf5',
          indicatorColor: '#00adf5',
          textDayFontFamily: 'monospace',
          textMonthFontFamily: 'monospace',
          textDayHeaderFontFamily: 'monospace',
          textDayFontWeight: '300',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: 'bold',
          textDayFontSize: 16,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 16,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
});

export default ViewAttendance;
*/


/*
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { db } from '../services/firebaseAuth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useEmployee } from '../context/EmployeeContext';

// Haversine formula to calculate distance
const haversineDistance = (coords1, coords2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371; // Earth's radius in km
  const dLat = toRad(coords2.latitude - coords1.latitude);
  const dLon = toRad(coords2.longitude - coords1.longitude);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(coords1.latitude)) * Math.cos(toRad(coords2.latitude)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c * 1000; // Distance in meters
};

const parseDate = (dateString) => {
  // Convert the time to YYYY-MM-DD format (ISO format)
  const date = new Date(dateString);
  return date.toISOString().split('T')[0]; // Returns date in YYYY-MM-DD
};

export default function ViewAttendance() {
  const { employeeData } = useEmployee(); // Access employee data from context
  const [markedDates, setMarkedDates] = useState({});

  const companyLocation = {
    latitude: 37.4220936, // Your company's latitude
    longitude: -122.083922, // Your company's longitude
  };

  // Fetch attendance data from both `onsitework` and `branch` collections
  const fetchAttendance = async () => {
    if (!employeeData || !employeeData.eid) {
      console.error("Employee ID is missing.");
      return;
    }

    try {
      let marks = {};

      // Query `onsitework` collection
      const onsiteQuery = query(collection(db, 'onsitework'), where('eid', '==', employeeData.eid));
      const onsiteSnapshot = await getDocs(onsiteQuery);

      // Process `onsitework` data
      onsiteSnapshot.docs.forEach(doc => {
        const { time, type, latitude, longitude } = doc.data();
        const date = parseDate(time);
        
        // Check if the location is within range of the company
        const distance = haversineDistance({ latitude, longitude }, companyLocation);

        if (distance <= 1000) {
          marks[date] = {
            marked: true,
            dotColor: type === 'onsite' ? 'green' : 'blue',
            customStyles: {
              container: { backgroundColor: type === 'onsite' ? '#c8e6c9' : '#bbdefb' },
              text: { color: 'black', fontWeight: 'bold' },
            },
          };
        }
      });

      // Query `branch` collection
      const branchQuery = query(collection(db, 'branch'), where('eid', '==', employeeData.eid));
      const branchSnapshot = await getDocs(branchQuery);

      // Process `branch` data
      branchSnapshot.docs.forEach(doc => {
        const { time, type, latitude, longitude } = doc.data();
        const date = parseDate(time);

        // Check if the location is within range of the company
        const distance = haversineDistance({ latitude, longitude }, companyLocation);

        if (distance <= 1000) {
          if (!marks[date]) {
            marks[date] = {
              marked: true,
              dotColor: type === 'onsite' ? 'green' : 'blue',
              customStyles: {
                container: { backgroundColor: type === 'onsite' ? '#c8e6c9' : '#bbdefb' },
                text: { color: 'black', fontWeight: 'bold' },
              },
            };
          }
        }
      });

      // Add cross mark for missing days if needed
      const today = new Date();
      for (let i = 1; i <= today.getDate(); i++) {
        const day = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        if (!marks[day]) {
          marks[day] = {
            customStyles: {
              container: { backgroundColor: '#ffcdd2' },
              text: { color: 'red', fontWeight: 'bold' },
            },
          };
        }
      }

      setMarkedDates(marks);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [employeeData]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Attendance Calendar</Text>
      <Calendar
        markingType={'custom'}
        markedDates={markedDates}
      />
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
});
*/


/*
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { db } from '../services/firebaseAuth';
import { collection, getDocs, doc } from 'firebase/firestore';
import { useEmployee } from '../context/EmployeeContext';

//console.log("Employee ID (eid): ", employeeData.eid);

// Parse the time string into MM/DD/YYYY format
const parseDate = (timeString) => {
  const date = new Date(timeString);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

// Haversine formula to calculate distance
const haversineDistance = (location1, location2) => {
  const R = 6371; // Radius of the Earth in km
  const lat1 = location1.latitude;
  const lon1 = location1.longitude;
  const lat2 = location2.latitude;
  const lon2 = location2.longitude;

  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km

  return distance * 1000; // Return in meters
};

export default function ViewAttendance() {
  const { employeeData } = useEmployee(); // Access employee data from context
  const [markedDates, setMarkedDates] = useState({});

  const companyLocation = {
    latitude: 37.4220936, // Your company's latitude
    longitude: -122.083922, // Your company's longitude
  };

  // Fetch attendance data from the `attendance` sub-collection
  const fetchAttendance = async () => {
    if (!employeeData || !employeeData.eid) {
      console.error("Employee ID is missing.");
      return;
    }

    try {
      let marks = {};

      // Query the `attendance` sub-collection for the employee's `empid`
      const attendanceRef = collection(db, 'branch', employeeData.eid, 'attendance');
      const attendanceSnapshot = await getDocs(attendanceRef);

      if (attendanceSnapshot.empty) {
        console.log("No attendance records found for this employee.");
      }

      // Process the attendance data and mark on the calendar
      attendanceSnapshot.docs.forEach(doc => {
        const { location, time } = doc.data();
        const formattedDate = parseDate(time); // Format the time string to MM/DD/YYYY

        // Log the fetched data to debug
        console.log("Fetched Date: ", formattedDate, "Location: ", location);

        // Mark attendance if employee was within range
        const distance = haversineDistance(location, companyLocation);
        if (distance <= 1000) {
          marks[formattedDate] = {
            marked: true,
            dotColor: 'green', // Green for attendance
            customStyles: {
              container: { backgroundColor: '#c8e6c9' }, // Optional custom style for marked dates
              text: { color: 'black', fontWeight: 'bold' },
            },
          };
        }
      });

      console.log("Marked Dates: ", marks); // Log the final marked dates

      setMarkedDates(marks); // Update marked dates
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [employeeData]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Attendance Calendar</Text>
      <Calendar
        markingType={'custom'}
        markedDates={markedDates} // Pass the marked dates to the calendar
      />
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
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
});
*/
