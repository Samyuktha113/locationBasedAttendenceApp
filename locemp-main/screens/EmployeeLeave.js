import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function LeaveOptions() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Button
        title="Check Submitted Leave Status"
        onPress={() => navigation.navigate('CheckLeaveStatus')}
      />
      <View style={styles.buttonSpacing} />
      <Button
        title="Apply for a Leave"
        onPress={() => navigation.navigate('ApplyLeaveScreen')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  buttonSpacing: {
    marginVertical: 10,
  },
});
