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
} from 'react-native'
import { WebBrowser } from 'expo'

import { MonoText } from '../components/StyledText'
import { CustomPicker } from 'react-native-custom-picker'
import API from '../api/API'

<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props)
<<<<<<< Updated upstream
    this.state = { options: [] }
=======
    this.state = {
      topLevelProps: [],
      chosenImages: [] // urls
    }
    this.onClickProp = this.onClickProp.bind(this)
>>>>>>> Stashed changes
  }

  componentDidMount = () => {

    // I'm not sure why tf it needs such an elaborate check, but it doesn't work without it
<<<<<<< Updated upstream
    if (typeof this.state.options === 'undefined' || this.state.options.length <= 0) {
      const config = {
        query: API.GET_ALL_TOP_LVL_PROPS // fetch the top level category names
        // this can have other properties as needed
      }
      API.query(config).then( resultsSet =>
        
        this.setState(prevState => { return {
          options: Array.from(resultsSet)
        }})
        // console.log(results)
      ) // then
=======
    if (typeof this.state.topLevelProps === 'undefined' || this.state.topLevelProps.length <= 0) {

      API.getTopLevelImageProps().then( resultsSet => {
      
        this.setState({
          topLevelProps: Array.from(resultsSet)
        })
      }) // then
>>>>>>> Stashed changes
    } // if
  } // componentDidMount

  // passed as a callback to ScrollableFlatList
  onClickProp = (chosenProp) => {

    API.onChoosingPropGetUrls(chosenProp).then( resultsSet => {

      const arr = Array.from(resultsSet)
      console.log("array length: " + arr.length)
      arr.forEach(item => console.log("item: " + item))
      this.setState({
        chosenImages: arr
      })
      console.log("this.state.chosenImages: " + this.state.chosenImages)
     }) // then
  }

  render() {
<<<<<<< Updated upstream
    const options = this.state.options
    return (
      <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-around' }}>
        <CustomPicker
=======

    // console.log(this.state.topLevelProps)
    // 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Phoenicopterus_ruber_in_S%C3%A3o_Paulo_Zoo.jpg'

    return (
      <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start', marginTop: 25 }}>

        <ScrollableFlatList
              topLevelProps = {this.state.topLevelProps}
              onClickProp = {this.onClickProp} // pass the callback... I hate React -.-
        />
        <View
          style = {{
            margin: 0,
            borderBottomColor: 'grey',
            borderBottomWidth: 1,
          }}
        />
        {/*<CustomPicker
>>>>>>> Stashed changes
          options={options}
          onValueChange={value => {
            value 
          }}
<<<<<<< Updated upstream
        />
=======
        />*/}
        <View style = {styles.column}>
        
          <View style={styles.row}>
              <View style = {styles.box1}>
                <ImageCardListItem name = {'Image'} imageUrl = {API.displayUrl(this.state.chosenImages[0])}/>
              </View>
              <View style = {styles.box1} >
                <ImageCardListItem name = {'Image'} imageUrl = {'https://m1.profium.com/displayContent.do?uri=http://www.profium.com/contract-archive//images/primary/20181023/15403037952990.JPG&type=largeThumb'}/>
              </View>
          </View>
          <View style = {styles.row}>
              <View style = {styles.box1}>
                <ImageCardListItem name = {'Image'} imageUrl = {'https://www.gstatic.com/webp/gallery3/2.png'}/>
              </View>
              <View style = {styles.box1} >
                <ImageCardListItem name = {'Image'} imageUrl = {'https://www.gstatic.com/webp/gallery3/1.png'}/>
              </View>
          </View>
      
        </View>
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
>>>>>>> Stashed changes
      </View>
    )
  }

}