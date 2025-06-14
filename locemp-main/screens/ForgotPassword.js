import { useState,useEffect } from 'react';
import { Button, Text, TextInput, View, StyleSheet, Modal } from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth, db } from '../services/firebaseAuth'; // Import db to access the database
import { Timestamp, doc, getDoc, setDoc } from 'firebase/firestore'; // Import Firestore methods
import { useEmployee } from '../context/EmployeeContext';

export default function ForgotPassword({ navigation }) {
    const [userId, setUserId] = useState(''); // Renamed from employeeId to userId
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [showModal, setShowModal] = useState(false); // Modal state
    const { employeeData } = useEmployee(); // Get employee data from context
  
    useEffect(() => {
              navigation.setOptions({
                headerStyle: {
                  backgroundColor: "#faebd7", // Background color to match the screen
                  shadowColor: "transparent", // Remove shadow from the header
                  elevation: 0, // Remove Android header elevation
                },
                headerTintColor: "#000", // Set icon and text color to dark
                // headerRight: () => (
                //   <TouchableOpacity onPress={handleLogout} style={styles.logoutIcon}>
                //     <Icon name="sign-out" size={24} color="#000" />
                //   </TouchableOpacity>
                // ),
                headerLeft: () => null, // Remove the back arrow
                headerShown: true, // Show header for logout icon
               
                title: "", // Remove title
              });
            }, [navigation]);
    const handleForgotPassword = async () => {
        setError('');
        setMessage('');

        try {
            // Check if userId and email match in the employees, managers, or admins collection
            let userDoc = null;

            // Check in 'employees' collection
            userDoc = await getDoc(doc(db, "employees", userId));
            if (!userDoc.exists()) {
                // Check in 'managers' collection
                userDoc = await getDoc(doc(db, "managers", userId));
            }
            if (!userDoc.exists()) {
                // Check in 'admin' collection
                userDoc = await getDoc(doc(db, "admin", userId));
            }

            if (!userDoc.exists()) {
                setError("Invalid ID");
                return;
            }

            const userData = userDoc.data();
            const storedEmail = userData.email;

            if (storedEmail !== email) {
                setError("Email does not match the registered email for this ID.");
                return;
            }

            // If both ID and email match, send the reset email
            await sendPasswordResetEmail(auth, email);
            setMessage("Password reset email sent. Please check your inbox.");
            setShowModal(true); // Show modal after email is sent

            // Create an alert entry in Firestore
            const alertDocRef = doc(db, 'alerts', userId.split('-')[0]);

await setDoc(alertDocRef, {
    userId,
    type: 'Password Change',
    description: `User ${userData.firstName} ${userData.lastName} has requested a password reset.`,
    timestamp: Timestamp.now(),
});
            // Reset fields and navigate to the login screen after a delay
            setTimeout(() => {
                setShowModal(false);
                setUserId(''); // Reset the ID field
                setEmail(''); // Reset the Email field
                navigation.navigate('Login'); // Navigate to login screen after popup
            }, 3000); // Wait for 3 seconds before navigating
        } catch (error) {
            setError("Error: " + error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Forgot Password</Text>

            {/* User ID Input */}
            <TextInput
                style={styles.input}
                onChangeText={setUserId}
                placeholder="Enter your ID"
                placeholderTextColor="#aaa"
                value={userId}
            />

            {/* Email Input */}
            <TextInput
                style={styles.input}
                onChangeText={setEmail}
                placeholder="Enter your registered email"
                placeholderTextColor="#aaa"
                value={email}
            />

            <Button title="Send Reset Email" onPress={handleForgotPassword} color="lightseagreen" />

            {error ? <Text style={styles.error}>{error}</Text> : null}
            {message ? <Text style={styles.message}>{message}</Text> : null}

            {/* Popup Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={showModal}
                onRequestClose={() => setShowModal(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>Password reset email has been sent. Please check your inbox.</Text>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'antiquewhite',
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
        color: '#000',
        backgroundColor:'white',
    },
    error: {
        color: '#FF0000',
        marginTop: 10,
        fontSize: 14,
        textAlign: 'center',
    },
    message: {
        color: '#008000',
        marginTop: 10,
        fontSize: 14,
        textAlign: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Black background for modal
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    modalText: {
        fontSize: 16,
        color: '#000',
    },
});
