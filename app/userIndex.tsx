import { View, StyleSheet } from 'react-native'
import React from 'react'
import Body from '../components/Body';
import NavBar from '../components/NavBar';

const userIndex = () => {
    return (
        <View style={styles.container}>
            <NavBar></NavBar>
            <Body></Body>
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
})
export default userIndex