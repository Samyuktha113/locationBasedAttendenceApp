import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Animated, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  const [darkMode, setDarkMode] = useState(true);
  const [thought, setThought] = useState('');
  const [animation] = useState(new Animated.Value(0));
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
      headerShown:false, // Removes the back arrow
      gestureEnabled: false,  // Disables the swipe-back gesture on iOS
    });
  }, [navigation]);

  const thoughts = [
    '"Success usually comes to those who are too busy to be looking for it."',
    '"Hard work beats talent when talent does not work hard."',
    '"Do not watch the clock; do what it does. Keep going."',
    '"Quality is not an act, it is a habit."',
    '"The only way to do great work is to love what you do."',
  ];

  // Update inspirational thought daily
  useEffect(() => {
    const today = new Date().getDate();
    setThought(thoughts[today % thoughts.length]);

    // Button animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(animation, { toValue: 10, duration: 1000, useNativeDriver: true }),
        Animated.timing(animation, { toValue: 0, duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  }, [animation, thoughts]);

  const buttonStyle = {
    transform: [{ translateY: animation }],
  };

  //const toggleTheme = () => setDarkMode((prevMode) => !prevMode);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: darkMode ? '#faebd7' : '#f9f9f9' },
      ]}
    >
      <Image

        source={require('../images/Company-logo.png')}
        style={{ width: 150, height: 200, marginBottom: 20 }}

        // source={require('../images/Company-logo.png')}
        // style={{ width: 100, height: 200, marginBottom: 20 }}

      />

      <Text style={[styles.title, { color: darkMode ? '#000000' : '#000000' }]}>
        Welcome 
      </Text>

      <Text style={[styles.thought, { color: darkMode ? '#000000' : '#333333' }]}>
        {thought}
      </Text>

      <Animated.View style={buttonStyle}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: 'lightseagreen' }]}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>Employee</Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View style={buttonStyle}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: 'lightseagreen' }]}
          onPress={() => navigation.navigate('ManagerLogin')}
        >
          <Text style={styles.buttonText}>Manager</Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View style={buttonStyle}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: 'lightseagreen' }]}
          onPress={() => navigation.navigate('AdminLogin')}
        >
          <Text style={styles.buttonText}>Admin</Text>
        </TouchableOpacity>
      </Animated.View>

     {/*  <View style={styles.switchContainer}>
        <Text style={{ color: darkMode ? '#ffffff' : '#000000', marginRight: 10 }}>
          {darkMode ? 'Dark Mode' : 'Light Mode'}
        </Text>
        <Switch value={darkMode} onValueChange={toggleTheme} />
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#faebd7",
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  thought: {
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 30,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 15,
    borderRadius: 30,
  },
  buttonText: {
    color: '#000000',
    fontSize: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
});
