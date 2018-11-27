import React from 'react'
import { Chip } from 'react-native-paper'
import { StyleSheet} from 'react-native'

export default class SearchItem extends React.Component { 

  // again, this could be a functional component
  constructor(props) {
    super(props)
  }

  // uses stuffs that are passed here all the way from HomeScreen... beautiful f'in mess, React -.-
  _onDeleteItem = () => {

    this.props.onDeleteItem(this.props.queryData.term, this.props.containerArrayIndex)
  }

  // toggles the isNegative property of the corresponding queryData item in the app state array.
  // passed down all the way from HomeScreen
  _toggleNegativity = () => {

    console.log("called toggleNegativity")
    this.props.toggleNegativity(this.props.queryData.term, this.props.containerArrayIndex)
  }

  render() {

    // console.log("term in SearchItem component: " + this.state.term)

    return (
      <Chip onPress={() => {this._toggleNegativity()}} onClose={() => {this._onDeleteItem()}} style={styles.chip}>
        {this.props.queryData.term}
      </Chip>
    )
  } // render

} // SearchItem

const styles = StyleSheet.create({

  chip: {
    backgroundColor: '#fff',
    margin: 4,
  },
})