import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';

const SupportPage = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Support Page</Text>
        <Text style={styles.tagline}>We're here to help you every step of the way.</Text>
      </View>

      {/* Emergency Contacts */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Emergency Contacts</Text>
        <TouchableOpacity onPress={() => Linking.openURL('tel:+18007997233')}>
          <Text style={styles.contact}>National Domestic Violence Hotline: 1-800-799-7233</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL('tel:+988')}>
          <Text style={styles.contact}>Crisis Support: 988</Text>
        </TouchableOpacity>
      </View>

      {/* Resources */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Resources</Text>
        <Text style={styles.resource}>- <Text style={styles.link} onPress={() => Linking.openURL('https://sherecovers.org')}>SHE RECOVERS Foundation</Text></Text>
        <Text style={styles.resource}>- <Text style={styles.link} onPress={() => Linking.openURL('https://www.nextstepwew.org')}>The Next Step - Women Empowering Women</Text></Text>
        <Text style={styles.resource}>- <Text style={styles.link} onPress={() => Linking.openURL('https://www.wrc.org.uk/help-support-services')}>Women's Resource Centre</Text></Text>
        <Text style={styles.resource}>- <Text style={styles.link} onPress={() => Linking.openURL('https://www.womenslaw.org/find-help')}>WomensLaw.org</Text></Text>
      </View>

      {/* Contact Form */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Us</Text>
        {/* Form fields can be added here */}
        <Text style={styles.info}>Please contact us through our email: support@example.com</Text>
      </View>

      {/* FAQs */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        <Text style={styles.faq}>Q: How can I get immediate help?</Text>
        <Text style={styles.faq}>A: Call one of our emergency helplines listed above.</Text>
        <Text style={styles.faq}>Q: Where can I find local support?</Text>
        <Text style={styles.faq}>A: Check the resources section for local support centers.</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f0f8ff',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
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
  section: {
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2e8b57',
    marginBottom: 10,
  },
  contact: {
    fontSize: 18,
    color: '#2e8b57',
    marginVertical: 5,
  },
  resource: {
    fontSize: 16,
    color: '#555',
    marginVertical: 5,
  },
  link: {
    color: '#2e8b57',
    textDecorationLine: 'underline',
  },
  info: {
    fontSize: 16,
    color: '#555',
  },
  faq: {
    fontSize: 16,
    color: '#555',
    marginVertical: 5,
  },
});

export default SupportPage;
