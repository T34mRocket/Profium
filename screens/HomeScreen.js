import React from 'react'
import {
  Picker,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Alert,
  FlatList,
  Button,
  StatusBar
} from 'react-native'
import { WebBrowser } from 'expo'

import { MonoText } from '../components/StyledText'
import { CustomPicker } from 'react-native-custom-picker'
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-cards'
import ScrollableFlatList from '../components/ScrollableFlatList'
import ImageCardListItem from '../components/ImageCardListItem'
import API from '../api/API'


// temporary fake data for search results list
// TODO: delete when we get data from SPARQL DB
const data = [
  {
    name: "something",
    imageUrl:"https://upload.wikimedia.org/wikipedia/commons/f/f9/Phoenicopterus_ruber_in_S%C3%A3o_Paulo_Zoo.jpg"
  },
  {
    name: "something two",
    imageUrl:"https://www.gstatic.com/webp/gallery/1.jpg"
  },
  {
    name: "something three",
    imageUrl:"https://www.gstatic.com/webp/gallery3/2.png"
  },
  {
    name: "something four",
    imageUrl:"https://www.gstatic.com/webp/gallery3/1.png"
  },
  {
    name: "something five",
    imageUrl:"https://www.gstatic.com/webp/gallery3/1.png"
  },
  {
    name: "something six",
    imageUrl:"https://www.gstatic.com/webp/gallery3/1.png"
  },
]

// TODO: delete when we get sub categories from SPARQL DB
const subCategoryTemporaryData = [
    "subcategory 1",
    "subcategory 2",
    "subcategory 3",
    "subcategory 4",
]

// TODO: delete when we get sub categories from SPARQL DB
const subCategoryTemporaryData2 = [
    "hi",
    "hey",
    "hello",
    "greetings",
]

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props)
    this.state = {
      // data: data,
      options:[],
      subCategoryOptions: subCategoryTemporaryData,
      showSubCategory: false,
      clickedCategoryItem: ''
    }
  }

  // not sure if this is the best place to do this... change if needed
  componentDidMount = () => {

    // I'm not sure why tf it needs such an elaborate check, but it doesn't work without it
    if (typeof this.state.options === 'undefined' || this.state.options.length <= 0) {
      const config = {
        query: API.GET_ALL_TOP_LVL_PROPS // fetch the top level category names
        // this can have other properties as needed
      }
      API.query(config).then( resultsSet => {
        
        this.setState(prevState => { return {
          options: Array.from(resultsSet)
        }})
      }) // then
    } // if
  } // componentDidMount

  _onFlatListItemPress = (item) => {
    console.log("selected "+item)
    this.setState({clickedCategoryItem: item})
    this.setState({showSubCategory: true})

    // just for testing that when pressing category from Main FlatList, the sub FlatList will "live" reload 
    // TODO: delete when this is no longer needed
    switch(item) {
      case "tekninen kuva":
          this.setState({subCategoryOptions: subCategoryTemporaryData })
          break
      case "hallinto":
          this.setState({subCategoryOptions: subCategoryTemporaryData2 })
          break
      case "markkinointi":
        this.setState({subCategoryOptions: subCategoryTemporaryData })
        break
      case "splash":
          this.setState({subCategoryOptions: subCategoryTemporaryData2 })
          break
      default:
          this.setState({subCategoryOptions: subCategoryTemporaryData })
    }
  }

  render() {
    const { navigate } = this.props.navigation;
    console.log(this.state.options)

    return (
      <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start', marginTop: StatusBar.currentHeight+5 }}>

        <ScrollableFlatList
              props={this.state.options}
              onCategoryItemPress={this._onFlatListItemPress}
        /> 
        <View
          style={{
            borderBottomColor: 'grey',
            borderBottomWidth: 1,
            margin: 5
          }}
        />
        {/*Show the new sub category FlatList when clicking item from Main category FlatList*/}
        {(this.state.showSubCategory) && <ScrollableFlatList
              props={this.state.subCategoryOptions}
        />}
        {/*<CustomPicker
          options={options}
          onValueChange={value => {
            value 
          }}
        />*/}
        <FlatList 
          style={{marginTop:5}}
          vertical            
          data = {data}
          numColumns={ 2 }
          renderItem = {({ item: rowData }) => {

            return (
                <TouchableWithoutFeedback onPress={() => navigate('Details', { name: rowData.name, imageurl: rowData.imageUrl })}>
                  <View style={styles.box2} >
                    <ImageCardListItem name={rowData.name} imageUrl={rowData.imageUrl} />
                  </View>
                </TouchableWithoutFeedback>
            )
          }}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    )
  }

}

const styles = StyleSheet.create({
  column: {
    flex: 1,
    flexDirection: "column"
  },
  row: {
    flex: 1,
    flexDirection: "row"
  },
  box1: {
    flex: 1
  },
  box2: {
    flex: 2
  },
  button: {
    shadowColor: 'rgba(0,0,0, .4)', // IOS
    shadowOffset: { height: 1, width: 1 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS,
    borderRadius: 5,
    backgroundColor: '#fff',
    elevation: 2, // Android
    maxHeight: 54,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    padding: 5
  }
})