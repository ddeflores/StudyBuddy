import { View, StyleSheet, Text, Pressable, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/Ionicons';
import React, { useState } from 'react';

const friendsList = () => {
  const [visible, setVisible] = useState(false);
  const[friendID, setFriendID] = useState('');

  function addFriend(userID: string) {

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
          <View style={styles.dropdown}>
              <Icon name="home" color='white' size={40}/>
              <Text style={{fontSize: 20, fontWeight: 'bold', color: 'white'}}>Friends List</Text>
              {visible &&
              <View>
                  <Pressable style={styles.dropdownItem} onPress={() => addFriend(friendID)}>
                      <Text style={{fontSize: 18, fontWeight: '500'}}>Upload PDF</Text>
                  </Pressable>
              </View>
              }
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

export default friendsList