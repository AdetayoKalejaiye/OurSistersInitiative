import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Link, useRouter } from 'expo-router';
import { View, TextInput, Button, StyleSheet, Text, Alert } from 'react-native';
import api from '../services/api'
const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
        const response = await api.post('/login', { username, password });

  
      if (response.data.access_token && response.data.refresh_token) {
        // Store the access token
        await AsyncStorage.setItem('accessToken', response.data.access_token);
        console.log('My access token: ', response.data.access_token);
  
        // Store the refresh token
        await AsyncStorage.setItem('refreshToken', response.data.refresh_token);
        console.log('My refresh token: ', response.data.refresh_token);
  
        // Store the user ID
        if (response.data.user_id) {
          await AsyncStorage.setItem('userId', response.data.user_id.toString());
          console.log('My id: ', response.data.user_id);
        }
  
        // Alert the user
        alert('Login successful');
  
        // Redirect to home page or dashboard
        router.replace('/');
      } else {
        setError('Login failed: No tokens received');
      }
    } catch (error) {
        console.error('Login error:', error);
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('Error data:', error.response.data);
          console.error('Error status:', error.response.status);
          console.error('Error headers:', error.response.headers);

            if (error.response.status === 401) {
              setError('Invalid credentials');
          } else {
              setError('An error occurred. Please try again later.');
          }
        } else if (error.request) {
          // The request was made but no response was received
          console.error('Error request:', error.request);
          setError('Network error. Please check your connection and try again.');
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Error message:', error.message);
          setError('An unexpected error occurred. Please try again later.');
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
      <Button title="Login" onPress={handleLogin} color="#2e8b57" />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Text style={styles.text}>
          Don't have an account? <Link href="/signup" style={{color: '#2e8b57'}}>Sign Up</Link>
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
export default LoginPage;