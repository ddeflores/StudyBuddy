import { View, Text, StyleSheet, TouchableOpacity, RefreshControl, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { FIREBASE_AUTH, GOOGLE_AUTH } from '../firebaseConfig';
import { GoogleAuthProvider, browserLocalPersistence, inMemoryPersistence, setPersistence, signInWithPopup, signOut } from 'firebase/auth';

const account = () => {
  const [confirmVisible, setConfirmVisible] = useState(false);


  // Make sure user is signed in, and redirect to login page if not
  FIREBASE_AUTH.onAuthStateChanged(function(user) {
    if (!user) {
      useRouter().replace('/');
    }
});
  
// Log out the user
const onSignOut = async () => {
    signOut(FIREBASE_AUTH);
}

  return (
    <View style={styles.container}>
      <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
        <Ionicons name="arrow-back-outline" size={40} onPress={() => {useRouter().back()}} style={{marginRight: 300}}></Ionicons>
        <Ionicons name="people-circle-outline" size={100} style={{position: 'absolute', left: '36%'}}/>
      </View>
      <View style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{fontSize: 20, fontWeight: '500', color: 'black'}}>UserID:</Text>
            <Text style={{marginLeft: '3%'}}>{FIREBASE_AUTH.currentUser.uid}</Text>
        </View>
        <Text style={{fontSize: 17, color: 'black', fontStyle: 'italic'}}>Only share this with your friends!</Text>
      </View>
      <View>
        <TouchableOpacity style={styles.buttons} onPress={() => setConfirmVisible(true)}>
            <Text style={{fontSize: 20, fontWeight: '500', color: 'white'}}>Logout</Text>
        </TouchableOpacity>
        {confirmVisible &&
            <View style={{borderWidth: 2, borderRadius: 12, borderColor: 'black', padding: 3}}>
                <Text>Confirm log out?</Text>
                <View style={{display: 'flex', flexDirection: 'row'}}>
                    <Pressable onPress={onSignOut}>
                        <Text style={{fontWeight: 'bold'}}>Yes</Text>
                    </Pressable>
                    <Pressable onPress={() => setConfirmVisible(false)} style={{paddingLeft: 40}}>
                        <Text style={{fontWeight: 'bold'}}>Cancel</Text>
                    </Pressable>
                </View>
            </View>
        }
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '70%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-evenly',
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

export default account;
