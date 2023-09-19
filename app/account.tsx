import { View, Text } from 'react-native'
import React from 'react'
import { FIREBASE_AUTH } from '../firebaseConfig'

const account = () => {
  return (
    <View>
      <Text>USERID: #{FIREBASE_AUTH.currentUser.uid}</Text>
    </View>
  )
}

export default account