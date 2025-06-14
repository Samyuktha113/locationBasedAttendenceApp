import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome"; // Icons
import { AuthContext } from "../context/AuthContext";

export default function DashboardScreen({ navigation }) {
  const { user } = useContext(AuthContext);

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
    navigation.navigate("ViewProfile", { id: user.eid, role: user.position });
  };

  const navigateToMarkAttendance = () => {
    navigation.navigate("MarkAttendanceScreen", { eid: user?.eid });
  };

  const navigateToViewAttendance = () => {
    navigation.navigate("ViewAttendance", { eid: user?.eid });
  };

  const navigateToLeave = () => {
    navigation.navigate("LeaveScreen", { eid: user?.eid });
  };

  const navigateToViewRemarks = () => {
    navigation.navigate("ViewRemarks", { eid: user?.eid });
  };

  // const navigateToMap = () => {
  //   navigation.navigate("MapScreen", { eid: user?.eid });
  // };

  const navigateToGenerateReport = () => {
    navigation.navigate("GenerateReport", { eid: user?.eid });
  };

  const navigateToAssignedTasks = () => {
    navigation.navigate("AssignedTasks", { eid: user?.eid });
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

            <TouchableOpacity
              onPress={navigateToMarkAttendance}
              style={styles.button}
            >
              <View style={styles.buttonContent}>
                <Icon name="calendar" size={30} color="#000" />
                <Text style={styles.buttonText}>Mark Attendance</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <TouchableOpacity onPress={navigateToViewAttendance} style={styles.button}>
              <View style={styles.buttonContent}>
                <Icon name="table" size={30} color="#000" />
                <Text style={styles.buttonText}>View Attendance</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={navigateToLeave} style={styles.button}>
              <View style={styles.buttonContent}>
                <Icon name="plane" size={30} color="#000" />
                <Text style={styles.buttonText}>Apply Leave</Text>
              </View>
            </TouchableOpacity>
          </View>

            
            <View style={styles.row}>
            <TouchableOpacity onPress={navigateToViewRemarks} style={styles.button}>
              <View style={styles.buttonContent}>
                <Icon name="comments" size={30} color="#000" />
                <Text style={styles.buttonText}>View Remarks</Text>
              </View>
            </TouchableOpacity>
           
             
            <TouchableOpacity onPress={navigateToGenerateReport} style={styles.button}>
              <View style={styles.buttonContent}>
                <Icon name="file-pdf-o" size={30} color="#000" />
                <Text style={styles.buttonText}>Generate Report</Text>
              </View>
            </TouchableOpacity>
         </View>
                     
                      <View style={styles.row}>
             <TouchableOpacity onPress={navigateToAssignedTasks} style={styles.button}>
              <View style={styles.buttonContent}>
                <Icon name="tasks" size={30} color="#000" />
                <Text style={styles.buttonText}>Assigned Tasks</Text>
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
    backgroundColor: "#faebd7", // Background color
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
    fontWeight: "bold",
    marginTop: 10,
  },
  logoutIcon: {
    marginRight: 15,
  },
  scrollView: {
    flexGrow: 1, // Ensure the scroll view grows to fill the screen
  },
});
