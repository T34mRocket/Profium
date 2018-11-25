import React from 'react'
import { View } from 'react-native'
import SearchItem from './SearchItem'

export default class AndContainer extends React.Component {

  constructor(props) {
    super(props)

    this.mainArrayIndex = props.indexInMainArray
    this.onDeleteItem = props.onDelete

    this.state = {

      searchItems: props.searchItems // array of QueryData objects (initially containing just one item)
    }
  }

  // takes QueryData objects.
  // TODO: we'll need to access this function somehow when dragging one item to another
  // NOTE: this should probably be moved to HomeScreen and passed as a callback to this component
  _addSearchItem = (item) => {

    let containsItem = false
    this.state.searchItems.forEach((containedItem) => {
      if(item.term == containedItem.term) {
        containsItem = true
      }
    })

    if (containsItem) return

    this.setState(prevState => ({
      searchItems: [...prevState.searchItems, item]
    }))
    // TODO: visual effect of 'sticking the items together'
  } // _addSearchItem

  /*
  // passed to each contained SearchItem as their onDelete callback
  _onDeleteItem = (term) => {

    console.log("called onDeleteItem in AndContainer!")
    this.setState(prevState => ({ searchItems: prevState.searchItems.filter(containedItem => containedItem.term != term) }))
    // console.log(this.props.reloadImages)
    this.state.searchItems.forEach(item => {

      console.log("item in andContainer after delete: " + item.toString())
    })
    this.props.reloadImages()
  } */

  render() {

    // console.log("type of onDelete in AndContainer render: " + typeof this.onDeleteItem)
    // console.log("searchItems array in AndContainer render: " + this.state.searchItems)
    const termList = this.state.searchItems.map( (queryData) => 
      // console.log("queryData term in AndContainer: " + queryData.term); NOTE: enabling it wreaks havoc without extra parentheses !!
      <SearchItem queryData={queryData} onDeleteItem={this.onDeleteItem} containerArrayIndex={this.mainArrayIndex} key={queryData.term} />
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