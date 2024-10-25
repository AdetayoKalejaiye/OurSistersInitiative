import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import { FontAwesome } from '@expo/vector-icons';

const PostPage = () => {
  const { id } = useLocalSearchParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchPost();
    fetchComments();
    getToken();
  }, [id]);

  const getToken = async () => {
    const storedToken = await AsyncStorage.getItem('userToken');
    setToken(storedToken);
  };


  const generateUniqueKey = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  };


  const fetchPost = async () => {
    try {
      const response = await api.get(`/posts/${id}`);
      setPost(response.data);
    } catch (error) {
      console.error('Error fetching post:', error);
      Alert.alert('Error', 'Failed to fetch post. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await api.get(`/posts/${id}/comments`);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
      Alert.alert('Error', 'Failed to fetch comments. Please try again.');
    }
  };

  const handleAddComment = async () => {
    if (!token) {
      Alert.alert('Error', 'You must be logged in to comment.');
      return;
    }
  
    if (!newComment.trim()) {
      Alert.alert('Error', 'Comment cannot be empty.');
      return;
    }
  
    try {
      const response = await api.post(`/posts/${id}/comments`, { content: newComment }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Add a unique key to the new comment
      const newCommentWithKey = {
        ...response.data,
        uniqueKey: generateUniqueKey()
      };
      
      setComments([...comments, newCommentWithKey]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
      Alert.alert('Error', 'Failed to add comment. Please try again.');
    }
  };
  

  const renderComment = ({ item }) => (
    <View style={styles.commentContainer}>
      <View style={styles.commentHeader}>
        <FontAwesome name="user-circle" size={24} color="#2e8b57" />
        <Text style={styles.commentAuthor}>{item.author}</Text>
        <Text style={styles.commentTime}>{new Date(item.timestamp).toLocaleString()}</Text>
      </View>
      <Text style={styles.commentContent}>{item.content}</Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2e8b57" />
      </View>
    );
  }

  if (!post) return <Text style={styles.errorText}>Post not found</Text>;

  return (
    <View style={styles.container}>
      <View style={styles.postContainer}>
        <Text style={styles.postTitle}>{post.title}</Text>
        <Text style={styles.postContent}>{post.content}</Text>
        <View style={styles.postFooter}>
          <Text style={styles.postCategory}>Category: {post.category}</Text>
          <Text style={styles.postTime}>{new Date(post.timestamp).toLocaleString()}</Text>
        </View>
      </View>
      <View style={styles.commentsSection}>
        <Text style={styles.commentsHeader}>Comments</Text>
        <View style={styles.commentInputContainer}>
          <TextInput
            style={styles.commentInput}
            placeholder="Add a comment..."
            value={newComment}
            onChangeText={setNewComment}
            multiline
          />
          <TouchableOpacity style={styles.commentButton} onPress={handleAddComment}>
            <Text style={styles.commentButtonText}>Post</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={comments}
          renderItem={renderComment}
          keyExtractor={(item) => item.uniqueKey || item.id.toString()}
          ListEmptyComponent={<Text style={styles.noComments}>No comments yet</Text>}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
    padding: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  postContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  postTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2e8b57',
    marginBottom: 10,
  },
  postContent: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  postCategory: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  postTime: {
    fontSize: 14,
    color: '#666',
  },
  commentsSection: {
    flex: 1,
  },
  commentsHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2e8b57',
    marginBottom: 10,
  },
  commentInputContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  commentButton: {
    backgroundColor: '#2e8b57',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
    justifyContent: 'center',
  },
  commentButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  commentContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  commentAuthor: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2e8b57',
    marginLeft: 10,
  },
  commentTime: {
    fontSize: 12,
    color: '#666',
    marginLeft: 'auto',
  },
  commentContent: {
    fontSize: 14,
    color: '#333',
  },
  noComments: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default PostPage;