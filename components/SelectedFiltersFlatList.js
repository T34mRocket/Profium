import React from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import { Chip } from 'react-native-paper'
import HierarchySeparatorLine from './HierarchySeparatorLine';

const SelectedFiltersFlatList = ({ data, onDelete }) => {

  return (
    <View>
        <FlatList 
        style = {{ height: 40, maxHeight: 40}}
        horizontal            
        showsHorizontalScrollIndicator = {false}
        data = {data}
        renderItem={({ item: rowData }) => {

            return (
            <Chip onPress={() => {}} onClose={() => {onDelete(rowData)}} style={styles.chip}>
                {rowData}
            </Chip>
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