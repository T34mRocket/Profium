import React from 'react'
import { View } from 'react-native'
import SearchItem from './SearchItem'

/**
 * A graphical representation of an andArray in the HomeScreen state.
 * Needed to deal with combining and dragging the search items.
 * @author Ville Lohkovuori, Timi Liljeström
 */

export default class AndContainer extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    
    const termList = this.props.searchItems.map( (queryData) => 
      <SearchItem 
        queryData={queryData} 
        onDeleteItem={this.props.onDelete} 
        containerArrayIndex={this.props.indexInMainArray}
        toggleNegativity={this.props.toggleNegativity} 
        key={queryData.term} 
        move={this.props.move} 
        moveEnd={this.props.moveEnd} 
        isActive={this.props.isActive}
        allSearchItemsInAndArray={this.props.searchItems}
        />
    )
    
    return (
      <View>
        {termList}
      </View>
    )
  } // render

} // class