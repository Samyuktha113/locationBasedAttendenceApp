// ChangePasswordScreen.js
import React, { useState,useEffect } from 'react';
import { View, TextInput, Button, Text, TouchableOpacity } from 'react-native';
import { auth } from '../services/firebaseAuth';
import { updatePassword } from 'firebase/auth';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ChangePasswordScreen = ({ navigation }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [secureTextEntryConfirm, setSecureTextEntryConfirm] = useState(true);

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
  const validatePassword = (password) => {
    // Regular expression for password validation
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!validatePassword(newPassword)) {
      setError('Password must be at least 8 characters long, including at least one uppercase letter, one number, and one special character.');
      return;
    }

    const user = auth.currentUser; // Get the current user
    if (user) {
      try {
        await updatePassword(user, newPassword); // Update password
        alert('Password changed successfully! Please log in with your new password.');
        navigation.navigate('Login'); // Redirect to Login after successful change
      } catch (err) {
        setError(err.message);
      }
    } else {
      setError('No user is currently logged in.');
    }
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 16, backgroundColor: "antiquewhite" }}>
      <Text className="text-2xl font-bold mb-4">Change Password</Text>
      
      {/* New Password Input */}
      <View className="relative mb-4 w-full">
        <TextInput
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry={secureTextEntry}
          placeholder="New Password"
          className="border border-gray-300 w-full p-2 rounded pr-10  bg-white"
        />
        <TouchableOpacity
          onPress={() => setSecureTextEntry(!secureTextEntry)}
          className="absolute right-2 top-2"
        >
          <Ionicons name={secureTextEntry ? "eye-off" : "eye"} size={24} />
        </TouchableOpacity>
      </View>

      {/* Confirm Password Input */}
      <View className="relative mb-4 w-full">
        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={secureTextEntryConfirm}
          placeholder="Confirm Password"
          className="border border-gray-300 w-full p-2 rounded pr-10  bg-white"
        />
        <TouchableOpacity
          onPress={() => setSecureTextEntryConfirm(!secureTextEntryConfirm)}
          className="absolute right-2 top-2"
        >
          <Ionicons name={secureTextEntryConfirm ? "eye-off" : "eye"} size={24} />
        </TouchableOpacity>
      </View>

      {error && <Text className="text-red-500">{error}</Text>}
      <Button title="Change Password"  onPress={handleChangePassword}  color="lightseagreen"  />
    </View>
  );
};

export default ChangePasswordScreen;
