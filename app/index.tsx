import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SocialIcon } from '@rneui/base';
import { FIREBASE_AUTH, GOOGLE_AUTH } from '../firebaseConfig';
import { GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';

const HomePage = () => {
  const auth = FIREBASE_AUTH;
  const onGoogleSignIn = async () => {
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
        <Link style={{fontSize: 30, fontWeight: '700', textDecorationLine: 'underline'}} href={'/'}>StudyBuddy</Link>
      </View>
      <TouchableOpacity style={styles.buttons} onPress={() => useRouter().push('/login')}>
        <Text style={{fontSize: 20, fontWeight: '500'}}>Login</Text>
      </TouchableOpacity>
        <TouchableOpacity style={styles.buttons} onPress={() => useRouter().push('/signup')}>
          <Text style={{fontSize: 20, fontWeight: '500'}}>Sign up</Text>
        </TouchableOpacity>
        <Text style={{fontWeight: 'bold'}}>or</Text>
        <View style={{display: 'flex', flexDirection: 'row', backgroundColor: '#ff5349', alignItems: 'center', borderRadius: 12, borderWidth: 3, borderColor: '#49274a'}}>
              <SocialIcon type='google' style={{borderWidth: 1, borderColor: '#49274a'}}></SocialIcon>
              <TouchableOpacity onPress={onGoogleSignIn}>
                <Text style={{fontSize: 18, fontWeight: 'bold', color: 'white', paddingRight: 10}}>Sign in with Google</Text>
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
    backgroundColor: '#ff5349',
    padding: 15,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#49274a',
  }
});

export default HomePage;
