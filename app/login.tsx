import { View, Text, StyleSheet, TouchableOpacity, Button, Pressable } from 'react-native';
import React, { useState } from 'react';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TextInput } from 'react-native-gesture-handler';
import { FIREBASE_AUTH, GOOGLE_AUTH } from '../firebaseConfig';
import { GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = FIREBASE_AUTH;

  const onEmailSignIn = async () => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log(response);
    } catch (error: any) {
      console.log(error);
      alert('Sign in failed: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
        <Ionicons name="people-circle-outline" size={100} href={'/'}/>
        <Link style={{fontSize: 30, fontWeight: '700', textDecorationLine: 'underline'}} href={'/'}>StudyBuddy</Link>
      </View>
      <View style={styles.body}>
        <View style={styles.loginContainer}>
        <Text style={{fontSize: 20, fontWeight: 'bold', fontStyle: 'italic', paddingBottom: 30}}>Existing users:</Text>
            <TextInput placeholder=" Email" placeholderTextColor="gray" autoCapitalize='none' style={styles.input} onChangeText={newEmail => setEmail(newEmail)} defaultValue={email}/>
            <TextInput secureTextEntry={true} placeholder=" Password" placeholderTextColor="gray" autoCapitalize='none' style={styles.input} onChangeText={newPassword => setPassword(newPassword)} defaultValue={password}/>
            <Button onPress={onEmailSignIn} title='Sign in' color='#49274a'></Button>
            <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
              <Text>
                Don't have an account?
              </Text>
              <Link href={'/signup'} style={{paddingLeft: 5, fontWeight: 'bold'}}>Sign up</Link>
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
    borderColor: '#49274a',
    borderRadius: 16,
    justifyContent: 'center',
    backgroundColor: '#ffefff',
    alignItems: 'center'
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

export default LoginPage;
