import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as DocumentPicker from 'expo-document-picker';
import { getDatabase, onValue, ref, set } from 'firebase/database';
import { FIREBASE_AUTH, FIREBASE_DB } from '../firebaseConfig';

function Body(): JSX.Element {

  return (
    <View style={styles.body}>
      <View>
        <Text style={{fontSize: 20, color: 'black', fontWeight: 'bold'}}>Your Files:</Text>
        <Text>Don't have any files? Make or upload one by tapping the top right corner!</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  body: {
    paddingTop: '1%',
    paddingLeft: '10%',
    width: '80%',
    marginRight: '30%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    position: 'absolute',
    top: '10%',
  },
})
export default Body