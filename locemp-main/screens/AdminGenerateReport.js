import { View, Text,  StyleSheet, FlatList, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { db } from '../services/firebaseAuth';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { useEmployee } from '../context/EmployeeContext';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import DateTimePickerModal from 'react-native-modal-datetime-picker'; // Date Picker Modal
import moment from 'moment'; // Moment.js to handle date formatting
import RNPickerSelect from 'react-native-picker-select'; // Importing the Picker for dropdown
import { Button } from 'react-native-elements'; // This should support buttonStyle
import Ionicons from 'react-native-vector-icons/Ionicons'; // Importing Ionicons for delete icon
import Icon from "react-native-vector-icons/FontAwesome";
const AdminGenerateReport = ({navigation}) => {
    const { employeeData } = useEmployee();
    const empId = employeeData?.eid || 'Unknown Employee';
    const [employeeList, setEmployeeList] = useState([]); // State to hold the list of employees
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(empId); // State for selected employee
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
    // Fetch the list of employees from the database
    const fetchEmployeeList = async () => {
        try {
            const employeesRef = collection(db, 'employees');
            const employeesSnapshot = await getDocs(employeesRef);
            const employees = employeesSnapshot.docs.map(doc => ({
                label: doc.data().eid,
                value: doc.id,
            }));
            setEmployeeList(employees);
        } catch (error) {
            console.error('Error fetching employee list:', error);
        }
    };

    useEffect(() => {
        fetchEmployeeList(); // Fetch employee list when component mounts
    }, []);

    const fetchLeaveRequests = async () => {
        try {
            const leaveRef = doc(db, 'leaveRequests', selectedEmployeeId);
            const leaveDoc = await getDoc(leaveRef);

            if (leaveDoc.exists()) {
                const leaveData = leaveDoc.data()?.leaves || [];

                const filteredLeaveData = leaveData.filter((leave) => {
                    const startLeaveDate = new Date(leave.startDate);
                    const endLeaveDate = new Date(leave.endDate);

                    if (startDate && endDate) {
                        return (startLeaveDate >= startDate && startLeaveDate <= endDate) ||
                               (endLeaveDate >= startDate && endLeaveDate <= endDate) ||
                               (startLeaveDate <= startDate && endLeaveDate >= endDate);
                    } else {
                        return true;
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

    const fetchAttendanceData = async (collectionName, setData) => {
        try {
            const attendanceRef = doc(db, collectionName, selectedEmployeeId);
            const attendanceDoc = await getDoc(attendanceRef);
    
            if (attendanceDoc.exists()) {
                const attendanceRecords = attendanceDoc.data()?.attendance || [];
    
                const filteredData = attendanceRecords.filter((record) => {
                    const recordDate = moment(record.time, 'DD/MM/YYYY, h:mm:ss a').toDate();
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

    const generateReport = async () => {
        if (selectedEmployeeId === 'Unknown Employee') {
            setErrorMessage('Employee ID is unknown. Cannot generate report.');
            return;
        }

        setLoading(true);
        setErrorMessage('');

        try {
            await Promise.all([
                fetchAttendanceData('onsiteAttendance', setOnsiteData),
                fetchAttendanceData('offsiteAttendance', setOffsiteData),
                fetchLeaveRequests(),
            ]);
            setReportGenerated(true);
        } catch (error) {
            console.error('Error generating report:', error);
            setErrorMessage('Error generating report. Please try again later.');
        }

        setLoading(false);
    };

 
    
    const generatePDF = async (data) => {
                if (!data || data.length === 0) {
                    alert('No data to generate the report.');
                    return;
                }
        
                try {
                    const employeeName =` ${employeeData?.firstName} ${employeeData?.lastName}`; // Assuming you have firstName and lastName in employeeData
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
                                    <td>${item.status === 'approved' ? 'Approved ✔' : item.status}</td>
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
                                    <p><strong>Employee ID:</strong> ${selectedEmployeeId}</p>
                                    <p><strong>Generated by Admin Name:</strong> ${employeeName}</p>
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

    // const renderReportData = () => {
    //     if (reportGenerated) {
    //         return (
    //             <ScrollView style={styles.reportContainer}>
    //                 {/* Onsite Data */}
    //                 <View style={styles.section}>
    //                     <Text style={styles.sectionTitle}>Onsite Attendance</Text>
    //                     <FlatList
    //                         data={onsiteData}
    //                         renderItem={({ item }) => (
    //                             <View style={styles.dataItem}>
    //                                 <Text>Date: {item.time}</Text>
    //                                 <Text>Location: Lat: {item.location.latitude}, Lon: {item.location.longitude}</Text>
    //                             </View>
    //                         )}
    //                         keyExtractor={(item, index) => index.toString()}
    //                     />
    //                 </View>

    //                 {/* Offsite Data */}
    //                 <View style={styles.section}>
    //                     <Text style={styles.sectionTitle}>Offsite Attendance</Text>
    //                     <FlatList
    //                         data={offsiteData}
    //                         renderItem={({ item }) => (
    //                             <View style={styles.dataItem}>
    //                                 <Text>Date: {item.time}</Text>
    //                                 <Text>Location: Lat: {item.location.latitude}, Lon: {item.location.longitude}</Text>
    //                             </View>
    //                         )}
    //                         keyExtractor={(item, index) => index.toString()}
    //                     />
    //                 </View>

    //                 {/* Leave Requests */}
    //                 <View style={styles.section}>
    //                     <Text style={styles.sectionTitle}>Leave Requests</Text>
    //                     <FlatList
    //                         data={leaveRequests}
    //                         renderItem={({ item }) => (
    //                             <View style={styles.dataItem}>
    //                                 <Text>Leave Type: {item.leaveType}</Text>
    //                                 <Text>Start Date: {new Date(item.startDate).toLocaleDateString()}</Text>
    //                                 <Text>End Date: {new Date(item.endDate).toLocaleDateString()}</Text>
    //                                 <Text>Reason: {item.reason}</Text>
    //                                 <Text>Status: {item.status === 'approved' ? 'Approved ✔' : item.status}</Text>
    //                             </View>
    //                         )}
    //                         keyExtractor={(item, index) => index.toString()}
    //                     />
    //                 </View>
    //             </ScrollView>
    //         );
    //     } else {
    //         return <Text>No report generated yet. Please click on "Generate Report" first.</Text>;
    //     }
    // };
    const renderReportData = () => {
        if (reportGenerated) {
            const combinedData = [
                { type: 'onsite', data: onsiteData },
                { type: 'offsite', data: offsiteData },
                { type: 'leave', data: leaveRequests },
            ];
    
            return (
                <FlatList
                    data={combinedData}
                    keyExtractor={(item, index) => `${item.type}-${index}`}
                    renderItem={({ item }) => {
                        switch (item.type) {
                            case 'onsite':
                                return (
                                    <View style={styles.section}>
                                        <Text style={styles.sectionTitle}>Onsite Attendance</Text>
                                        {item.data.map((dataItem, index) => (
                                            <View key={index} style={styles.dataItem}>
                                                <Text>Date: {dataItem.time}</Text>
                                                <Text>Location: Lat: {dataItem.location.latitude}, Lon: {dataItem.location.longitude}</Text>
                                            </View>
                                        ))}
                                    </View>
                                );
                            case 'offsite':
                                return (
                                    <View style={styles.section}>
                                        <Text style={styles.sectionTitle}>Offsite Attendance</Text>
                                        {item.data.map((dataItem, index) => (
                                            <View key={index} style={styles.dataItem}>
                                                <Text>Date: {dataItem.time}</Text>
                                                <Text>Location: Lat: {dataItem.location.latitude}, Lon: {dataItem.location.longitude}</Text>
                                            </View>
                                        ))}
                                    </View>
                                );
                            case 'leave':
                                return (
                                    <View style={styles.section}>
                                        <Text style={styles.sectionTitle}>Leave Requests</Text>
                                        {item.data.map((dataItem, index) => (
                                            <View key={index} style={styles.dataItem}>
                                                <Text>Leave Type: {dataItem.leaveType}</Text>
                                                <Text>Start Date: {new Date(dataItem.startDate).toLocaleDateString()}</Text>
                                                <Text>End Date: {new Date(dataItem.endDate).toLocaleDateString()}</Text>
                                                <Text>Reason: {dataItem.reason}</Text>
                                                <Text>Status: {dataItem.status === 'approved' ? 'Approved ✔' : dataItem.status}</Text>
                                            </View>
                                        ))}
                                    </View>
                                );
                            default:
                                return null;
                        }
                    }}
                />
            );
        } else {
            return <Text>No report generated yet. Please click on "Generate Report" first.</Text>;
        }
    };
    

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Attendance and Leave Report</Text>

            {/* Employee Dropdown */}
            <Text>Select Employee:</Text>
            <RNPickerSelect
                onValueChange={(value) => setSelectedEmployeeId(value)}
                items={employeeList}
                value={selectedEmployeeId}
                style={pickerSelectStyles}
            />

            {/* Date Picker Section */}
            <Text>Start Date:</Text>
            <View style={styles.dateContainer}>
                <TouchableOpacity onPress={() => setStartDatePickerVisible(true)}>
                    <TextInput
                        style={styles.dateInput}
                        editable={false}
                        placeholder="Select Start Date"
                        value={startDate ? startDate.toLocaleDateString() : ''}
                    />
                </TouchableOpacity>
            </View>

            <Text>End Date:</Text>
            <View style={styles.dateContainer}>
                <TouchableOpacity onPress={() => setEndDatePickerVisible(true)}>
                    <TextInput
                        style={styles.dateInput}
                        editable={false}
                        placeholder="Select End Date"
                        value={endDate ? endDate.toLocaleDateString() : ''}
                    />
                </TouchableOpacity>
            </View>

            {/* DateTimePicker Modals */}
            <DateTimePickerModal
                isVisible={isStartDatePickerVisible}
                mode="date"
                onConfirm={handleStartDateConfirm}
                onCancel={handleStartDateCancel}
            />
            <DateTimePickerModal
                isVisible={isEndDatePickerVisible}
                mode="date"
                onConfirm={handleEndDateConfirm}
                onCancel={handleEndDateCancel}
            />

            {/* Error and Report Generation Section */}
            {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
            <Button
                title={loading ? 'Generating Report...' : 'Generate Report'}
                onPress={generateReport}
                disabled={loading}
                 buttonStyle={styles.lightSeaGreenButton}
                 
               
            />

            <Button
                title="Generate PDF"
                onPress={generatePDF}
                disabled={!reportGenerated}
                buttonStyle={styles.lightSeaGreenButton}
            />

            {/* Render the Report Data */}
            {renderReportData()}
        </View>
    );
};

const pickerSelectStyles = StyleSheet.create({
    inputAndroid: {
        height: 40,
        paddingHorizontal: 10,
        backgroundColor: 'antiquewhite',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 10,
    },
    inputIOS: {
        height: 40,
        paddingHorizontal: 10,
        backgroundColor: 'antiquewhite',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 10,
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor:'antiquewhite',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    dateContainer: {
        marginBottom: 10,
    },
    dateInput: {
        paddingHorizontal: 10,
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
    },
    error: {
        color: 'red',
        marginBottom: 10,
    },
   
     
    reportContainer: {
        marginTop: 20,
        backgroundColor:'antiquewhite'
    },
    section: {
        marginBottom: 20,
        
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    dataItem: {
        marginBottom: 10,
        padding: 10,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
    },
    lightSeaGreenButton: {
        backgroundColor: 'lightseagreen',
         marginBottom: 10 ,
      },
    
});

export default AdminGenerateReport;
