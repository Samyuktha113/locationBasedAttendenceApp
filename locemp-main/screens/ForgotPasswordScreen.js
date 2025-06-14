// ForgotPasswordScreen.js
import { useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../services/firebaseAuth';

export default function ForgotPasswordScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleForgotPassword = () => {
        setError('');
        sendPasswordResetEmail(auth, email)
            .then(() => {
                setMessage("Password reset email sent. Please check your inbox.");
            })
            .catch((error) => {
                setError(error.message);
            });
    };

    return (
        <View>
            <TextInput onChangeText={setEmail} placeholder="Enter your registered email" />
            <Button title="Send Reset Email" onPress={handleForgotPassword} />
            {error && <Text>{error}</Text>}
            {message && <Text>{message}</Text>}
        </View>
    );
}
