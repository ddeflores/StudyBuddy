import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { FIREBASE_AUTH, GOOGLE_AUTH } from '../firebaseConfig';
import { GoogleAuthProvider, inMemoryPersistence, setPersistence, signInWithPopup } from 'firebase/auth';

const index = () => {
  const auth = FIREBASE_AUTH;

  FIREBASE_AUTH.onAuthStateChanged(function(user) {
    if (user) {
      useRouter().replace('/userIndex');
    }
  });
  
  const onGoogleSignIn = async () => {
    setPersistence(auth, inMemoryPersistence)
    try {
      const response = await signInWithPopup(auth, GOOGLE_AUTH);
      console.log(response);
      const credential = GoogleAuthProvider.credentialFromResult(response);
      const token = credential.accessToken;
      const user = response.user;
    } catch (error: any) {
      console.log(error);
      alert('Sign in failed: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
        <Ionicons name="people-circle-outline" size={100} href={'/'}/>
        <Link style={{fontSize: 30, fontWeight: '700'}} href={'/'}>StudyBuddy</Link>
      </View>
      <TouchableOpacity style={styles.buttons} onPress={() => useRouter().push('/login')}>
        <Text style={{fontSize: 20, fontWeight: '500', color: 'white'}}>Login</Text>
      </TouchableOpacity>
        <TouchableOpacity style={styles.buttons} onPress={() => useRouter().push('/signup')}>
          <Text style={{fontSize: 20, fontWeight: '500', color: 'white'}}>Sign up</Text>
        </TouchableOpacity>
        <Text style={{fontWeight: 'bold', fontSize: 20}}>or</Text>
        <View style={styles.buttons}>
              <TouchableOpacity onPress={onGoogleSignIn}>
                <Text style={{fontSize: 20, fontWeight: 'bold', color: 'white', paddingRight: 10}}>Sign in with Google (Web only)</Text>
              </TouchableOpacity>
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
  buttons: {
    marginTop: 10,
    marginBottom: 5,
    backgroundColor: 'black',
    padding: 15,
    borderRadius: 12,
    borderWidth: 3,
  }
});

export default index;
