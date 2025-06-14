




// import React, { useState, useContext } from "react";
// import { Button, TextInput, Text, View, TouchableOpacity, ActivityIndicator } from "react-native";
// import { signInWithEmailAndPassword } from 'firebase/auth';
// import { doc, getDoc } from 'firebase/firestore';
// import { auth, db } from '../services/firebaseAuth'; 
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import { AuthContext } from '../context/AuthContext'; // Import context for setting user data
// import { useEmployee } from '../context/EmployeeContext'; // Import global employee context

// export default function LoginScreen({ navigation }) {
//     const [employeeId, setEmployeeId] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState('');
//     const [secureTextEntry, setSecureTextEntry] = useState(true);
//     const [isLoading, setIsLoading] = useState(false); // State for loading indicator
//     const { setUser } = useContext(AuthContext); // Get setUser function from context
//     const { setEmployeeData } = useEmployee(); // Get the setter for global employee data

//     const handleLogin = async () => {
//         setError('');
//         setIsLoading(true); // Set loading state to true

//         try {
//             const employeeDoc = await getDoc(doc(db, "employees", employeeId));
//             if (!employeeDoc.exists()) {
//                 setError("Invalid Employee ID");
//                 setIsLoading(false); // Set loading state to false if error occurs
//                 return;
//             }

//             const employeeData = employeeDoc.data();
//             const email = employeeData.email;

//             signInWithEmailAndPassword(auth, email, password)
//                 .then((userCredential) => {
//                     const user = userCredential.user;

//                     // Save employee data globally
//                     setUser({ uid: user.uid, eid: employeeId, email });
//                     setEmployeeData(employeeData); // Save the employee data to global context

//                     if (password === "12345678" && employeeData.requiresPasswordChange) {
//                         navigation.navigate('ChangePasswordScreen', { userId: user.uid, employeeId });
//                     } else {
//                         navigation.navigate('Dashboard');
//                     }
//                 })
//                 .catch((error) => {
//                     setError(error.message);
//                 })
//                 .finally(() => {
//                     setIsLoading(false); // Set loading state to false when operation completes
//                 });
//         } catch (error) {
//             setError("Error logging in: " + error.message);
//             setIsLoading(false); // Set loading state to false if error occurs
//         }
//     };
    
//     return (
//         <View className="flex-1 items-center justify-center bg-white p-4">
//             <Text className="text-3xl font-bold text-blue-600 mb-5">Login</Text>
//             <TextInput
//                 onChangeText={setEmployeeId}
//                 placeholder="Employee ID"
//                 value={employeeId}
//                 className="border border-gray-300 w-full p-3 mb-4 text-black rounded-md"
//             />
//             <View className="relative w-full">
//                 <TextInput
//                     onChangeText={setPassword}
//                     placeholder="Password"
//                     secureTextEntry={secureTextEntry}
//                     value={password}
//                     className="border border-gray-300 w-full p-3 text-black rounded-md"
//                 />
//                 <TouchableOpacity
//                     onPress={() => setSecureTextEntry(!secureTextEntry)}
//                     className="absolute right-2 top-2"
//                 >
//                     <Ionicons name={secureTextEntry ? "eye-off" : "eye"} size={24} />
//                 </TouchableOpacity>
//             </View>
//             <Button title="Login" onPress={handleLogin} color="#1D4ED8" />
//             {isLoading && (
//                 <View style={{ marginTop: 20 }}>
//                     <ActivityIndicator size="large" color="#0000ff" />
//                     <Text>Please wait...</Text>
//                 </View>
//             )}
//             {error && <Text className="text-red-500 mt-2">{error}</Text>}
            
//             {/* Forgot Password Link */}
//             <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
//                 <Text className="text-blue-500 mt-4 underline">Forgot Password?</Text>
//             </TouchableOpacity>
//         </View>
//     );
// }


import React, { useState,useEffect, useContext } from "react";
import {
  Button,
  TextInput,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Animated,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../services/firebaseAuth";
import Ionicons from "react-native-vector-icons/Ionicons";
import { AuthContext } from "../context/AuthContext";
import { useEmployee } from "../context/EmployeeContext";

export default function LoginScreen({ navigation }) {
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [animation] = useState(new Animated.Value(0));
  const { setUser } = useContext(AuthContext);
  const { setEmployeeData } = useEmployee();


 
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

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animation, { toValue: 10, duration: 1000, useNativeDriver: true }),
        Animated.timing(animation, { toValue: 0, duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  }, [animation]);

  const buttonStyle = {
    transform: [{ translateY: animation }],
  };

  const handleLogin = async () => {
    setError("");
    setIsLoading(true);

    try {
      const employeeDoc = await getDoc(doc(db, "employees", employeeId.trim()));
      if (!employeeDoc.exists()) {
        setError("Invalid Employee ID");
        setIsLoading(false);
        return;
      }

      const employeeData = employeeDoc.data();
      const email = employeeData.email;

      signInWithEmailAndPassword(auth, email, password.trim())
        .then((userCredential) => {
          const user = userCredential.user;
          setUser({ uid: user.uid, eid: employeeId.trim(), email });
          setEmployeeData(employeeData);

          if (password === "12345678" && employeeData.requiresPasswordChange) {
            navigation.navigate("ChangePasswordScreen", { userId: user.uid, employeeId });
          } else {
            navigation.navigate("Dashboard");
          }
        })
        .catch((err) => {
          setError(err.message);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } catch (err) {
      setError("Error logging in: " + err.message);
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container]}>
      <Text style={styles.title}>Welcome </Text>

      <TextInput
        onChangeText={(text) => setEmployeeId(text.trim())}
        placeholder="Employee ID"
        value={employeeId}
        style={styles.input}
        placeholderTextColor="#aaa"
      />
      <View style={styles.inputContainer}>
        <TextInput
          onChangeText={(text) => setPassword(text.trim())}
          placeholder="Password"
          secureTextEntry={secureTextEntry}
          value={password}
          style={styles.input}
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity onPress={() => setSecureTextEntry(!secureTextEntry)} style={styles.eyeIcon}>
          <Ionicons name={secureTextEntry ? "eye-off" : "eye"} size={24} color="#333" />
        </TouchableOpacity>
      </View>
      <Animated.View style={buttonStyle}>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>{isLoading ? "Logging In..." : "Login"}</Text>
        </TouchableOpacity>
      </Animated.View>
      {isLoading && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Please wait...</Text>
        </View>
      )}
      {error && <Text style={styles.error}>{error}</Text>}
      <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
        <Text style={styles.link}>Forgot Password?</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#faebd7",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#faebd7",
    padding: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    padding: 10,
    width: "100%",
    marginBottom: 10,
    borderRadius: 30,
  },
  inputContainer: {
    position: "relative",
    width: "100%",
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    top: 15,
  },
  button: {
    backgroundColor: "lightseagreen",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginTop: 15,
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  loading: {
    marginTop: 20,
    color:'lightseagreen',
    alignItems: "center",
  },
  error: {
    color: "red",
    marginTop: 10,
  },
  link: {
    color: "#000000",
    marginTop: 20,
    textDecorationLine: "underline",
  },
});
