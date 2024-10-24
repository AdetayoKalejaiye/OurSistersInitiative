import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TextInput, Button, StyleSheet, Alert} from 'react-native';
import Picker from 'react-native-picker';
import axios from 'axios';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import { Link } from 'expo-router';
const API_URL = 'http://127.0.0.1:5000/api/posts';  // Use this for Android emulator
// const API_URL = 'http://localhost:5000/api/posts';  // Use this for iOS simulator
import { TouchableOpacity } from 'react-native-gesture-handler';

const categories = ['General', 'Health', 'Education', 'Employment', 'Legal'];

const ForumPage = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('');
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');


  useEffect(() => {
    const getUserData = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        const storedToken = await AsyncStorage.getItem('userToken');
        if (storedUserId) {
          setUserId(storedUserId);
        }
        if (storedToken) {
          setToken(storedToken);
        }
      } catch (error) {
        console.error('Error retrieving user data:', error);
      }
    };

    getUserData();
    fetchPosts();
  }, []);


  useEffect(() => {
    filterPosts();
  }, [posts, searchQuery, selectedCategory]);


  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(API_URL);
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      Alert.alert('Error', 'Failed to fetch posts. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const filterPosts = () => {
    let filtered = posts;
    if (searchQuery) {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (selectedCategory) {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }
    setFilteredPosts(filtered);
  };


  const handleAddPost = async () => {
    if (!token) {
      Alert.alert('Error', 'You must be logged in to create a post.');
      return;
    }

    try {
      const response = await api.post('/posts', {
        title: newPostTitle,
        content: newPostContent,
        category: newPostCategory,
        userId: userId
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Post created:', response.data);
      fetchPosts(); // Refresh the posts list
      setNewPostTitle('');
      setNewPostContent('');
      setNewPostCategory('');

    } catch (error) {
      if (error.response && error.response.status === 401) {
        try {
          const refreshToken = await AsyncStorage.getItem('refreshToken');
          const response = await axios.post('http://127.0.0.1:5000/api/refresh', {}, {
            headers: {
              'Authorization': `Bearer ${refreshToken}`
            }
          });
          
          const newAccessToken = response.data.access_token;
          await AsyncStorage.setItem('userToken', newAccessToken);
          setToken(newAccessToken);
          
          // Retry the original request with the new token
          handleAddPost();
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          // Redirect to login page
          router.replace('/login');
        }
      } else {
        console.error('Error adding post:', error);
        Alert.alert('Error', 'Failed to add post. Please try again.');
      }
    }
  };

  const renderItem = ({ item }) => (
    <Link href={`/post/${item.id}`} asChild>
      <TouchableOpacity style={styles.postContainer}>
        <Text style={styles.postTitle}>{item.title}</Text>
        <Text numberOfLines={2}>{item.content}</Text>
        <Text style={styles.postCategory}>Category: {item.category}</Text>
      </TouchableOpacity>
    </Link>
  );

  const renderFooter = () => {
    if (!isLoading) return null;
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="🔍 Search posts..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <Picker
        selectedValue={selectedCategory}
        style={styles.categoryPicker}
        onValueChange={(itemValue) => setSelectedCategory(itemValue)}
      >
        <Picker.Item label="All Categories" value="" />
        {categories.map((category) => (
          <Picker.Item key={category} label={category} value={category} />
        ))}
      </Picker>
      <View style={styles.newPostContainer}>
        <TextInput
          style={styles.input}
          placeholder="Post Title"
          value={newPostTitle}
          onChangeText={setNewPostTitle}
        />
        <TextInput
          style={styles.input}
          placeholder="Post Content"
          value={newPostContent}
          onChangeText={setNewPostContent}
          multiline
        />
        <Picker
          selectedValue={newPostCategory}
          style={styles.input}
          onValueChange={(itemValue) => setNewPostCategory(itemValue)}
        >
          <Picker.Item label="Select a category" value="" />
          {categories.map((category) => (
            <Picker.Item key={category} label={category} value={category} />
          ))}
        </Picker>
        <Button title="Add Post" onPress={handleAddPost} />
      </View>

      <FlatList
        data={filteredPosts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        onEndReached={fetchPosts}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f8ff',
  },
  newPostContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  postContainer: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
    cursor: 'pointer'
  },
  postTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  postCategory: {
    fontStyle: 'italic',
    marginTop: 5,
  },
  searchInput: {
    borderRadius: 20,
    borderStyle: 'groove',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
    width: 200,
    padding: 15,
    marginBottom: 10,
    backgroundColor: 'white'
  },
  categoryPicker: {
    marginBottom: 10,
  }
});

export default ForumPage;