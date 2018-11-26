import React from 'react'
import { View } from 'react-native'
import SearchItem from './SearchItem'

export default class AndContainer extends React.Component {

  // this should probably be a functional component; feel free to make that change
  constructor(props) {
    super(props)

  }

  // takes QueryData objects.
  // IMPORTANT NOTE: DO NOT USE AS IT IS! needs to be refactored !!!
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

  render() {

    // console.log("triggered rerender for Search Items!")
    // console.log("type of onDelete in AndContainer render: " + typeof this.onDeleteItem)
    // console.log("searchItems array in AndContainer render: " + this.state.searchItems)
    const termList = this.props.searchItems.map( (queryData) => 
      // console.log("queryData term in AndContainer: " + queryData.term); NOTE: enabling it wreaks havoc without extra parentheses !!
      <SearchItem queryData={queryData} onDeleteItem={this.props.onDelete} containerArrayIndex={this.props.indexInMainArray} key={queryData.term} />
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