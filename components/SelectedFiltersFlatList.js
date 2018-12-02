import React from 'react'
import { FlatList, StyleSheet, View, TouchableOpacity, Text } from 'react-native'
import { Icon } from 'react-native-elements'
import { Chip } from 'react-native-paper'
import HierarchySeparatorLine from './HierarchySeparatorLine'
import AndContainer from './AndContainer'
import SortableFlatList from './SortableFlatList'

const SelectedFiltersFlatList = ({ data, onDelete, toggleNegativity, onFilterDrag }) => {

  renderItem = ({ item, index, move, moveEnd, isActive }) => {

    /*
    console.log("searchItems prop given to AndContainer in SelectedFiltersFlatList: ")
    item.forEach(queryData => {
      console.log(queryData.term)
    }) */

    return (
      /*<TouchableOpacity
        style={{ 
          height: 40, 
          backgroundColor: isActive ? 'rgba(52, 52, 52, 0.8)' : 'white',
          alignItems: 'center', 
          justifyContent: 'center',
          flexDirection: "row",
        }}
        onLongPress={move}
        onPressOut={moveEnd}
      >
          <Text style={{ 
            color: 'black',
            paddingLeft:5,
            paddingRight:5
          }}>{item}</Text>
          <Icon name='close' type='AntDesign' style={{ paddingLeft:15, paddingRight:15, margin:5 }} onPress={() => {onDelete(item)}}></Icon>
      </TouchableOpacity>*/
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
  /*
  console.log("andArrays data in SelectedFiltersFlatList: ")
  data.forEach(andArray => {
    andArray.forEach(queryData => {
      console.log("term:" + queryData.term)
    })
  }) */

  // console.log("type of onDelete in SelectedFiltersFlatList: " + typeof onDelete)
  return (
    <View style={{ height: 50, maxHeight: 50 }}>
        <SortableFlatList
          data={data}
          horizontal
          showsHorizontalScrollIndicator = {false}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => `draggable-item-${item}`}
          scrollPercent={5}
          onMoveEnd={({ data }) => {onFilterDrag(data.from, data.to, data.andArray)}}
        />
        {/*<SortableFlatList 
        style = {{ height: 40, maxHeight: 40}}
        horizontal            
        showsHorizontalScrollIndicator = {false}
        data = {data}
        keyExtractor={(item, index) => `draggable-item-${item}`}
        scrollPercent={5}
        renderItem={this.renderItem}
        renderItem={({ item: andArray, index }) => {

          /*
          andArray.forEach(item => {
            
            console.log("andArray item: " + item.term)
          }) */

          /*return (
            <AndContainer searchItems={andArray} onDelete={onDelete} indexInMainArray={index} toggleNegativity={toggleNegativity} />
          )
        }}
        onMoveEnd={({ data }) => {onFilterDrag(data)}}
        />*/}
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