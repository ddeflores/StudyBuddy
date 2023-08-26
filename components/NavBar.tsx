import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native'
import React, { useState } from 'react'
import { FIREBASE_AUTH } from '../firebaseConfig'
import Icon from 'react-native-vector-icons/Ionicons';

function NavBar(): JSX.Element {
    const [visible, setVisible] = useState(false);

    return (
        <View style={styles.container}>
            <View style={styles.navBar}>
                <TouchableOpacity>
                    <Icon name="home" size={40}/>
                </TouchableOpacity>
                <Text style={{fontSize: 20, fontWeight: 'bold'}}>Your Dashboard</Text>
                <TouchableOpacity onPress={() => setVisible(!visible)}>
                    <Icon name="menu-outline" size={40}/>
                </TouchableOpacity>
            </View>
            <View style={styles.dropdown}>
                <Icon name="home" color='white' size={40}/>
                <Text style={{fontSize: 20, fontWeight: 'bold', color: 'white'}}>Your Dashboard</Text>
                {visible &&
                <View>
                    <TouchableOpacity style={styles.dropdownItem}>
                        <Text style={{fontSize: 18, fontWeight: '500'}}>My Files</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.dropdownItem}>
                        <Text style={{fontSize: 18, fontWeight: '500'}}>Upload</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.dropdownItem}>
                        <Text style={{fontSize: 18, fontWeight: '500'}}>Share</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.dropdownItem}>
                        <Text style={{fontSize: 18, fontWeight: '500'}}>Friends</Text>
                    </TouchableOpacity>
                </View>
                }
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
        paddingTop: 10,
    }
})
export default NavBar