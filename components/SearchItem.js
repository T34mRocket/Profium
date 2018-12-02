import React from 'react'
import { Chip } from 'react-native-paper'
import { StyleSheet, TouchableOpacity, Text } from 'react-native'
import { Icon } from 'react-native-elements'

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

    // console.log("called toggleNegativity")
    this.props.toggleNegativity(this.props.queryData.term, this.props.containerArrayIndex)
  }

  render() {

    console.log("term within SearchItem render: " + this.props.queryData.term)

    return (
      <TouchableOpacity
        style={{ 
          height: 40, 
          //backgroundColor: `${ !this.props.isActive }%` ? 'rgba(52, 52, 52, 0.8)' : 'white',
          alignItems: 'center', 
          justifyContent: 'center',
          flexDirection: "row",
        }}
        onLongPress={this.props.move}
        onPressOut={this.props.moveEnd}
        onPress={()=>{this._toggleNegativity()}}
      >
          <Text style={{ 
            color: 'black',
            paddingLeft:5,
            paddingRight:5,
          }}>{this.props.queryData.term}</Text>
          <Icon name='close' type='AntDesign' style={{ paddingLeft:15, paddingRight:15, margin:5 }} onPress={() => {this._onDeleteItem()}}></Icon>
      </TouchableOpacity>
    )
  } // render

} // SearchItem

const styles = StyleSheet.create({

  chip: {
    backgroundColor: '#fff',
    margin: 4,
  },
})