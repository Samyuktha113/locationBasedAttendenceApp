import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { LinearGradient } from 'expo-linear-gradient';

export default function DashboardScreen({ navigation }) {

  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: "#faebd7",
        shadowColor: "transparent",
        elevation: 0,
      },
      headerTintColor: "#000",
      headerRight: () => (
        <TouchableOpacity onPress={handleLogout} style={styles.logoutIcon}>
          <Icon name="sign-out" size={24} color="#000" />
        </TouchableOpacity>
      ),
      headerLeft: () => null,
      headerShown: true,
      title: "",
    });
  }, [navigation]);


  const navigateToProfile = () => navigation.navigate('ViewProfile');
  const navigateToRegister = () => navigation.navigate('Register');
  const navigateToViewAttendance = () => navigation.navigate('ViewAttendanceScreen');
  const navigateToPersonDetails = () => navigation.navigate('PersonDetails');
  const navigateToRemoveEmployee = () => navigation.navigate('RemoveEmployee');
  const navigateToMap = () => navigation.navigate('MapScreen');
  const navigateToAdminMap = () => navigation.navigate('AdminMap'); // Navigation to AdminMap
  const navigateToSalary = () => navigation.navigate('SalaryScreen');
  const navigateToAlerts = () => navigation.navigate('Alerts'); // Define Alerts Navigation
  const navigateToAdminGenerateReport = () => navigation.navigate('AdminGenerateReport'); // Define Report Navigation

  const handleLogout = async () => {
    try {
      console.log("User logged out");
      navigation.navigate("HomeScreen");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (

        <View>
          <StatusBar barStyle="dark-content" backgroundColor="#faebd7" />
          
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.row}>
          <TouchableOpacity onPress={navigateToProfile} style={styles.button}>
            <View style={styles.buttonContent}>
              <Icon name="user" size={30} color="#000" />
              <Text style={styles.buttonText}>View Profile</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={navigateToRegister} style={styles.button}>
            <View style={styles.buttonContent}>
              <Icon name="plus" size={30} color="#000" />
              <Text style={styles.buttonText}>Register an Employee</Text>
            </View>
          </TouchableOpacity>
        </View>

        
        <View style={styles.row}>
          <TouchableOpacity onPress={navigateToPersonDetails} style={styles.button}>
            <View style={styles.buttonContent}>
              <Icon name="list" size={30} color="#000" />
              <Text style={styles.buttonText}>View Employee Details</Text>
            </View>
          </TouchableOpacity>
      

       
          <TouchableOpacity onPress={navigateToSalary} style={styles.button}>
            <View style={styles.buttonContent}>
              <Icon name="money" size={30} color="#000" />
              <Text style={styles.buttonText}>View Salary</Text>
            </View>
          </TouchableOpacity>
          </View>

 <View style={styles.row}>
          <TouchableOpacity onPress={navigateToRemoveEmployee} style={styles.button}>
            <View style={styles.buttonContent}>
              <Icon name="trash" size={30} color="#000" />
              <Text style={styles.buttonText}>Remove Employee</Text>
            </View>
          </TouchableOpacity>
       

       
          <TouchableOpacity onPress={navigateToAlerts} style={styles.button}>
            <View style={styles.buttonContent}>
              <Icon name="bell" size={30} color="#000" />
              <Text style={styles.buttonText}>Alerts</Text>
            </View>
          </TouchableOpacity>
          </View>

          <View style={styles.row}>
          <TouchableOpacity onPress={navigateToAdminGenerateReport} style={styles.button}>
            <View style={styles.buttonContent}>
              <Icon name="file-pdf-o" size={30} color="#000" />
              <Text style={styles.buttonText}>Generate Report</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    <View/>

    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>

      {/* First Row */}
      <View style={styles.row}>
        <TouchableOpacity onPress={navigateToProfile} style={styles.button}>
          <LinearGradient colors={['#f5a623', '#f76b1c']} start={[0, 0]} end={[1, 1]} style={styles.gradient}>
            <Icon name="user" size={30} color="#fff" />
            <Text style={styles.buttonText}>View Profile</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={navigateToRegister} style={styles.button}>
          <LinearGradient colors={['#00c6ff', '#0072ff']} start={[0, 0]} end={[1, 1]} style={styles.gradient}>
            <Icon name="calendar" size={30} color="#fff" />
            <Text style={styles.buttonText}>Register an Employee</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Second Row */}
      
      <View style={styles.row}>
        <TouchableOpacity onPress={navigateToPersonDetails} style={styles.button}>
          <LinearGradient colors={['#ff5f6d', '#ffc371']} start={[0, 0]} end={[1, 1]} style={styles.gradient}>
            <Icon name="briefcase" size={30} color="#fff" />
            <Text style={styles.buttonText}>View all Employee Details</Text>
          </LinearGradient>
        </TouchableOpacity>
   

      
        <TouchableOpacity onPress={navigateToSalary} style={styles.button}>
          <LinearGradient colors={['#1e6de2', '#0a0110']} start={[0, 0]} end={[1, 1]} style={styles.gradient}>
            <Icon name="money" size={30} color="#fff" />
            <Text style={styles.buttonText}>Salary</Text>
          </LinearGradient>
        </TouchableOpacity>
        </View>
         {/* Third Row */}
      <View style={styles.row}>
        <TouchableOpacity onPress={navigateToRemoveEmployee} style={styles.button}>
          <LinearGradient colors={['#8e2de2', '#4a00e0']} start={[0, 0]} end={[1, 1]} style={styles.gradient}>
            <Icon name="tasks" size={30} color="#fff" />
            <Text style={styles.buttonText}>Remove an Employee</Text>
          </LinearGradient>
        </TouchableOpacity>
    

    
        <TouchableOpacity onPress={navigateToAlerts} style={styles.button}>
          <LinearGradient colors={['#ff512f', '#dd2476']} start={[0, 0]} end={[1, 1]} style={styles.gradient}>
            <Icon name="warning" size={30} color="#fff" />
            <Text style={styles.buttonText}>Alerts</Text>
          </LinearGradient>
        </TouchableOpacity>
        </View>

        {/* Generate Report */}
          {/* Alerts Row */}
      <View style={styles.row}>
        <TouchableOpacity onPress={navigateToAdminGenerateReport} style={styles.button}>
          <LinearGradient
            colors={['#34e89e', '#0f3443']}
            start={[0, 0]}
            end={[1, 1]}
            style={styles.gradient}
          >
            <Icon name="file" size={30} color="#fff" />
            <Text style={styles.buttonText}>Generate Report</Text>
          </LinearGradient>
        </TouchableOpacity>
     

     
        <TouchableOpacity onPress={handleLogout} style={styles.button}>
          <LinearGradient colors={['#ff512f', '#dd2476']} start={[0, 0]} end={[1, 1]} style={styles.gradient}>
            <Icon name="sign-out" size={30} color="#fff" />
            <Text style={styles.buttonText}>Logout</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
</View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#faebd7",
    padding: 10,
    justifyContent: "space-between",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    marginVertical: 5,
    minHeight: 165,
    borderRadius: 10,
    backgroundColor: "#20b2aa",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContent: {
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  logoutIcon: {
    marginRight: 15,
  },
});
