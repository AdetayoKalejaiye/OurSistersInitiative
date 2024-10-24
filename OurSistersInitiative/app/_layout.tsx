import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { AuthProvider } from '../components/AuthContext.js'

export default function AppLayout() {
  return (
    <AuthProvider>
    <Tabs
    screenOptions={{
      tabBarActiveTintColor: '#2e8b57',
      headerShown: false,
    }}
    >
      <Tabs.Screen
    name="post/[id]"
    options={{
      title: "Post",
      tabBarIcon: ({ color }) => <FontAwesome name="comments-o" size={24} color = {color} />,
      href: null,
    }}
    />
    <Tabs.Screen
    name="index"
    options={{
      title: 'Home',
      tabBarIcon: ({ color }) => <FontAwesome name="home" size={24} color={color} />,
    }}
    />
    <Tabs.Screen
    name="support"
    options={{
      title: 'Support',
      tabBarIcon: ({ color }) => <FontAwesome name="heart" size={24} color={color} />,
    }}
    />
    <Tabs.Screen
    name="forum"
    options={{
      title: 'Forum',
      tabBarIcon: ({ color }) => <FontAwesome name="comments" size={24} color={color} />,
    }}
     
    />
    <Tabs.Screen
    name ="signup"
    options={{
      title: "Sign-Up",
      tabBarIcon: ({ color }) => <FontAwesome name="user" size={24} color={color} />,
      href: null,
    }}
    
    />
    <Tabs.Screen
    name ="education"
    options={{
      title: "News",
      tabBarIcon: ({ color }) => <FontAwesome name="book" size={24} color={color} />,
    }}
    />
    <Tabs.Screen
    name ="login"
    options={{
      title: "Login",
      tabBarIcon: ({ color }) => <FontAwesome name="sign-in" size={24} color={color} />,
    }}
    />
    
    </Tabs>
    </AuthProvider>
  );
}