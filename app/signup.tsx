import { View, Text, StyleSheet, TouchableOpacity, Button, Pressable } from 'react-native';
import React, { useState } from 'react';
import { Link, Redirect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TextInput } from 'react-native-gesture-handler';
import { FIREBASE_AUTH, GOOGLE_AUTH } from '../firebaseConfig';
import { GoogleAuthProvider, createUserWithEmailAndPassword, inMemoryPersistence, setPersistence, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';

const SignUpPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmedPass, setConfirmedPass] = useState('');
  const auth = FIREBASE_AUTH;

  FIREBASE_AUTH.onAuthStateChanged(function(user) {
    if (user) {
      useRouter().replace('/userIndex');
    }
  });

  const onEmailSignUp = async () => {
    setPersistence(auth, inMemoryPersistence)
    try {
      if (password === confirmedPass) {
        const response = await createUserWithEmailAndPassword(auth, email, password);
        console.log(response);
        useRouter().replace('/login');
        try {
          const response = await signInWithEmailAndPassword(auth, email, password);
          console.log(response);
        } catch (error: any) {
          console.log(error);
          alert('Sign in failed: ' + error.message);
        }
      }
      else {
        alert('Passwords must match!');
      }
    } catch (error: any) {
      console.log(error);
      alert('Sign up failed: ' + error.message);
    }
  }

  return (
    <View style={styles.container}>
      <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
        <Ionicons name="people-circle-outline" size={100} href={'/'}/>
        <Link style={{fontSize: 30, fontWeight: '700'}} href={'/'}>StudyBuddy</Link>
      </View>
      <View style={styles.body}>
        <View style={styles.loginContainer}>
          <View style={styles.form}>
            <Text style={{fontSize: 20, fontWeight: 'bold', fontStyle: 'italic', paddingBottom: 30}}>Welcome to the team.</Text>
            <TextInput placeholder=" Email" placeholderTextColor="gray" autoCapitalize='none' style={styles.input} onChangeText={newEmail => setEmail(newEmail)} defaultValue={email}/>
            <TextInput secureTextEntry={true} placeholder=" Password" placeholderTextColor="gray" autoCapitalize='none' style={styles.input} onChangeText={newPassword => setPassword(newPassword)} defaultValue={password}/>
            <TextInput secureTextEntry={true} placeholder=" Confirm Password" placeholderTextColor="gray" autoCapitalize='none' style={styles.input} onChangeText={newPassword => setConfirmedPass(newPassword)} defaultValue={confirmedPass}/>
            {password !== confirmedPass && <Text style={{color: 'red'}}>Passwords do not match!</Text>}
            <Button onPress={onEmailSignUp} title='Sign up' color='black'></Button>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
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
  loginContainer: {
    height: '80%',
    padding: 20,
    borderStyle: 'solid',
    borderWidth: 8,
    borderColor: 'black',
    borderRadius: 16,
    justifyContent: 'center',
    backgroundColor: 'white',
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

export default SignUpPage;
