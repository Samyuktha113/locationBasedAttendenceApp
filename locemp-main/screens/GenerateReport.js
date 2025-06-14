import React, { useState, useEffect } from 'react'; 
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { db } from '../services/firebaseAuth';
import { doc, getDoc } from 'firebase/firestore';
import { useEmployee } from '../context/EmployeeContext';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import Icon from "react-native-vector-icons/FontAwesome"; 
import DateTimePickerModal from 'react-native-modal-datetime-picker'; // Date Picker Modal
import moment from 'moment'; // Moment.js to handle date formatting

const GenerateReport = ({navigation}) => {
    const { employeeData } = useEmployee();
    const empId = employeeData?.eid || 'Unknown Employee';
    const [onsiteData, setOnsiteData] = useState([]);
    const [offsiteData, setOffsiteData] = useState([]);
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [reportGenerated, setReportGenerated] = useState(false);
    const [expandedSections, setExpandedSections] = useState({
        onsite: false,
        offsite: false,
        leave: false
    });

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

    // Date Picker State
    const [isStartDatePickerVisible, setStartDatePickerVisible] = useState(false);
    const [isEndDatePickerVisible, setEndDatePickerVisible] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const handleStartDateConfirm = (date) => {
        setStartDate(date);
        setStartDatePickerVisible(false);
    };

    const handleEndDateConfirm = (date) => {
        setEndDate(date);
        setEndDatePickerVisible(false);
    };

    const handleStartDateCancel = () => {
        setStartDatePickerVisible(false);
    };

    const handleEndDateCancel = () => {
        setEndDatePickerVisible(false);
    };

    // Fetch attendance data based on date range
    const fetchAttendanceData = async (collectionName, setData) => {
        try {
            const attendanceRef = doc(db, collectionName, empId);
            const attendanceDoc = await getDoc(attendanceRef);

            if (attendanceDoc.exists()) {
                const attendanceRecords = attendanceDoc.data()?.attendance || [];

                // Filter data based on date range
                const filteredData = attendanceRecords.filter((record) => {
                    // Convert string time (e.g., "23/12/2024, 5:04:22 pm") to Date object
                    const recordDate = moment(record.time, 'DD/MM/YYYY, h:mm:ss a').toDate();

                    // Compare the record's date with the start and end dates
                    if (startDate && endDate) {
                        return recordDate >= startDate && recordDate <= endDate;
                    } else {
                        return true;
                    }
                });

                setData(filteredData);
            } else {
                setData([]);
            }
        } catch (error) {
            console.error(`Error fetching data from ${collectionName}:`, error);
            setErrorMessage('Error fetching attendance data. Please try again later.');
        }
    };

    // Fetch leave requests based on date range
    const fetchLeaveRequests = async () => {
        try {
            const leaveRef = doc(db, 'leaveRequests', empId);
            const leaveDoc = await getDoc(leaveRef);

            if (leaveDoc.exists()) {
                const leaveData = leaveDoc.data()?.leaves || [];

                // Filter leave data based on date range
                const filteredLeaveData = leaveData.filter((leave) => {
                    // Convert ISO date strings to Date objects for comparison
                    const startLeaveDate = new Date(leave.startDate);
                    const endLeaveDate = new Date(leave.endDate);

                    // Check if the leave falls within the selected date range
                    if (startDate && endDate) {
                        return (startLeaveDate >= startDate && startLeaveDate <= endDate) ||
                               (endLeaveDate >= startDate && endLeaveDate <= endDate) ||
                               (startLeaveDate <= startDate && endLeaveDate >= endDate);
                    } else {
                        return true; // Include all if no date range is selected
                    }
                });

                setLeaveRequests(filteredLeaveData);
            } else {
                setLeaveRequests([]);
            }
        } catch (error) {
            console.error('Error fetching leave requests:', error);
            setErrorMessage('Error fetching leave requests. Please try again later.');
        }
    };

    // Fetch both attendance and leave requests
    const generateReport = async () => {
        if (empId === 'Unknown Employee') {
            setErrorMessage('Employee ID is unknown. Cannot generate report.');
            return;
        }

        setLoading(true);
        setErrorMessage('');

        await Promise.all([ 
            fetchAttendanceData('onsiteAttendance', setOnsiteData), 
            fetchAttendanceData('offsiteAttendance', setOffsiteData), 
            fetchLeaveRequests(),
        ]);

        setLoading(false);
        setReportGenerated(true);
    };

    const handleGeneratePDF = () => {
        if (!reportGenerated) {
            setErrorMessage('Please generate the report first before generating the PDF.');
            return;
        }

        const combinedData = [...onsiteData, ...offsiteData, ...leaveRequests];
        if (combinedData.length === 0) {
            setErrorMessage('No records available to generate the PDF.');
            return;
        }
        generatePDF(combinedData);
    };

    // Generate PDF with combined data
    const generatePDF = async (data) => {
        if (!data || data.length === 0) {
            alert('No data to generate the report.');
            return;
        }

        try {
            const employeeName = `${employeeData?.firstName} ${employeeData?.lastName}`; // Assuming you have firstName and lastName in employeeData
        const formattedStartDate = startDate ? moment(startDate).format('MM/DD/YYYY') : 'Not selected';
        const formattedEndDate = endDate ? moment(endDate).format('MM/DD/YYYY') : 'Not selected';
            const onsiteHtml = `
                <h2>Onsite Attendance</h2>
                <table>
                    <tr><th>Date & Time</th><th>Location</th></tr>
                    ${onsiteData.map(item => `
                        <tr>
                            <td>${item.time}</td>
                            <td>Lat: ${item.location.latitude}, Lon: ${item.location.longitude}</td>
                           
                        </tr>
                    `).join('')}
                </table>
            `;
            
            const offsiteHtml = `
                <h2>Offsite Attendance</h2>
                <table>
                    <tr><th>Date & Time</th><th>Location</th></tr>
                    ${offsiteData.map(item => `
                        <tr>
                            <td>${item.time}</td>
                            <td>Lat: ${item.location.latitude}, Lon: ${item.location.longitude}</td>
                           
                        </tr>
                    `).join('')}
                </table>
            `;
            
            const leaveHtml = `
                <h2>Leave Requests</h2>
                <table>
                    <tr><th>Leave Type</th><th>Start Date</th><th>End Date</th><th>Reason</th><th>Status</th></tr>
                    ${leaveRequests.map(item => `
                        <tr>
                            <td>${item.leaveType}</td>
                            <td>${new Date(item.startDate).toLocaleDateString()}</td>
                            <td>${new Date(item.endDate).toLocaleDateString()}</td>
                            <td>${item.reason}</td>
                            <td>${item.status === 'approved' ? 'Approved ✔️' : item.status}</td>
                        </tr>
                    `).join('')}
                </table>
            `;

            const html = `
                <html>
                    <head>
                        <style>
                            body { font-family: Arial, sans-serif; margin: 20px; padding: 0; }
                            .header { text-align: center; margin-bottom: 20px; }
                            .header h1 { margin: 0; font-size: 24px; }
                            .details { margin-bottom: 20px; }
                            .details p { margin: 5px 0; font-size: 14px; }
                            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                            table, th, td { border: 1px solid #ddd; }
                            th, td { padding: 8px; text-align: left; font-size: 12px; }
                            th { background-color: #f4f4f4; }
                        </style>
                    </head>
                    <body>
                        <div class="header">
                            <h1>Attendance and Leave Report</h1>
                        </div>
                        <div class="details">
                            <p><strong>Employee ID:</strong> ${empId}</p>
                            <p><strong>Employee Name:</strong> ${employeeName}</p>
                            <p><strong>From : </strong>${startDate.toLocaleDateString()}</p>
                            <p><strong>To : </strong>${endDate.toLocaleDateString()}</p>
                            <p><strong>Generated On:</strong> ${new Date().toLocaleString()}</p>
                        </div>
                        ${onsiteHtml}
                        ${offsiteHtml}
                        ${leaveHtml}
                    </body>
                </html>
            `;
            const { uri } = await Print.printToFileAsync({ html });
            await Sharing.shareAsync(uri);
        } catch (error) {
            console.error('Failed to generate PDF:', error);
            alert('Error generating the PDF. Please try again.');
        }
    };
   
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Attendance and Leave Report</Text>
            
            {/* Date Picker Section */}
            <Text>Start Date:</Text>
            <View style={styles.dateContainer}>
                <TouchableOpacity onPress={() => setStartDatePickerVisible(true)}>
                    <TextInput
                        style={[styles.dateInput, { fontWeight: 'bold' ,color:'black'}]} // Make text bold
                        value={startDate ? moment(startDate).format('MM/DD/YYYY') : 'Select Start Date'}
                        editable={false}
                    />
                </TouchableOpacity>
                <DateTimePickerModal
                    isVisible={isStartDatePickerVisible}
                    mode="date"
                    date={startDate || new Date()}
                    onConfirm={handleStartDateConfirm}
                    onCancel={handleStartDateCancel}
                />
            </View>

            <Text>End Date:</Text>
            <View style={styles.dateContainer}>
                <TouchableOpacity onPress={() => setEndDatePickerVisible(true)}>
                    <TextInput
                        style={[styles.dateInput, { fontWeight: 'bold' ,color:'black'}]} // Make text bold
                        value={endDate ? moment(endDate).format('MM/DD/YYYY') : 'Select End Date'}
                        editable={false}
                    />
                </TouchableOpacity>
                <DateTimePickerModal
                    isVisible={isEndDatePickerVisible}
                    mode="date"
                    date={endDate || new Date()}
                    onConfirm={handleEndDateConfirm}
                    onCancel={handleEndDateCancel}
                />
            </View>
            <View style={{ marginBottom: 30 }}>
            <Button title="Generate Report" onPress={generateReport} disabled={loading} color="lightseagreen" style={{ marginBottom: 30 }} />
            </View>
            {/* Display Buttons after generating the report */}
            {reportGenerated && (
                <>
                <View style={{ marginBottom: 30 }}>
  <Button title="Generate PDF" onPress={handleGeneratePDF} color="lightseagreen" />
</View>

<View style={{ marginBottom: 30 }}>
  <Button
    color="lightseagreen"
    title="Onsite Attendance"
    onPress={() => setExpandedSections({ ...expandedSections, onsite: !expandedSections.onsite })}
  />
</View>


{expandedSections.onsite && (
                 <FlatList
                                            data={onsiteData}
                                            renderItem={({ item }) => (
                                                <View style={styles.dataItem}>
                                                    <Text>Date: {item.time}</Text>
                                                    <Text>Location: Lat: {item.location.latitude}, Lon: {item.location.longitude}</Text>
                                                </View>
                                            )}
                                            keyExtractor={(item, index) => index.toString()}
                                        />
            )}
<View style={{ marginBottom: 30 }}>
  <Button
    color="lightseagreen"
    title="Offsite Attendance"
    onPress={() => setExpandedSections({ ...expandedSections, offsite: !expandedSections.offsite })}
  />
</View>

{expandedSections.offsite && (
                <FlatList
                                           data={offsiteData}
                                           renderItem={({ item }) => (
                                               <View style={styles.dataItem}>
                                                   <Text>Date: {item.time}</Text>
                                                   <Text>Location: Lat: {item.location.latitude}, Lon: {item.location.longitude}</Text>
                                               </View>
                                           )}
                                           keyExtractor={(item, index) => index.toString()}
                                       />
            )}

<View style={{ marginBottom: 30 }}>
  <Button
    color="lightseagreen"
    title="Leave Requests"
    onPress={() => setExpandedSections({ ...expandedSections, leave: !expandedSections.leave })}
  />
</View>

{expandedSections.leave && (
                 <FlatList
                                            data={leaveRequests}
                                            renderItem={({ item }) => (
                                                <View style={styles.dataItem}>
                                                    <Text>Leave Type: {item.leaveType}</Text>
                                                    <Text>Start Date: {new Date(item.startDate).toLocaleDateString()}</Text>
                                                    <Text>End Date: {new Date(item.endDate).toLocaleDateString()}</Text>
                                                    <Text>Reason: {item.reason}</Text>
                                                    <Text>Status: {item.status === 'approved' ? 'Approved ✔' : item.status}</Text>
                                                </View>
                                            )}
                                            keyExtractor={(item, index) => index.toString()}
                                        />
            )}
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor:'antiquewhite',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonContainer: {
        marginBottom: 10, // Space between buttons
      },
    dateInput: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 10,
        fontWeight:'bold',
        width: 200,
    },
    dataItem:{
        marginBottom: 10,
        padding: 10,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
    }
});

export default GenerateReport;
