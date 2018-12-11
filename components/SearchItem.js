import React from 'react'
import { StyleSheet, TouchableOpacity, Text } from 'react-native'
import { Icon } from 'react-native-elements'

/**
 * @author Ville Lohkovuori, Timi Liljeström
 */

export default class SearchItem extends React.Component { 

  // this could be a functional component I suppose, but I've hard that 
  // if you include methods in a component, it should be of the class type
  constructor(props) {
    super(props)
  }

  _onDeleteItem = () => {

    // passed here all the way from HomeScreen
    this.props.onDeleteItem(this.props.queryData.term, this.props.containerArrayIndex)
  }

  // toggles the isNegative property of the corresponding queryData item in the app state array.
  _toggleNegativity = () => {

    // passed down all the way from HomeScreen
    this.props.toggleNegativity(this.props.queryData.term, this.props.containerArrayIndex)
  }

  render() {

    if(this.props.allSearchItemsInAndArray.length<2){
      return (
        <TouchableOpacity
          style={{ 
            height: 40, 
            backgroundColor: this.props.queryData.isNegative ? 'rgba(142, 142, 142, 0.6)' : 'transparent',
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
          <Icon name='close' type='AntDesign' style={styles.icon} onPress={() => {this._onDeleteItem()}}></Icon>
        </TouchableOpacity>
      )
    } // if(termArray.length<2)
    else {
      return (
        <TouchableOpacity
          style={{ 
            height: 40, 
            alignItems: 'center', 
            justifyContent: 'center',
            flexDirection: "row",
            paddingLeft: 2.5,
          }}
          onLongPress={this.props.move}
          onPressOut={this.props.moveEnd}
        >
          {this.props.allSearchItemsInAndArray.map((item)=>{
            return(
              <Text style={{ 
                color: 'black',
                paddingLeft: 2.5,
                paddingRight: 2.5,
                borderWidth: 1,
                borderRadius: 5,
                borderEndColor: 'black',
                backgroundColor: item.isNegative ? 'rgba(142, 142, 142, 0.6)' : 'transparent'
              }}
              key={item.term}>{item.term}</Text>
            )
          })}
          <Icon name='close' type='AntDesign' style={styles.icon} onPress={() => {this._onDeleteItem()}}></Icon>
        </TouchableOpacity>
      )
    } // else
  } // render
    
} // SearchItem

const styles = StyleSheet.create({
  icon: {
    paddingLeft:15, 
    paddingRight:15, 
    margin:5
  },
})