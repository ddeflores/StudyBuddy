import { View, Text, StyleSheet, TouchableOpacity, Button, Pressable } from 'react-native';
import React, { useState } from 'react';
import { Link, Redirect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TextInput } from 'react-native-gesture-handler';
import { SocialIcon } from '@rneui/base';
import { FIREBASE_AUTH, GOOGLE_AUTH } from '../firebaseConfig';
import { GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';

const HomePage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmedPass, setConfirmedPass] = useState('');
  const auth = FIREBASE_AUTH;

  const onEmailSignUp = async () => {
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);
      console.log(response);
      useRouter().replace('/login');
    } catch (error: any) {
      console.log(error);
      alert('Sign up failed: ' + error.message);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.leftContainer}>
          <Ionicons name="people-circle-outline" size={100} href={'/'}/>
          <Link style={styles.title} href={'/'}>StudyBuddy</Link>
        </View>
      </View>
      <View style={styles.body}>
        <View style={styles.loginContainer}>
          <View style={styles.form}>
            <Text style={{fontSize: 30, fontWeight: 'bold', fontFamily: 'sans-serif', fontStyle: 'italic', paddingBottom: 30}}>Better grades begin now.</Text>
            <TextInput placeholder=" Email" placeholderTextColor="gray" autoCapitalize='none' style={styles.input} onChangeText={newEmail => setEmail(newEmail)} defaultValue={email}/>
            <TextInput secureTextEntry={true} placeholder=" Password" placeholderTextColor="gray" autoCapitalize='none' style={styles.input} onChangeText={newPassword => setPassword(newPassword)} defaultValue={password}/>
            <TextInput secureTextEntry={true} placeholder=" Confirm Password" placeholderTextColor="gray" autoCapitalize='none' style={styles.input} onChangeText={newPassword => setConfirmedPass(newPassword)} defaultValue={confirmedPass}/>
            {password !== confirmedPass && <Text style={{color: 'red'}}>Passwords do not match!</Text>}
            <Button onPress={onEmailSignUp} title='Sign up' color='#49274a'></Button>
          </View>
        </View>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    backgroundColor: '#49274a',
    height: '15%',
  },
  loginContainer: {
    height: '80%',
    width: '50%',
    borderStyle: 'solid',
    borderWidth: 8,
    borderColor: '#49274a',
    borderRadius: 16,
    justifyContent: 'center',
    backgroundColor: '#ffefff',
  },
  form: {
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    height: 25,
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 5,
    margin: 5,
    backgroundColor: 'white',
    padding: 4,
  },
});

export default HomePage;
