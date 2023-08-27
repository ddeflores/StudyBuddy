import { View, Text, StyleSheet } from 'react-native'
import React, { useState } from 'react'

function Body(userFiles: any): JSX.Element {
  const [files, setFiles] = useState(userFiles);
  
  return (
    <View style={styles.container}>
      <View>
        <Text style={{fontSize: 20, color: 'black'}}>Your Files:</Text>
        <Text>Don't have any files? Make or upload one by tapping the top right corner!</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
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