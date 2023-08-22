import { View, Text, StyleSheet, TouchableOpacity, Button, Pressable } from 'react-native';
import React, { useState } from 'react';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TextInput } from 'react-native-gesture-handler';
import { SocialIcon } from '@rneui/base';

const HomePage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onEmailSignIn = () => {

  };

  const onGoogleSignIn = () => {

  };
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
            <Text style={{fontSize: 35, fontWeight: 'bold', fontFamily: 'sans-serif'}}>Existing users:</Text>
            <Text style={{fontSize:20}}>Email:</Text>
            <TextInput style={styles.input} onChangeText={newEmail => setEmail(newEmail)} defaultValue={email}/>
            <Text style={{fontSize: 20}}>Password:</Text>
            <TextInput style={styles.input} onChangeText={newEmail => setEmail(newEmail)} defaultValue={password}/>
            <Button onPress={onEmailSignIn} title='Sign in' color='#49274a'></Button>
            <View style={{display: 'flex', flexDirection: 'row'}}>
              <Text>
                Don't have an account?
              </Text>
              <Link href={'/'} style={{paddingLeft: 5, fontWeight: 'bold'}}>Sign up</Link>
            </View>
            <Text style={{paddingBottom: 5}}>or</Text>
            <View style={{display: 'flex', flexDirection: 'row', backgroundColor: '#ff5349', alignItems: 'center', borderRadius: 12, borderWidth: 3, borderColor: '#49274a'}}>
              <SocialIcon type='google' style={{borderWidth: 1, borderColor: '#49274a'}}></SocialIcon>
              <Pressable onPress={onGoogleSignIn}>
                <Text style={{fontSize: 18, fontWeight: 'bold', color: 'white', paddingRight: 10}}>Sign in with Google</Text>
              </Pressable>
            </View>
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
    height: 20,
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 5,
    margin: 5,
    backgroundColor: 'white'
  },
});

export default HomePage;
