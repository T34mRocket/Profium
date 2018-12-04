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
    console.log("is negative?: " + this.props.queryData.negative)
    // this.props.allSearchItemsInAndArray will look something like:
    // term: tekninen kuva, negative: false,term: hallinto, negative: false
    const objectString = this.props.allSearchItemsInAndArray.toString()
    const splittedArray = objectString.split("term: ")
    // splitting objectString will then make array which looks like: 
    /*
      Array [
        "",
        "tekninen kuva, negative: false,",
        "hallinto, negative: false",
      ]
    */
    // if the splitted array has more than one term ->
    // take all the terms in that array by splitting this time the looped item with "," and taking just the first item
    let termArray = []
    if(splittedArray.length > 2) for(let i=1; i < splittedArray.length; i++) { 
      termArray.push(splittedArray[i].split(",")[0]) 
    }

    if(termArray.length<2){
      return (
        <TouchableOpacity
          style={{ 
            height: 40, 
            //backgroundColor: `${ !this.props.isActive }%` ? 'rgba(52, 52, 52, 0.8)' : 'white',
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
            <Icon name='close' type='AntDesign' style={{ paddingLeft:15, paddingRight:15, margin:5 }} onPress={() => {this._onDeleteItem()}}></Icon>
        </TouchableOpacity>
      )
    } // if(termArray.length<2)
    else {
      return (
        <TouchableOpacity
          style={{ 
            height: 40, 
            //backgroundColor: `${ !this.props.isActive }%` ? 'rgba(52, 52, 52, 0.8)' : 'white',
            backgroundColor: this.props.queryData.isNegative ? 'rgba(142, 142, 142, 0.6)' : 'transparent',
            alignItems: 'center', 
            justifyContent: 'center',
            flexDirection: "row",
          }}
          onLongPress={this.props.move}
          onPressOut={this.props.moveEnd}
          onPress={()=>{this._toggleNegativity()}}
        >
          {termArray.map((item)=>{
            return(
              <Text style={{ 
                color: 'black',
                paddingLeft: 2.5,
                paddingRight: 2.5,
                borderRightWidth: 1,
                borderEndColor: 'black'
              }}
              key={item}>{item}</Text>
            )
          })}
          <Icon name='close' type='AntDesign' style={{ paddingLeft:15, paddingRight:15, margin:5 }} onPress={() => {this._onDeleteItem()}}></Icon>
        </TouchableOpacity>
      )
    } // else
  }
    

} // SearchItem

const styles = StyleSheet.create({

  chip: {
    backgroundColor: '#fff',
    margin: 4,
  },
})