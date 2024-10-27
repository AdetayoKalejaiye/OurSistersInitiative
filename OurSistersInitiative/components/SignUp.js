import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert } from 'react-native';
import axios from 'axios';
import { Link, useRouter } from 'expo-router';

const API_URL = 'http://127.0.0.1:5000/api/signup'; // Use this for Android emulator
// const API_URL = 'http://localhost:5000/api/signup'; // Use this for iOS simulator

const Signup = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
  
    const handleSignup = async () => {
      if (!username || !password) {
        setError('Please fill in all fields.');
        return;
      }
  
      try {
        const response = await axios.post(API_URL, { 
          username, 
          password 
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 5000 // 5 seconds timeout
        });
  
        if (response.data.token) {
          // Handle successful signup
          Alert.alert('Success', 'Signup successful!');
          router.replace('/login'); // Navigate to login page
        } else {
          setError('Signup failed. Please try again.');
        }
      } catch (err) {
        console.error('Signup error:', err);
        if (err.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          setError(`Signup failed: ${err.response.data.message || err.response.data}`);
        } else if (err.request) {
          // The request was made but no response was received
          setError('No response from server. Please try again.');
        } else {
          // Something happened in setting up the request that triggered an Error
          setError('Error setting up request. Please try again.');
        }
      }
    };
  
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Button title="Sign Up" onPress={handleSignup} color="#2e8b57" />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Text style={styles.text}>
          Already have an account? <Link href="/login" style={{color: '#2e8b57'}}>Login</Link>
        </Text>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 20,
    },
    input: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 10,
      paddingHorizontal: 10,
      borderRadius: 5,
    },
    error: {
      color: 'red',
      marginTop: 10,
      textAlign: 'center',
    },
    text: {
      marginTop: 20,
      textAlign: 'center',
    },
  });
  
  export default Signup;