import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const HomePage = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.leftContainer}>
          <Ionicons name="people-circle-outline" size={100} href={'/'}/>
          <Link style={styles.title} href={'/'}>StudyBuddy</Link>
        </View>
        <Link href={'/login'} style={styles.loginText}>Login</Link>
      </View>
      <View style={styles.body}>
      </View>
      <View style={styles.footer}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    height: '100%',
  },
  header: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: '10%',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center', 
  },
  title: {
    fontFamily: 'sans-serif',
    fontSize: 40,
    marginLeft: 10, 
  },
  loginText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  body: {
    height: '75%',
    backgroundColor: '#cdb7f6'
  },
  footer: {
    backgroundColor: '#49274a',
    height: '15%',
  },
});

export default HomePage;
