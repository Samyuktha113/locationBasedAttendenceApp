import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import RegisterScreen from './screens/RegisterScreen';
import LoginScreen from './screens/LoginScreen';
import  OnsiteMarkAttendance from './screens/OnsiteMarkAttendance';
import OffsiteMarkAttendance from './screens/OffsiteMarkAttendance';
import DashboardScreen from './screens/DashboardScreen';
import ManagerDashboard from './screens/ManagerDashboard';
import AdminDashboard from './screens/AdminDashboard';
import PersonDetails from './screens/PersonDetails';
import ManagerLogin from './screens/ManagerLogin';
import AdminLogin from './screens/AdminLogin';
import ModifyScreen from './screens/ModifyScreen';
import ViewProfile from './screens/ViewProfile';
import ViewAttendance from './screens/ViewAttendance';
import RemoveEmployee from './screens/RemoveEmployee';
import GetOnsiteWorkDetails from './screens/GetOnsiteWorkDetails';
import ChangePasswordScreen from './screens/changepasswordscreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './context/AuthContext'; 
// import MapScreen from './screens/MapScreen';
import MarkAttendanceScreen from './screens/MarkAttendanceScreen';
import EmployeeLeave from './screens/EmployeeLeave'; 
import ApplyLeaveScreen from './screens/applyleavescreen'; 
import CheckLeaveStatus from './screens/CheckLeaveStatus'; 
import ViewLeaveRequests from './screens/ViewLeaveRequests'; 
import { EmployeeProvider } from './context/EmployeeContext';
import applyleavescreen from './screens/applyleavescreen';
import ForgotPassword from './screens/ForgotPassword';
// import AdminMap from './screens/Adminmap';
import Alerts from './screens/Alerts';
import LeaveScreen from './screens/LeaveScreen';
import AddRemarks from './screens/AddRemarks';
import ViewRemarks from './screens/ViewRemarks';
import Salary from './screens/Salary';
import SalaryScreen from './screens/Salary';
import SeeRemovedEmployeesScreen from './screens/SeeRemovedEmployeesScreen';
import GenerateReport from './screens/GenerateReport';
import AdminGenerateReport from './screens/AdminGenerateReport';
import AssignedTasks from './screens/AssignedTasks';
import ViewAssignedTask from './screens/ViewAssignedTask';
import 'react-native-get-random-values';
import ViewSalary from './screens/ViewSalary'; 
import ViewCalculatedSalary from './screens/ViewCalculatedSalary';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
     <EmployeeProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen name='HomeScreen' component={HomeScreen} />
        <Stack.Screen name='Login' component={LoginScreen} />
        <Stack.Screen name='Register' component={RegisterScreen} />
        <Stack.Screen name='Dashboard' component={DashboardScreen} />
        <Stack.Screen name='ChangePasswordScreen' component={ChangePasswordScreen} />
        <Stack.Screen name="MarkAttendanceScreen" component={MarkAttendanceScreen}  />
        {/* <Stack.Screen name='MapScreen' component={MapScreen} /> */}
        <Stack.Screen name='applyleavescreen' component={applyleavescreen} />
        <Stack.Screen name="LeaveScreen" component={LeaveScreen}   />
        <Stack.Screen name='ForgotPassword' component={ForgotPassword} />
        {/* <Stack.Screen name="AdminMap" component={AdminMap}   /> */}
        <Stack.Screen name='ManagerDashboard' component={ManagerDashboard} />
        <Stack.Screen name='ManagerLogin' component={ManagerLogin} />
        <Stack.Screen name='GetOnsiteWorkDetails' component={GetOnsiteWorkDetails} />
        <Stack.Screen name='OnsiteMarkAttendance' component={OnsiteMarkAttendance} />
        <Stack.Screen name='OffsiteMarkAttendance' component={OffsiteMarkAttendance} />
        <Stack.Screen name='AdminLogin' component={AdminLogin} />
        <Stack.Screen name='AdminDashboard' component={AdminDashboard} />
        <Stack.Screen name='PersonDetails' component={PersonDetails} />
        <Stack.Screen name='ModifyScreen' component={ModifyScreen} />
        <Stack.Screen name='ViewProfile' component={ViewProfile} />
        <Stack.Screen name='ViewAttendance' component={ViewAttendance} />
        <Stack.Screen name='EmployeeLeave' component={EmployeeLeave} />
        <Stack.Screen name='ApplyLeaveScreen' component={ApplyLeaveScreen} />
        <Stack.Screen name='ViewLeaveRequests' component={ViewLeaveRequests} />
        <Stack.Screen name='CheckLeaveStatus' component={CheckLeaveStatus} />
        <Stack.Screen name='RemoveEmployee' component={RemoveEmployee} />
        <Stack.Screen name='SalaryScreen' component={SalaryScreen} />
        <Stack.Screen name='AddRemarks' component={AddRemarks} />
        <Stack.Screen name='ViewRemarks' component={ViewRemarks} />
        <Stack.Screen name='Alerts' component={Alerts} />
        <Stack.Screen name='SeeRemovedEmployeesScreen' component={SeeRemovedEmployeesScreen} />
        <Stack.Screen name='GenerateReport' component={GenerateReport} />
        <Stack.Screen name='AdminGenerateReport' component={AdminGenerateReport} />
        <Stack.Screen name='AssignedTasks' component={AssignedTasks} />
        <Stack.Screen name='ViewAssignedTask' component={ViewAssignedTask} />
        <Stack.Screen name='ViewSalary' component={ViewSalary} />
        <Stack.Screen name='ViewCalculatedSalary' component={ViewCalculatedSalary} />

      </Stack.Navigator>
    </NavigationContainer>
    </EmployeeProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
