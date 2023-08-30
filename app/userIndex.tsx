import { View, StyleSheet, Text, Pressable, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import Body from '../components/Body';
import NavBar from '../components/NavBar';
import { FIREBASE_AUTH, FIREBASE_DB } from '../firebaseConfig';
import { child, get, onValue, push, ref, update } from 'firebase/database';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import * as DocumentPicker from 'expo-document-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import { Ionicons } from '@expo/vector-icons';

const userIndex = () => {
    // States
    const [confirmVisible, setConfirmVisible] = useState(false);
    const [visible, setVisible] = useState(false);
    const [singleFile, setSingleFile] = useState<DocumentPicker.DocumentPickerResult>(null);
    const [keys, setKeys] = useState<string[]>([]);
    const [filenames, setFilenames] = useState<string[]>([]);

    // Update files to display
    function updateFiles(newFile: string) {
        const newFilenames = [...filenames, newFile];
        setFilenames(newFilenames);
    }
    
    // Prompt the user to select a file to upload
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

    // Upload the selected file to the database
    function uploadToDB(userId: string, name: string, email: string, fileURL: string, fileName: string) {
        const newRef = push(ref(FIREBASE_DB, 'users/' + userId + '/files'))
        update(newRef, {
          filename : fileName,
          filepath: fileURL
        }).catch((error) => {
            alert(error);
        })
        setSingleFile(null);
    }

    // Update the list of keys to access files in db
    function updateKeys(newKey: string) {
        const newKeys = [...keys, newKey];
        setKeys(newKeys);
    }

    // Listen for updates to files in db
    useEffect(() => {
        const dbRef = ref(FIREBASE_DB, 'users/' + FIREBASE_AUTH.currentUser.uid + '/files')
        onValue(dbRef, (snapshot) => {
            snapshot.forEach((childSnapshot) => {
              const childKey = childSnapshot.key;
              if (!keys.includes(childKey)) {
                updateKeys(childKey);
              }
              console.log(keys);
            });
          });
    }, [filenames]);

    // Listen for updates to files in db
    useEffect(() => {
        for (let i = 0; i < keys.length; i++) {
            const starCountRef = ref(FIREBASE_DB, 'users/' + FIREBASE_AUTH.currentUser.uid + '/files/' + keys[i] + '/filename');
            onValue(starCountRef, (snapshot) => {
                const data = snapshot.val();
                const newFiles = Object.keys(data || {}).map(key => ({
                id: key,
                ...data[key],
                }));
                if (!filenames.includes(data)) {
                    updateFiles(data);
                }
                console.log(newFiles);
            });
        }
    }, [keys]);

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

    // TODO
    const makeNewNote = async () => {
        setVisible(!visible);
    }

    return (
        <View style={styles.container}>
            <View style={styles.navContainer}>
                <View style={styles.navBar}>
                <Ionicons name="people-circle-outline" size={40}/>
                    <Text style={{fontSize: 20, fontWeight: 'bold'}}>Your Dashboard</Text>
                    <TouchableOpacity onPress={() => setVisible(!visible)}>
                        <Icon name="menu-outline" size={40}/>
                    </TouchableOpacity>
                </View>
                {singleFile && 
                <View style={{display: 'flex', flexDirection: 'row', alignItems: 'flex-end', marginTop: '10%'}}>
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
            <View style={styles.body}>
                <View>
                    <Text style={{fontSize: 20, color: 'black', fontWeight: 'bold'}}>Your Files:</Text>
                    {filenames && <Text>Don't have any files? Make or upload one by tapping the top right corner!</Text>}
                    {filenames.map((item, index) => {
                        return (
                            <View key={index}>
                                <Text>{item}</Text>
                            </View>
                        )
                    })}
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingTop: '1%',
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
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
    },
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
export default userIndex