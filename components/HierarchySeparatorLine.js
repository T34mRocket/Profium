import React from 'react'
import { StyleSheet, View } from 'react-native'

const HierarchySeparatorLine = ({ }) => {

  return (
    <View
        style={styles.line}
    />
  )
}

export default HierarchySeparatorLine

const styles = StyleSheet.create({
  line: {
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
    margin: 5
  }
})