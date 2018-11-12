import React from 'react'
import { Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native'

const ScrollableFlatList = ({ props }) => {

  return (
    <FlatList 
      style = {{ maxHeight: 60}}
      horizontal            
      showsHorizontalScrollIndicator = {false}
      data = {props}
      renderItem={({ item: rowData }) => {

        return (
          <TouchableOpacity
            style={styles.button}
            onPress={() => console.log("pressed "+rowData)}
            delayPressIn={ 50 }
          >
            <Text>{rowData}</Text>
          </TouchableOpacity>
        )
      }}
      keyExtractor={(item, index) => index.toString()}
    />
  )
}

export default ScrollableFlatList
  
const styles = StyleSheet.create({
  button: {
    shadowColor: 'rgba(0,0,0, .4)', // IOS
    shadowOffset: { height: 1, width: 1 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS,
    borderRadius: 5,
    backgroundColor: '#fff',
    elevation: 4, // Android
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
    marginRight:5,
    marginBottom:8,
    padding: 5
  }
})