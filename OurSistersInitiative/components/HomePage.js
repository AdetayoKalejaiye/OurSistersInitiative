import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, useWindowDimensions, TouchableOpacity, Linking } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Ensure you have this package installed
import { Link } from 'expo-router';

const HomePage = () => {
  const { width } = useWindowDimensions();
  const [isDesktop, setIsDesktop] = useState(width >= 768);
  const [isNavOpen, setIsNavOpen] = useState(false);

  useEffect(() => {
    setIsDesktop(width >= 768);
    if (width >= 768) {
      setIsNavOpen(false); // Close navbar when switching to desktop view
    }
  }, [width]);

  const handleNavToggle = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Navbar */}
      <View style={styles.navbar}>
        <Image source={require('../assets/images/logo.png')} style={styles.logo} />
        {isDesktop ? (
          <View style={styles.navItems}>
            <Link href="/">
              <Text style={styles.navItem}>Home</Text>
            </Link>
            <Link href="/forum">
              <Text style={styles.navItem}>Forum</Text>
            </Link>
            <Link href="/education">
              <Text style={styles.navItem}>News</Text>
            </Link>
            <Link href="/support">
              <Text style={styles.navItem}>Support</Text>
            </Link>
            {/* Login and Signup Links */}
            <Link href="/login">
              <Text style={styles.navItem}>Login</Text>
            </Link>
            <Link href="/signup">
              <Text style={styles.navItem}>Sign Up</Text>
            </Link>
          </View>
        ) : (
          <>
            <TouchableOpacity onPress={handleNavToggle} style={styles.hamburgerButton}>
              <FontAwesome name="bars" size={24} color="#2e8b57" />
            </TouchableOpacity>
            {isNavOpen && (
              <View style={styles.mobileNav}>
                <Link href="/">
                  <Text style={styles.navItemMobile}>Home</Text>
                </Link>
                <Link href="/forum">
                  <Text style={styles.navItemMobile}>Forum</Text>
                </Link>
                <Link href="/education">
                  <Text style={styles.navItemMobile}>News</Text>
                </Link>
                <Link href="/support">
                  <Text style={styles.navItemMobile}>Support</Text>
                </Link>
                {/* Login and Signup Links */}
                <Link href="/login">
                  <Text style={styles.navItemMobile}>Login</Text>
                </Link>
                <Link href="/signup">
                  <Text style={styles.navItemMobile}>Sign Up</Text>
                </Link>
              </View>
            )}
          </>
        )}
      </View>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>OurSistersInitiative</Text>
        <Text style={styles.tagline}>A Safe Space for Every Sister, Everywhere</Text>
      </View>

      {/* Cards */}
      <View style={[styles.features, isDesktop ? styles.desktopLayout : styles.mobileLayout]}>
        {/* Forum Card */}
        <Link href="/forum">
          <View style={styles.card}>
            <Image source={require('../assets/images/forum-image.png')} style={styles.cardImage} />
            <Text style={styles.cardTitle}>Forum</Text>
            <Text style={styles.cardText}>Talk anonymously with others going through similar challenges.</Text>
          </View>
        </Link>

        {/* Education Card */}
        <Link href="/education">
          <View style={styles.card}>
            <Image source={require('../assets/images/education-image.png')} style={styles.cardImage} />
            <Text style={styles.cardTitle}>Education</Text>
            <Text style={styles.cardText}>Learn about abuse prevention, consent, and safety.</Text>
          </View>
        </Link>

        {/* Support Card */}
        <Link href="/support">
          <View style={styles.card}>
            <Image source={require('../assets/images/support-image.png')} style={styles.cardImage} />
            <Text style={styles.cardTitle}>Support</Text>
            <Text style={styles.cardText}>Connect with global helplines and resources.</Text>
          </View>
        </Link>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2023 OurSistersInitiative. All rights reserved.</Text>
        <View style={styles.socialIcons}>
          {/* <TouchableOpacity onPress={() => Add Facebook link}> */}
            {/* <FontAwesome name="facebook" size={24} color="#2e8b57" style={styles.socialIcon} /> */}
          {/* </TouchableOpacity> */}
          {/* <TouchableOpacity onPress={() => Add Twitter link}> */}
            {/* <FontAwesome name="twitter" size={24} color="#2e8b57" style={styles.socialIcon} /> */}
          {/* </TouchableOpacity> */}
          <TouchableOpacity onPress={() => {Linking.openURL("https://www.instagram.com/oursistersinitiative/")
      .catch(err => console.error("Failed to open URL:", err));}}>
            <FontAwesome name="instagram" size={24} color="#2e8b57" style={styles.socialIcon} />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
    
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f0f8ff',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative', // Ensure this container is positioned correctly
  },
  logo: {
    width: 40,
    height: 40,
  },
  navItems: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navItem: {
    marginHorizontal: 10,
    fontSize: 18,
    color: '#2e8b57',
  },
  hamburgerButton: {
    padding: 10,
  },
  mobileNav: {
    position: 'absolute', // Position it absolutely to overlay above other elements
    top: 60, // Adjust as necessary
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    padding: 20,
    width: 200,
    zIndex: 1000, // Ensure it's above other elements
  },
  navItemMobile: {
    fontSize: 18,
    color: '#2e8b57',
    marginVertical: 10,
    
  },
  header: {
    alignItems: 'center',
    marginVertical: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2e8b57',
  },
  tagline: {
    fontSize: 16,
    color: '#555',
    fontStyle: 'italic',
  },
  features: {
    marginVertical: 20,
    alignItems: 'center',
  },
  desktopLayout: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  mobileLayout: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 0,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    alignItems: 'center',
    width: '100%',
    maxWidth: 350,
    height: 'auto', // Allow height to be determined by content
   minHeight :300 // Set a minimum height for consistency
   ,
    
  
},
cardImage:{
width:'100%',
height:200,
borderRadius :10,
marginBottom :10,

},
cardTitle:{
fontSize :18 ,
fontWeight :'bold' ,
color :'#2e8b57' ,
marginBottom :5 ,
textAlign :'center' ,
},
cardText:{
fontSize :14 ,
color :'#555' ,
textAlign :'center' ,
},
footer: {
  marginTop: 40,
  paddingVertical: 20,
  borderTopWidth: 1,
  borderTopColor: '#ddd',
  alignItems: 'center',
},
footerText: {
  fontSize: 14,
  color: '#555',
  marginBottom: 10,
},
socialIcons: {
  flexDirection: 'row',
  justifyContent: 'center',
},
socialIcon: {
  marginHorizontal: 10,
},
});

export default HomePage;