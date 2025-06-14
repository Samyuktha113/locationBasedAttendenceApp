import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { db } from '../services/firebaseAuth'; // Adjust based on your structure
import { collection, doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Importing Ionicons for delete icon
import Icon from "react-native-vector-icons/FontAwesome";

const SalaryScreen = ({ navigation }) => {
  const [userId, setUserId] = useState('');
  const [docName, setDocName] = useState('');
  const [fields, setFields] = useState([{ fieldName: '', amount: '' }]);
  const [total, setTotal] = useState(0);
  const [totalCalculated, setTotalCalculated] = useState(false);

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

  const handleLogout = async () => {
    try {
      console.log("User logged out");
      navigation.navigate("HomeScreen");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const handleDocNameChange = (text) => {
    setDocName(text);
  };

  const addField = () => {
    setFields([...fields, { fieldName: '', amount: '' }]);
  };

  const deleteField = (index) => {
    const newFields = fields.filter((_, i) => i !== index);
    setFields(newFields);
    calculateTotal(newFields);
  };

  const calculateTotal = (fieldsArray = fields) => {
    const totalSum = fieldsArray.reduce(
      (sum, field) => sum + (parseFloat(field.amount) || 0),
      0
    );
    setTotal(totalSum);
    setTotalCalculated(true);
  };

  const saveData = async () => {
    if (!totalCalculated) {
      alert('Please calculate the total first before saving.');
      return;
    }

    if (!docName) {
      alert('Please provide a document name.');
      return;
    }

    try {
      const docRef = doc(collection(db, 'salary'), docName);
      const existingDoc = await getDoc(docRef);

      if (existingDoc.exists()) {
        Alert.alert(
          'Document Name Already Exists',
          'Please provide a new document name.'
        );
        return;
      }

      const newFields = {};
      const updatedEmployees = []; // To store names of employees whose salaries were updated

      fields.forEach((field) => {
        if (field.fieldName.trim()) {
          newFields[field.fieldName] = parseFloat(field.amount || 0);
          updatedEmployees.push(field.fieldName); // Storing employee names
        }
      });

      const updatedData = {
        ...newFields,
        total: total,
        createdAt: serverTimestamp(), // Adding timestamp
        // Storing updated employee names
      };

      await setDoc(docRef, updatedData);

      alert('Data saved successfully!');
      setFields([{ fieldName: '', amount: '' }]);
      setTotal(0);
      setTotalCalculated(false);
      setDocName('');
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Failed to save data.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Dynamic Salary Adjustment</Text>

      <TextInput
        placeholder="Enter Document Name"
        style={styles.input}
        value={docName}
        onChangeText={handleDocNameChange}
      />

      {fields.map((field, index) => (
        <View key={index} style={styles.fieldContainer}>
          <TextInput
            placeholder="Field Name"
            style={styles.input}
            value={field.fieldName}
            onChangeText={(text) =>
              setFields(fields.map((f, i) => (i === index ? { ...f, fieldName: text } : f)))
            }
          />
          <TextInput
            placeholder="Amount"
            style={styles.input}
            value={field.amount}
            onChangeText={(text) =>
              setFields(fields.map((f, i) => (i === index ? { ...f, amount: text } : f)))
            }
            keyboardType="numeric"
          />

          <TouchableOpacity style={styles.deleteIcon} onPress={() => deleteField(index)}>
            <Ionicons name="trash-bin" size={20} color="red" />
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity style={styles.addButton} onPress={addField}>
        <Text style={styles.addButtonText}>Add Field</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.totalButton} onPress={() => calculateTotal()}>
        <Text style={styles.totalButtonText}>Calculate Total</Text>
      </TouchableOpacity>

      <Text style={styles.totalText}>Total: {total.toFixed(2).toString()}</Text>

      <TouchableOpacity
        style={[styles.saveButton, !totalCalculated && styles.disabledButton]}
        onPress={saveData}
        disabled={!totalCalculated}
      >
        <Text style={styles.saveButtonText}>Save Data</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.viewSalaryButton} onPress={() => navigation.navigate('ViewSalary')}>
        <Text style={styles.viewSalaryButtonText}>View/Assign Salary</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.additionalButton} onPress={() => navigation.navigate('ViewCalculatedSalary')}>
        <Text style={styles.additionalButtonText}>View Calculated Salary</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: 'antiquewhite',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: 'antiquewhite',
  },
  fieldContainer: {
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: 'lightseagreen',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  totalButton: {
    backgroundColor: 'lightseagreen',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: 'lightseagreen',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#b5b5b5',
  },
  deleteIcon: {
    marginLeft: 10,
    padding: 5,
  },
  viewSalaryButton: {
    backgroundColor: 'lightseagreen',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  additionalButton: {
    backgroundColor: 'lightseagreen',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
});

export default SalaryScreen;
