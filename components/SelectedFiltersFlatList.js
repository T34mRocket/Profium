import React from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import { Chip } from 'react-native-paper'
import HierarchySeparatorLine from './HierarchySeparatorLine'
import AndContainer from './AndContainer'

const SelectedFiltersFlatList = ({ data, onDelete, toggleNegativity }) => {

  // console.log("type of onDelete in SelectedFiltersFlatList: " + typeof onDelete)
  return (
    <View>
        <FlatList 
        style = {{ height: 40, maxHeight: 40}}
        horizontal            
        showsHorizontalScrollIndicator = {false}
        data = {data}
        renderItem={({ item: andArray, index }) => {

          /*
          andArray.forEach(item => {
            
            console.log("andArray item: " + item.term)
          }) */

          return (
            <AndContainer searchItems={andArray} onDelete={onDelete} indexInMainArray={index} toggleNegativity={toggleNegativity} />
          )
        }}
        keyExtractor = {(item, index) => index.toString()}
        />
        <HierarchySeparatorLine/>
    </View>
  )
}

export default SelectedFiltersFlatList
  
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
  },
  chip: {
    backgroundColor: '#fff',
    margin: 4,
  },
})