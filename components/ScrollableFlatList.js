import React from 'react'
import { Text, TouchableOpacity, FlatList, StyleSheet, View } from 'react-native'

/**
 * Component that contains the clickable search items.
 * @author Timi Liljeström
 */

const ScrollableFlatList = ({ data, onCategoryItemPress }) => {

  return (
    <View>
      <FlatList 
        style = {{ height: 40, maxHeight: 40, marginTop: 3}}
        horizontal            
        showsHorizontalScrollIndicator = {false}
        data = {data}
        renderItem={({ item: rowData }) => {

          return (
            <TouchableOpacity
              style={styles.button}
              onPress={() => {onCategoryItemPress(rowData)}}
              delayPressIn={ 50 }
            >
              <Text>{rowData}</Text>
            </TouchableOpacity>
          )
        }}
        keyExtractor = {(item, index) => index.toString()}
      />
    </View>
  )
} // ScrollableFlatList

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
}) // styles