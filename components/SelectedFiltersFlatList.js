import React from 'react'
import { StyleSheet, View } from 'react-native'
import AndContainer from './AndContainer'
import SortableFlatList from './SortableFlatList'

/**
 * Component that contains the selected search items in the top pen of the ui.
 * @author Timi Liljeström
 */

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
  } // renderItem

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
} // SelectedFiltersFlatList

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