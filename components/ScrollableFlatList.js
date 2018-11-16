import React from 'react'
import { Text, TouchableOpacity, FlatList, StyleSheet, View } from 'react-native'

import '../api/API'
import HierarchySeparatorLine from './HierarchySeparatorLine';

const ScrollableFlatList = ({ data, onCategoryItemPress }) => {

  return (
    <View>
      <FlatList 
        style = {{ height: 40, maxHeight: 40}}
        horizontal            
        showsHorizontalScrollIndicator = {false}
        data = {data}
        renderItem={({ item: rowData }) => {

          return (
            <TouchableOpacity
              style={styles.button}
              /*onPress={this.props.onMainCategoryPress(rowData)}*/
              onPress={() => {onCategoryItemPress(rowData); console.log("this is sub category "+rowData)}}
              delayPressIn={ 50 }
            >
              <Text>{rowData}</Text>
            </TouchableOpacity>
          )
        }}
        keyExtractor = {(item, index) => index.toString()}
      />
      <HierarchySeparatorLine/>
    </View>
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