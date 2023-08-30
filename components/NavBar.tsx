import { View, Text, StyleSheet, TouchableOpacity, Animated, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FIREBASE_AUTH, FIREBASE_DB } from '../firebaseConfig'
import Icon from 'react-native-vector-icons/Ionicons';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';
import { onValue, push, ref, update } from "firebase/database";

function NavBar(): JSX.Element {
    const [confirmVisible, setConfirmVisible] = useState(false);
    const [visible, setVisible] = useState(false);
    const [singleFile, setSingleFile] = useState<DocumentPicker.DocumentPickerResult>(null);
    const [keys, setKeys] = useState([]);
    const [filenames, setFilenames] = useState<string[]>([]);

    function updateFiles(newFile: string) {
        const newFilenames = [...filenames, newFile];
        setFilenames(newFilenames);
    }
    
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

    function addKey(newKey: string) {
        const newKeys = [...keys, newKey];
        setKeys(newKeys);
    }

    function uploadToDB(userId: string, name: string, email: string, fileURL: string, fileName: string) {
        const newRef = push(ref(FIREBASE_DB, 'users/' + userId + '/files'))
        update(newRef, {
          filename : fileName,
          filepath: fileURL
        }).catch((error) => {
            alert(error);
        })
        setSingleFile(null);
        addKey(newRef.key);
    }

    useEffect(() => {
        const starCountRef = ref(FIREBASE_DB, 'users/' + FIREBASE_AUTH.currentUser.uid + '/files/' + keys[keys.length - 1]);
        onValue(starCountRef, (snapshot) => {
          const data = snapshot.val();
          updateFiles(data);
        });
    }, []);

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
        <View style={styles.navContainer}>
            <View style={styles.navBar}>
            <Ionicons name="people-circle-outline" size={40}/>
                <Text style={{fontSize: 20, fontWeight: 'bold'}}>Your Dashboard</Text>
                <TouchableOpacity onPress={() => setVisible(!visible)}>
                    <Icon name="menu-outline" size={40}/>
                </TouchableOpacity>
            </View>
            {singleFile && 
            <View style={{display: 'flex', flexDirection: 'row', alignItems: 'flex-end', marginTop: 50}}>
                <Text style={{display: 'flex', justifyContent: 'center', color: 'blue', fontSize: 15}}>{singleFile.assets[0].name + ': '}</Text>
                <Pressable onPress={() => uploadToDB(FIREBASE_AUTH.currentUser.uid, FIREBASE_AUTH.currentUser.displayName, FIREBASE_AUTH.currentUser.email, singleFile.assets[0].uri, singleFile.assets[0].name)}>
                    <Text style={{fontWeight: 'bold', paddingRight: 10}}>Confirm upload</Text>
                </Pressable>
            </View>}
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
                    <Pressable style={styles.dropdownItem} onPress={() => setConfirmVisible(true)}>
                        <Text style={{fontSize: 18, fontWeight: '500'}}>Logout</Text>
                    </Pressable>
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
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    navContainer: {
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