import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const HomePage = ({ navigation }) => {
  return (
    <View>
      <View style={styles.header}>
        <View style={styles.leftContainer}>
          <Ionicons name="people-circle-outline" size={100} href={'/'}/>
          <Link style={styles.title} href={'/'}>StudyBuddy</Link>
        </View>
        <Link href={'/login'} style={styles.loginText}>Login</Link>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  leftContainer: {
    flexDirection: 'row', // Arranges the icon and title side by side
    alignItems: 'center', // Aligns items vertically within the container
  },
  title: {
    fontFamily: 'sans-serif',
    fontSize: 40,
    marginLeft: 10, // Adds some spacing between the icon and the title
  },
  loginText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomePage;
