import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const Body = () => {
  return (
    <View style={styles.container}>
      <Text style={{fontSize: 100}}>Body</Text>
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
export default Body