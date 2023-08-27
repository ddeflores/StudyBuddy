import { View, Text, StyleSheet, TouchableOpacity, Animated, Pressable } from 'react-native'
import React, { useState } from 'react'
import { FIREBASE_AUTH } from '../firebaseConfig'
import Icon from 'react-native-vector-icons/Ionicons';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';

function NavBar(): JSX.Element {
    const [visible, setVisible] = useState(false);
    const [singleFile, setSingleFile] = useState<DocumentPicker.DocumentPickerResult>(null);

    const selectFile = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
              copyToCacheDirectory: true,
              type: '*/*',
            });
            console.log('res : ' + JSON.stringify(result));
            setSingleFile(result);
        } catch (error) {
          setSingleFile(null);
          console.warn(error);
          return false;
        }
        setVisible(!visible);
    }

    const uploadToDB = async () => {

    }

    FIREBASE_AUTH.onAuthStateChanged(function(user) {
        if (!user) {
          useRouter().replace('/');
        }
      });
      
    const onSignOut = async () => {
        signOut(FIREBASE_AUTH);
    }

    const makeNewNote = async () => {
        setVisible(!visible);
    }

    return (
        <View style={styles.container}>
            <View style={styles.navBar}>
            <Ionicons name="people-circle-outline" size={40}/>
                <Text style={{fontSize: 20, fontWeight: 'bold'}}>Your Dashboard</Text>
                <TouchableOpacity onPress={() => setVisible(!visible)}>
                    <Icon name="menu-outline" size={40}/>
                </TouchableOpacity>
            </View>
            {singleFile ? singleFile.assets[0].name : ''}
            <View style={styles.dropdown}>
                <Icon name="home" color='white' size={40}/>
                <Text style={{fontSize: 20, fontWeight: 'bold', color: 'white'}}>Your Dashboard</Text>
                {visible &&
                <View>
                    <Pressable style={styles.dropdownItem} onPress={selectFile}>
                        <Text style={{fontSize: 18, fontWeight: '500'}}>Upload</Text>
                    </Pressable>
                    <Pressable style={styles.dropdownItem} onPress={makeNewNote}>
                        <Text style={{fontSize: 18, fontWeight: '500'}}>New Note</Text>
                    </Pressable>
                    <Pressable style={styles.dropdownItem} onPress={() => {useRouter().replace('/friendsList')}}>
                        <Text style={{fontSize: 18, fontWeight: '500'}}>Friends</Text>
                    </Pressable>
                    <Pressable style={styles.dropdownItem} onPress={onSignOut}>
                        <Text style={{fontSize: 18, fontWeight: '500'}}>Logout</Text>
                    </Pressable>
                </View>
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingTop: '1%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    navBar: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        borderBottomWidth: 1,
        borderBottomColor: 'black',
    },
    dropdown: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    dropdownItem: {
        paddingTop: 15,
    }
})
export default NavBar