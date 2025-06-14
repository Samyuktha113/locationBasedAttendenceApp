// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
// import { db } from '../services/firebaseAuth'; // Adjust based on your project structure
// import { collection, query, orderBy, getDocs } from 'firebase/firestore';

// const ViewCalculatedSalary = () => {
//   const [salaryData, setSalaryData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchSalaryData = async () => {
//       try {
//         const salaryCollectionRef = collection(db, 'salary');
//         const q = query(salaryCollectionRef, orderBy('createdAt', 'desc')); // Order by createdAt descending
//         const querySnapshot = await getDocs(q);

//         const fetchedData = querySnapshot.docs.map((doc) => ({
//           docName: doc.id,
//           fields: doc.data(),
//         }));

//         setSalaryData(fetchedData);
//       } catch (error) {
//         console.error('Error fetching salary data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSalaryData();
//   }, []);

//   if (loading) {
//     return (
//       <View style={styles.loaderContainer}>
//         <ActivityIndicator size="large" color="#0000ff" />
//       </View>
//     );
//   }

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.title}>View Calculated Salary</Text>

//       {salaryData.length === 0 ? (
//         <Text style={styles.noDataText}>No salary data available.</Text>
//       ) : (
//         salaryData.map((document, docIndex) => {
//           const { docName, fields } = document;

//           // Separate updatedEmployees and remaining employees
//           const updatedEmployees = fields.updatedEmployees || [];
//           const remainingFields = Object.keys(fields).filter(
//             (key) => key !== 'updatedEmployees' && key !== 'createdAt'
//           );
//           const totalFields = {};

//           // Calculate totals for remaining fields
//           remainingFields.forEach((key) => {
//             totalFields[key] = (totalFields[key] || 0) + fields[key];
//           });

//           return (
//             <View key={docIndex} style={styles.salaryCard}>
//               <Text style={styles.docName}>{docName}</Text>
//               <View style={styles.table}>
//                 {/* Display remaining employees */}
//                 {remainingFields.map((key, index) => (
//                   <View key={index} style={styles.tableRow}>
//                     <Text style={styles.tableCell}>{key}</Text>
//                     <Text style={styles.tableCell}>{fields[key]}</Text>
//                   </View>
//                 ))}

//                 {/* Display totals row */}
//                 {Object.keys(totalFields).length > 0 && (
//                   <View style={styles.tableRow}>
//                     <Text style={styles.tableCell}>Total</Text>
//                     <Text style={styles.tableCell}>
//                       {Object.values(totalFields).reduce((sum, val) => sum + val, 0)}
//                     </Text>
//                   </View>
//                 )}

//                 {/* Display updated employees row */}
//                 {updatedEmployees.length > 0 && (
//                   <View style={styles.tableRow}>
//                     <Text style={styles.tableCell}>Updated Employees</Text>
//                     <Text style={styles.tableCell}>{updatedEmployees.join(', ')}</Text>
//                   </View>
//                 )}
//               </View>
//             </View>
//           );
//         })
//       )}
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//     backgroundColor: '#f9f9f9',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   loaderContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   salaryCard: {
//     marginBottom: 20,
//     padding: 15,
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 10,
//     elevation: 5,
//   },
//   docName: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     textAlign: 'center',
//   },
//   table: {
//     marginTop: 10,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 8,
//     overflow: 'hidden',
//   },
//   tableRow: {
//     flexDirection: 'row',
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ddd',
//   },
//   tableCell: {
//     flex: 1,
//     fontSize: 16,
//     paddingLeft: 10,
//   },
//   noDataText: {
//     textAlign: 'center',
//     fontSize: 18,
//     color: '#777',
//   },
// });

// export default ViewCalculatedSalary;



import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet,TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { db } from '../services/firebaseAuth'; // Adjust based on your project structure
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import Icon from "react-native-vector-icons/FontAwesome";
const ViewCalculatedSalary = ({navigation}) => {
  const [salaryData, setSalaryData] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
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
    const fetchSalaryData = async () => {
      try {
        const salaryCollectionRef = collection(db, 'salary');
        const q = query(salaryCollectionRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);

        const fetchedData = querySnapshot.docs.map((doc) => ({
          docName: doc.id,
          fields: doc.data(),
        }));

        setSalaryData(fetchedData);
      } catch (error) {
        console.error('Error fetching salary data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSalaryData();
  

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>View Calculated Salary</Text>

      {salaryData.length === 0 ? (
        <Text style={styles.noDataText}>No salary data available.</Text>
      ) : (
        salaryData.map((document, docIndex) => {
          const { docName, fields } = document;

          // Separate updatedEmployees and remaining fields
          const updatedEmployees = fields.updatedEmployees || [];
          const remainingFields = Object.keys(fields).filter(
            (key) => key !== 'updatedEmployees' && key !== 'createdAt' && key !== 'total'
          );

          // Use the stored 'total' if available, or calculate manually
          const total =
            fields.total !== undefined
              ? fields.total
              : remainingFields.reduce((sum, key) => sum + fields[key], 0);

          return (
            <View key={docIndex} style={styles.salaryCard}>
              <Text style={styles.docName}>{docName}</Text>
              <View style={styles.table}>
                {/* Display remaining fields */}
                {remainingFields.map((key, index) => (
                  <View key={index} style={styles.tableRow}>
                    <Text style={styles.tableCell}>{key}</Text>
                    <Text style={styles.tableCell}>{fields[key]}</Text>
                  </View>
                ))}

                {/* Display Total Row */}
                <View style={styles.tableRow}>
                  <Text style={styles.tableCell}>Total</Text>
                  <Text style={styles.tableCell}>{total}</Text>
                </View>

                {/* Display Updated Employees Row */}
                {updatedEmployees.length > 0 && (
                  <View style={styles.tableRow}>
                    <Text style={styles.tableCell}>Updated Employees</Text>
                    <Text style={styles.tableCell}>{updatedEmployees.join(', ')}</Text>
                  </View>
                )}
              </View>
            </View>
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'antiquewhite',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  salaryCard: {
    marginBottom: 20,
    padding: 15,
    backgroundColor:'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  docName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  table: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tableCell: {
    flex: 1,
    fontSize: 16,
    paddingLeft: 10,
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#777',
  },
});

export default ViewCalculatedSalary;
