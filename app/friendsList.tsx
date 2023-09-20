import { View, StyleSheet, Text, Pressable, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FIREBASE_AUTH, FIREBASE_DB } from '../firebaseConfig';
import { child, get, onValue, push, ref, remove, update } from 'firebase/database';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import * as DocumentPicker from 'expo-document-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import { Ionicons } from '@expo/vector-icons';
import { onAuthStateChanged } from 'firebase/auth'
import { TextInput } from 'react-native-gesture-handler';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { base64Decode, base64Encode } from '@firebase/util';

const userIndex = () => {
    // States
    const [friendUserID, setFriendUserID] = useState('');
    const [friendUsername, setFriendUsername] = useState('');
    const [addVisible, setAddVisible] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [visible, setVisible] = useState(false);
    const [singleFriend, setSingleFriend] = useState<string>(null);
    const [keys, setKeys] = useState<string[]>([]);
    const [friends, setFriends] = useState<string[]>([]);

    // Update files to display
    function updateFiles(newFile: string) {
        const newFilenames = [...friends, newFile];
        setFriends(newFilenames);
    }

    // Upload the selected file to the database
    function addFriend(userId: string, friendID: string, friendName: string) {
        if (!friends.includes(friendName)) {
            const newRef = push(ref(FIREBASE_DB, 'users/' + userId + '/friends'))
            update(newRef, {
            friendName: friendName,
            friendID: friendID
            }).catch((error) => {
                alert(error);
            })
            setSingleFriend(null);
            setAddVisible(false);
        }
        else {
            alert('You already added this user!');
        }
    }

    function deleteFromDB(friendID: string, friendName: string) {
        const newRef = ref(FIREBASE_DB, 'users/' + FIREBASE_AUTH.currentUser.uid + '/friends/' + friendID);
        console.log(newRef.toString());
        remove(newRef).catch((error) => {
            alert(error);
        })
        setEditMode(!editMode);
        const newKeys = keys.filter((key: string) => key != friendID);
        setKeys(newKeys);
        const newFriends = friends.filter((filename: string) => filename != friendName);
        setFriends(newFriends);
    }

    // Update the list of keys to access files in db
    function updateKeys(newKey: string) {
        const newKeys = [...keys, newKey];
        setKeys(newKeys);
    }

    // Listen for updates to files in db
    useEffect(() => {
        const dbRef = ref(FIREBASE_DB, 'users/' + FIREBASE_AUTH.currentUser.uid + '/friends')
        onValue(dbRef, (snapshot) => {
            snapshot.forEach((childSnapshot) => {
              const childKey = childSnapshot.key;
              if (!keys.includes(childKey)) {
                updateKeys(childKey);
              }
              console.log(keys);
            });
          });
    }, [friends]);

    // Listen for updates to files in db
    useEffect(() => {
        for (let i = 0; i < keys.length; i++) {
            const starCountRef = ref(FIREBASE_DB, 'users/' + FIREBASE_AUTH.currentUser.uid + '/friends/' + keys[i] + '/friendName');
            onValue(starCountRef, (snapshot) => {
                const data = snapshot.val();
                const newFiles = Object.keys(data || {}).map(key => ({
                id: key,
                ...data[key],
                }));
                if (!friends.includes(data)) {
                    updateFiles(data);
                }
                console.log(newFiles);
            });
        }
    }, [keys]);

    return (
        <View style={styles.container}>
            <View style={styles.navContainer}>
                <View style={styles.navBar}>
                    <Ionicons name="people-circle-outline" size={40}/>
                    <Text style={{fontSize: 20, fontWeight: 'bold'}}>Friends List</Text>
                    <TouchableOpacity onPress={() => {setVisible(!visible), setAddVisible(false), setEditMode(false)}}>
                        <Icon name="menu-outline" size={40}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.dropdown}>
                    <Icon name="home" color='white' size={40}/>
                    <Text style={{fontSize: 20, fontWeight: 'bold', color: 'white'}}>Your Dashboard</Text>
                    {visible &&
                    <View>
                        <Pressable style={styles.dropdownItem} onPress={() => {setAddVisible(!addVisible)}}>
                            <Text style={{fontSize: 18, fontWeight: '500'}}>Add Friends</Text>
                        </Pressable>
                        <Pressable onPress={() => setEditMode(!editMode)} style={styles.dropdownItem}>
                            <Text style={{fontSize: 18, fontWeight: '500'}}>Delete Friends</Text>
                        </Pressable>
                        <Pressable style={styles.dropdownItem} onPress={() => {useRouter().push('/userIndex')}}>
                            <Text style={{fontSize: 18, fontWeight: '500'}}>Your Files</Text>
                        </Pressable>
                        <Pressable style={styles.dropdownItem} onPress={() => {useRouter().push('/account')}}>
                            <Text style={{fontSize: 18, fontWeight: '500'}}>Account</Text>
                        </Pressable>
                    </View>
                    }
                </View>
            </View>
            {addVisible && 
            <>
                <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '5%', justifyContent: 'center' }}>
                    <View>
                        <TextInput placeholderTextColor="gray" style={styles.input} placeholder={"Friends's UserID: "} onChangeText={(newFriendUserID) => setFriendUserID(newFriendUserID)} defaultValue={friendUserID}></TextInput>
                        <TextInput placeholderTextColor="gray" style={styles.input} placeholder={"List Display Name: "} onChangeText={(newFriendUsername) => setFriendUsername(newFriendUsername)} defaultValue={friendUsername}></TextInput>
                    </View>
                    <View style={{display: 'flex', flexDirection: 'row'}}>
                        <Pressable onPress={() => addFriend(FIREBASE_AUTH.currentUser.uid, friendUserID, friendUsername)}>
                            <Text style={{ fontWeight: 'bold', paddingRight: 10 }}>Add Friend</Text>
                        </Pressable>
                        <Text style={{marginRight: 10, fontWeight: 'bold'}}>OR</Text>
                        <Pressable onPress={() => setAddVisible(null)}>
                            <Text style={{ fontWeight: 'bold', paddingRight: 10 }}>Cancel</Text>
                        </Pressable>
                    </View>
                </View>
            </>
            }
            <View style={styles.body}>
                <View>
                    <Text style={{fontSize: 26, color: 'black', fontWeight: 'bold'}}>Your Friends:</Text>
                    {friends.map((item, index) => {
                        return (
                            <View key={index} style={{paddingBottom: '2%'}}>
                                <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                                    <Text style={{fontSize: 18}}>{item}</Text>
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