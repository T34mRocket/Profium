import React from 'react'
import {
  Picker,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
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


export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props)
    this.state = {
      // data: data,
      options:[]
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

  render() {

    console.log(this.state.options)

    return (
      <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start', marginTop: StatusBar.currentHeight }}>

        <ScrollableFlatList
              props={this.state.options}
        /> 
        <View
          style={{
            borderBottomColor: 'grey',
            borderBottomWidth: 1,
            margin: 5
          }}
        />
        <ScrollableFlatList
              props={this.state.options}
        />
        {/*<CustomPicker
          options={options}
          onValueChange={value => {
            value 
          }}
        />*/}
        <FlatList 
          vertical            
          data = {data}
          numColumns={ 2 }
          renderItem = {({ item: rowData }) => {

            return (
                <View style={styles.box2} >
                  <ImageCardListItem name={rowData.name} imageUrl={rowData.imageUrl}  onPress={() => console.log("pressed "+rowData.name)}/>
                </View>
            )
          }}
          keyExtractor={(item, index) => index.toString()}
        />

        {/*
        Save this for later use if we use it when viewing the selected image/item data
        <Card >
          <CardTitle
                subtitle="Image"
                style={{ maxHeight: 50 }}
          />
          <CardImage 
            source={{uri: `https://upload.wikimedia.org/wikipedia/commons/f/f9/Phoenicopterus_ruber_in_S%C3%A3o_Paulo_Zoo.jpg`}}
          />
          <View style={styles.row}>
            <View style={styles.box1}>
              <CardTitle
                subtitle="Data"
              />
              <CardContent text={`Name`} />
              <CardContent text={`Description`} />
              <CardContent text={`Taken`} />
            </View>
            <View style={styles.box2} >
              <CardTitle
                  subtitle={`More data`}
              />
              <CardContent text={`something`} />
              <CardContent text={`something`} />
              <CardContent text={`something`} />
              <CardAction 
                separator={true}
                inColumn={true}>
              </CardAction>
            </View>
          </View>
        </Card>*/}
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