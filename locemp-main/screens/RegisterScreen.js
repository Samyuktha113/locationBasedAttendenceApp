import React, { useState ,useEffect} from "react";
import { 
    Button, 
    Text, 
    TextInput, 
    View, 
    ScrollView, 
    TouchableOpacity, 
    StyleSheet,
    Alert, 
    Platform 
} from "react-native";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { 
    collection, 
    getDoc, 
    setDoc, 
    doc, 
    updateDoc, 
    increment 
} from 'firebase/firestore';
import { auth, db } from '../services/firebaseAuth';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import Icon from "react-native-vector-icons/FontAwesome"; 

export default function RegisterScreen({ navigation }) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('12345678');
    const [dob, setDob] = useState(new Date());
    const [joinDate, setJoinDate] = useState(new Date());
    const [showDobPicker, setShowDobPicker] = useState(false);
    const [showJoinDatePicker, setShowJoinDatePicker] = useState(false);
    const [position, setPosition] = useState('');
    const [salary, setSalary] = useState('');
    const [address, setAddress] = useState('');
    const [offsiteAddress, setOffsiteAddress] = useState('');
    const [onsiteAddress, setOnsiteAddress] = useState('');
    const [contact, setContact] = useState('');
    const [adhaar, setAdhaar] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
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

    const validateEmail = (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
    const validateContact = (contact) => /^[0-9]{10}$/.test(contact);
    const validateAdhaar = (adhaar) => /^[0-9]{4}[\s]?[0-9]{4}[\s]?[0-9]{4}$/.test(adhaar);
    const calculateAge = (dob) => {
        const currentDate = new Date();
        const age = currentDate.getFullYear() - dob.getFullYear();
        const month = currentDate.getMonth() - dob.getMonth();
        return (month < 0 || (month === 0 && currentDate.getDate() < dob.getDate())) ? age - 1 : age;
    };

    const handleRegister = async () => {
        setError('');
        setLoading(true);

        // if (!firstName || !lastName || !email || !contact || !adhaar || !position || !salary || !address || !offsiteAddress || !onsiteAddress ) {
        //     setError('All fields are required');
        //     setLoading(false);
        //     return;
        // }

        if (!validateEmail(email)) {
            setError('Invalid email format');
            setLoading(false);
            return;
        }

        if (!validateContact(contact)) {
            setError('Contact number should be 10 digits');
            setLoading(false);
            return;
        }

        if (!validateAdhaar(adhaar)) {
            setError('Aadhaar number should be 12 digits (XXXX XXXX XXXX)');
            setLoading(false);
            return;
        }

        if (calculateAge(dob) < 18) {
            setError('You must be at least 18 years old');
            setLoading(false);
            return;
        }

        try {
            const collectionName = position.toLowerCase() === 'manager' ? 'managers' : position.toLowerCase() === 'admin' ? 'admins' : 'employees';
            const idDocRef = doc(db, 'systemInfo', 'employeeIdTracker');
            const idDoc = await getDoc(idDocRef);
            const maxId = idDoc.exists() ? idDoc.data().maxId : 0;
            const employeeId = `${firstName.trim()}${maxId + 1}`;
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            await setDoc(doc(db, collectionName, employeeId), {
                firstName,
                lastName,
                email,
                dateOfBirth: dob.toISOString().split('T')[0],
                eid: employeeId,
                position,
                salary,
                address,
                
                onsiteAddress,
                contact,
                adhaar,
                createdAt: new Date(),
                requiresPasswordChange: true,
                joinDate: joinDate.toISOString().split('T')[0],
            });

            await updateDoc(idDocRef, { maxId: increment(1) });
            Alert.alert("Registration Successful", `Employee ID is: ${employeeId}`, [{
                text: "OK", 
                onPress: () => navigation.navigate('AdminDashboard'),
            }]);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#000000', marginBottom: 20 }}>Register Employee</Text>
            <TextInput onChangeText={setFirstName} placeholder="First Name" style={{ borderWidth: 1, borderColor: 'gray', width: 250, padding: 10, marginBottom: 10, borderRadius: 5 }} />
            <TextInput onChangeText={setLastName} placeholder="Last Name" style={{ borderWidth: 1, borderColor: 'gray', width: 250, padding: 10, marginBottom: 10, borderRadius: 5 }} />
            <TextInput value={adhaar} onChangeText={(text) => setAdhaar(text.replace(/\D/g, '').replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3'))} placeholder="Aadhaar Number" keyboardType="numeric" style={{ borderWidth: 1, borderColor: 'gray', width: 250, padding: 10, marginBottom: 10, borderRadius: 5 }} />
            <TextInput value={email} onChangeText={setEmail} placeholder="Email" keyboardType="email-address" style={{ borderWidth: 1, borderColor: 'gray', width: 250, padding: 10, marginBottom: 10, borderRadius: 5 }} />
            <TextInput value={contact} onChangeText={setContact} placeholder="Contact Number" keyboardType="numeric" style={{ borderWidth: 1, borderColor: 'gray', width: 250, padding: 10, marginBottom: 10, borderRadius: 5 }} />
            <TextInput value={salary} onChangeText={setSalary} placeholder="Salary" keyboardType="numeric" style={{ borderWidth: 1, borderColor: 'gray', width: 250, padding: 10, marginBottom: 10, borderRadius: 5 }} />
            <TextInput value={address} onChangeText={setAddress} placeholder="Address (offsite)" style={{ borderWidth: 1, borderColor: 'gray', width: 250, padding: 10, marginBottom: 10, borderRadius: 5 }} />
           
            <TextInput value={onsiteAddress} onChangeText={setOnsiteAddress} placeholder="Onsite Address" style={{ borderWidth: 1, borderColor: 'gray', width: 250, padding: 10, marginBottom: 10, borderRadius: 5 }} />
           
            <Picker selectedValue={position} onValueChange={setPosition} style={{ width: 250, marginBottom: 20 }} >
                <Picker.Item label="Employee" value="Employee" />
                <Picker.Item label="Manager" value="Manager" />
                <Picker.Item label="Admin" value="Admin" />
            </Picker>
            <Text style={{ marginBottom: 5, fontWeight: 'bold' }}>Date of Birth(MM/DD/YY)</Text>
            <TouchableOpacity onPress={() => setShowDobPicker(true)}>
                <Text style={{ borderWidth: 1, borderColor: 'gray', width: 250, padding: 10, marginBottom: 10, borderRadius: 5 }}>{dob ? dob.toLocaleDateString() : 'Select Date of Birth'}</Text>
            </TouchableOpacity>
            {showDobPicker && <DateTimePicker value={dob} mode="date" display="default" onChange={(event, selectedDate) => { setDob(selectedDate || dob); setShowDobPicker(false); }} />}
            <Text style={{ marginBottom: 5, fontWeight: 'bold' }}>Join Date(MM/DD/YY)</Text>
            <TouchableOpacity onPress={() => setShowJoinDatePicker(true)}>
                <Text style={{ borderWidth: 1, borderColor: 'gray', width: 250, padding: 10, marginBottom: 10, borderRadius: 5 }}>{joinDate ? joinDate.toLocaleDateString() : 'Select Join Date'}</Text>
            </TouchableOpacity>
            {showJoinDatePicker && <DateTimePicker value={joinDate} mode="date" display="default" onChange={(event, selectedDate) => { setJoinDate(selectedDate || joinDate); setShowJoinDatePicker(false); }} />}

            <Button title="Register" onPress={handleRegister} disabled={loading} color="lightseagreen"/>
            {error && <Text style={{ color: 'red', marginTop: 10 }}>{error}</Text>}
        </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'antiquewhite', // Background color
        padding: 20,
    },
    textcontainer:{
      fontWeight:'bold',
  
        
    },
});
