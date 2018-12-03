import React from 'react'
import { View } from 'react-native'
import SearchItem from './SearchItem'

export default class AndContainer extends React.Component {

  // this should probably be a functional component; feel free to make that change
  constructor(props) {
    super(props)

    /*
    console.log("props.searchItems in AndContainer constructor:")
    props.searchItems.forEach(queryData => {
      console.log(queryData.term)
    }) */
  }

  render() {
    
    // console.log("triggered rerender for Search Items!")
    // console.log("type of onDelete in AndContainer render: " + typeof this.onDeleteItem)
    const termList = this.props.searchItems.map( (queryData) => 
      // console.log("queryData term in AndContainer: " + queryData.term); NOTE: enabling it wreaks havoc without extra parentheses !!
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
    /* termList.forEach(item =>
      console.log("searchItem: " + item)
    ) */
    return (
      <View>
        {termList}
      </View>
    )
  } // render

} // class