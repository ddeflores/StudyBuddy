import { View, StyleSheet, Text, Pressable, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FIREBASE_AUTH, FIREBASE_DB } from '../firebaseConfig';
import { get, onValue, push, ref, remove, update } from 'firebase/database';
import { useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import { Ionicons } from '@expo/vector-icons';
import { onAuthStateChanged } from 'firebase/auth'
import { TextInput } from 'react-native-gesture-handler';
import { base64Decode, base64Encode } from '@firebase/util';

const userIndex = () => {
    // States
    const [currentFile, setCurrentFile] = useState<string[]>([]);
    const [friendUserID, setFriendUserID] = useState('');
    const [shareMenuVisible, setShareMenuVisible] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [noteVisible, setNoteVisible] = useState(false);
    const [title, setTitle] = useState('');
    const [note, setNote] = useState('');
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
              type: ['application/pdf', 'text/*', 'image/*'],
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
    function uploadToDB(userId: string, fileURL: string, fileName: string) {
        if (userId === FIREBASE_AUTH.currentUser.uid) {
            if (!filenames.includes(fileName)) {
                const newRef = push(ref(FIREBASE_DB, 'users/' + userId + '/files'))
                update(newRef, {
                filename : fileName,
                filepath: fileURL
                }).catch((error) => {
                    alert(error);
                })
                setSingleFile(null);
                setCurrentFile([]);
            }
            else {
                alert('A file with this name already exists!');
            }
        }
        else {
            const newRef = push(ref(FIREBASE_DB, 'users/' + userId + '/files'))
            update(newRef, {
            filename : fileName,
            filepath: fileURL
            }).catch((error) => {
                alert(error);
            })
            setSingleFile(null);
            setCurrentFile([]);
            setShareMenuVisible(false);
        }
    }

    // TO DO
    function uploadNoteToDB(fileName: string, contents: string) {
        let textFile = null;
        const data = new Blob([contents], {type: 'text/plain'});
        if (textFile !== null) {
            window.URL.revokeObjectURL(textFile);
        }
        textFile = window.URL.createObjectURL(data);
        console.log(textFile);
        uploadToDB(FIREBASE_AUTH.currentUser.uid, textFile, fileName);
        setNoteVisible(false);
    }

    function deleteFromDB(fileURL: string, fileName: string) {
        const newRef = ref(FIREBASE_DB, 'users/' + FIREBASE_AUTH.currentUser.uid + '/files/' + fileURL);
        console.log(newRef.toString());
        remove(newRef).catch((error) => {
            alert(error);
        })
        const newKeys = keys.filter((key: string) => key != fileURL);
        setKeys(newKeys);
        const newFilenames = filenames.filter((filename: string) => filename != fileName);
        setFilenames(newFilenames);
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

    // TODO
    const makeNewNote = async () => {
        setNoteVisible(!noteVisible);
    }

    // Open file when clicked on by encoding the data URI to base64, and then decoding it to a regular URL
    function openFile(fileURL: string) {
        const starCountRef = ref(FIREBASE_DB, 'users/' + FIREBASE_AUTH.currentUser.uid + '/files/' + fileURL + '/filepath');
        get(starCountRef).then((snapshot) => {
            const data = snapshot.val();
            const dataAsURL = base64Encode(data);
            console.log(dataAsURL);
            var win = window.open();
            win.document.write('<iframe src="' + base64Decode(dataAsURL) + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
        }
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.navContainer}>
                <View style={styles.navBar}>
                <Ionicons name="people-circle-outline" size={40}/>
                    <Text style={{fontSize: 20, fontWeight: 'bold'}}>Your Dashboard</Text>
                    <TouchableOpacity onPress={() => {setVisible(!visible), setEditMode(false), setNoteVisible(false), setShareMenuVisible(false)}}>
                        <Icon name="menu-outline" size={40}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.dropdown}>
                    <Icon name="home" color='white' size={40}/>
                    <Text style={{fontSize: 20, fontWeight: 'bold', color: 'white'}}>Your Dashboard</Text>
                    {visible &&
                    <View>
                        <Pressable style={styles.dropdownItem} onPress={selectFile}>
                            <Text style={{fontSize: 18, fontWeight: '500'}}>Upload File</Text>
                        </Pressable>
                        <Pressable onPress={() => setEditMode(!editMode)} style={styles.dropdownItem}>
                            <Text style={{fontSize: 18, fontWeight: '500'}}>Delete Files</Text>
                        </Pressable>
                        <Pressable style={styles.dropdownItem} onPress={makeNewNote}>
                            <Text style={{fontSize: 18, fontWeight: '500'}}>Make Note</Text>
                        </Pressable>
                        <Pressable style={styles.dropdownItem} onPress={() => {useRouter().push('/friendsList')}}>
                            <Text style={{fontSize: 18, fontWeight: '500'}}>Friends</Text>
                        </Pressable>
                        <Pressable style={styles.dropdownItem} onPress={() => {useRouter().push('/account')}}>
                            <Text style={{fontSize: 18, fontWeight: '500'}}>Account</Text>
                        </Pressable>
                    </View>
                    }
                </View>
            </View>
            {singleFile && 
            <>
                <Text style={{marginTop: '10%', fontSize: 20, fontWeight: '500'}}>
                    Filetype must be pdf, text, or image
                </Text>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', marginTop: '1%' }}>
                    <Text style={{ display: 'flex', justifyContent: 'center', color: 'blue', fontSize: 15 }}>{singleFile.assets[0].name + ': '}</Text>
                    <Pressable onPress={() => uploadToDB(FIREBASE_AUTH.currentUser.uid, singleFile.assets[0].uri, singleFile.assets[0].name)}>
                        <Text style={{ fontWeight: 'bold', paddingRight: 10 }}>Confirm upload?</Text>
                    </Pressable>
                    <Text style={{marginRight: 10, fontWeight: 'bold'}}>OR</Text>
                    <Pressable onPress={() => setSingleFile(null)}>
                    <Text style={{ fontWeight: 'bold', paddingRight: 10 }}>Cancel</Text>
                </Pressable>
                </View>
            </>
            }
            <View style={styles.body}>
                <View>
                    <Text style={{fontSize: 26, color: 'black', fontWeight: 'bold'}}>Your Files:</Text>
                    {filenames.map((item, index) => {
                        return (
                            <View key={index} style={{paddingBottom: '2%'}}>
                                <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                                    <Pressable onPress={() => openFile(keys[index])}>
                                        <Text style={{fontSize: 18}}>{item}</Text>
                                    </Pressable>
                                    <Pressable style={styles.buttons} onPress={() => {setShareMenuVisible(!shareMenuVisible), setCurrentFile([keys[index], item])}}>
                                        <Text style={{color: 'white', fontWeight: 'bold', fontSize: 14}}>Share</Text>
                                    </Pressable>
                                    {editMode &&
                                    <Pressable style={styles.buttons} onPress={() => deleteFromDB(keys[index], item)}>
                                        <Text style={{color: 'white', fontWeight: 'bold', fontSize: 14}}>Delete</Text>
                                    </Pressable>
                                    }
                                </View>
                            </View>
                        )
                    })}
                </View>
            </View>
            {shareMenuVisible &&
            <View style={styles.noteContainer}>
                <TextInput placeholderTextColor="gray" style={styles.input} placeholder={"Friends's UserID: "} onChangeText={(newFriendUserID) => setFriendUserID(newFriendUserID)} defaultValue={friendUserID}></TextInput>
                <Pressable style={styles.buttons} onPress={() => {uploadToDB(friendUserID, currentFile[0], currentFile[1])}}>
                    <Text style={{color: 'white', fontWeight: 'bold', fontSize: 14}}>Share</Text>
                </Pressable>
            </View>
            }
            {noteVisible &&
            <View style={styles.noteContainer}>
                <TextInput style={styles.input} placeholder=' Title' placeholderTextColor="gray" autoCapitalize='none' onChangeText={newTitle => setTitle(newTitle)} defaultValue={title}></TextInput>
                <TextInput style={styles.input} placeholder=' Note' placeholderTextColor="gray" autoCapitalize='none' onChangeText={newNote => setNote(newNote)} defaultValue={note}></TextInput>
                <Pressable style={styles.buttons} onPress={() => {uploadNoteToDB(title, note)}} >
                    <Text style={{color: 'white', fontWeight: 'bold', fontSize: 14}}>
                        Upload note
                    </Text>
                </Pressable>
            </View>
            }
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
    noteContainer: {
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
    buttons: {
        marginLeft: 8,
        backgroundColor: 'black',
        padding: 3,
        borderRadius: 12,
        borderWidth: 3,
    },
})
export default userIndex