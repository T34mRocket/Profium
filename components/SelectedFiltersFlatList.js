import React from 'react'
import { FlatList, StyleSheet, View, TouchableOpacity, Text } from 'react-native'
import { Icon } from 'react-native-elements'
import { Chip } from 'react-native-paper'
import HierarchySeparatorLine from './HierarchySeparatorLine'
import AndContainer from './AndContainer'
import SortableFlatList from './SortableFlatList'

const SelectedFiltersFlatList = ({ data, onDelete, toggleNegativity, onFilterDrag }) => {

  renderItem = ({ item, index, move, moveEnd, isActive }) => {

    return (
      <AndContainer 
        searchItems={item} 
        onDelete={onDelete} 
        indexInMainArray={index} 
        toggleNegativity={toggleNegativity} 
        move={move} 
        moveEnd={moveEnd} 
        isActive={isActive} 
      />
    )
  }

  return (
    <View style={ styles.container }>
        <SortableFlatList
          data={data}
          horizontal
          showsHorizontalScrollIndicator = {false}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => `draggable-item-${item}`}
          scrollPercent={5}
          onMoveEnd={({ data }) => {onFilterDrag(data.from, data.to, data.andArray)}}
        />
    </View>
  )
}

export default SelectedFiltersFlatList
  
const styles = StyleSheet.create({
  container: {
    height: 55, 
    maxHeight: 55, 
    backgroundColor: '#517fa4', 
    paddingTop: 8, 
    paddingBottom: 8, 
    paddingLeft: 5, 
    elevation: 5 
  },
})