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
  StatusBar,
  SafeAreaView
} from 'react-native'
import { WebBrowser } from 'expo'
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import { Icon } from 'react-native-elements'
import { Checkbox } from 'react-native-paper'

import { MonoText } from '../components/StyledText'
import { CustomPicker } from 'react-native-custom-picker'
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-cards'
import ScrollableFlatList from '../components/ScrollableFlatList'
import ImageCardListItem from '../components/ImageCardListItem'
import API, { QUERY_TYPE } from '../api/API'
import HierarchySeparatorLine from '../components/HierarchySeparatorLine';
import SelectedFiltersFlatList from '../components/SelectedFiltersFlatList';
import TimeLineSlider from '../components/TimeLineSlider';
import QueryData from '../dataclasses/QueryData';

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

// default dates for the timeline slider
const DEFAULT_START_DATE = 1960
const DEFAULT_END_DATE = (new Date()).getFullYear()

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props)
    this.state = {
      topLevelProps: [],
      chosenImages: [], // urls
      subCategoryOptions: [],
      showSubCategory: false,
      clickedCategoryItem: '',
      andArrays: [], // array of arrays of combined elements in one AND-type query (visually, a bunch of dragged together search terms)
      // IMPORTANT NOTE: it seems that all the images under our categories have the same timestamp; 
      // if I alter the end date to be before that time ('2017-04-28T05:13:21'), no images are returned.
      // unless the timestamps are updated to be more variable, our timeline feature is both useless
      // and almost impossible to test for proper functionality
      multiSliderValue: [DEFAULT_START_DATE, DEFAULT_END_DATE],
      showSlider: false,
      iconArrow: null
    }
  } // constructor

  componentDidMount = () => {

    // I'm not sure why tf it needs such an elaborate check, but it doesn't work without it
    if (typeof this.state.topLevelProps === undefined || this.state.topLevelProps.length <= 0) {

      // console.log("getting topLevelProps")
      API.getTopLevelImageProps().then( resultsSet => {
      
        // console.log("resultsSet: " + resultsSet)
        this.setState({
          topLevelProps: Array.from(resultsSet)
        })
      })
    }
  } // componentDidMount

  _fetchImagesBasedOnProps = () => {

    // we need to do this so that the state is actually updated when we do this operation...
    // i'm not sure wtf the problem is because this should absolutely not be necessary.
    // we could investigate but a 10 ms delay is acceptable imo
    const self = this // needed due to the inherent funkiness of the setTimeOut function
    setTimeout(function() {
      
      const queryArray = self.state.andArrays

      // console.log("subArray items: ")
      /* queryArray.forEach(andArray => {

        andArray.forEach(item => {
          console.log("item: " + item.toString())
        })
      }) */

      if (queryArray.length === 0) {

        self.setState({ 
          chosenImages: [] // remove the images if there are no chosen query terms
        })
        return
      }

      // plate of mom's spaghetti... -.- fix asap! especially once we can search by month!
      const searchByTime = self.state.showSlider
      let startDate = searchByTime ? self.state.multiSliderValue[0].toString() : DEFAULT_START_DATE.toString()
      startDate += '-01-01T00:00:00'
      let endDate = searchByTime ? self.state.multiSliderValue[1].toString() : DEFAULT_END_DATE.toString() 
      endDate += '-12-31T23:59:59'

      API.onChoosingPropsGetUrls(queryArray, startDate, endDate).then( resultsSet => {

        const arr = Array.from(resultsSet) // TODO: needs a check to see if it's a Set !
        // console.log("array length: " + arr.length)
        // arr.forEach(item => console.log("item: " + item))
        self.setState({
          chosenImages: arr
        })
       }) // then
    }, 10) // setTimeout
  } // _fetchImagesBasedOnProps

  // passed all the way down to individual SearchItem components
  _toggleNegativity = (term, subArrayIndex) => {

  // NOTE: there might be a less convoluted way to do this, but rn I can't think of it
  
    let subArray = this.state.andArrays[subArrayIndex].slice()
    subArray.map(queryData => {

      if (queryData.term === term) {
        queryData.isNegative = !queryData.isNegative
      }
    }) // map

    let tempAndArraysState = this.state.andArrays.slice() // copy the state... inefficient but whatever
    tempAndArraysState[subArrayIndex] = subArray
    this.setState({ andArrays: tempAndArraysState })

    this._fetchImagesBasedOnProps()
  } // _toggleNegativity

  // given to ScrollableFlatList as its onCategoryItemPress callback
  _onFlatListItemPress = (item) => {

    // changed things so that andArrays (formerly selectedFiltersArray) is an array of arrays;
    // the subarrays' contents represent AND-type queries, while the
    // subarrays themselves represent OR-type queries. a query's negativity
    // is a boolean on the actual stored Query object (within each subarray)
    let oneItemSubArrayContainsItem = false
    this.state.andArrays.forEach(andArray => {

      if (andArray.length === 1) {

        if(andArray[0].term === item) {
          oneItemSubArrayContainsItem = true
        }
      }
    })
    // you can't add more than one 'orphan' search term; e.g. 'dog' OR 'dog' OR 'dog'.
    // combining terms with other terms twice or more is fine though;
    // e.g. 'dog AND alive' OR 'dog AND red'
    if(oneItemSubArrayContainsItem) return

    this.setState(prevState => ({
      andArrays: [...prevState.andArrays, [new QueryData(item, false)]] // queries are positive by default
    }))
    this._fetchImagesBasedOnProps()
    
    // console.log("selected "+item)
    this.setState({clickedCategoryItem: item})

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
    
    this.setState({showSubCategory: true, iconArrow: 'chevron-up'})
  } // _onFlatListItemPress

  // passed all the way down to individual SearchItem components... non-ideal, 
  // but to force a re-render with each altering of HomeScreen state, it must be done
  _onDeleteSearchItem = (term, indexOfSubArray) => {

    // console.log("deleteFunc term + index: " + term + ", " + indexOfSubArray)
    const updatedSubArray = this.state.andArrays[indexOfSubArray].filter(queryItem => queryItem.term != term)
    // console.log("updatedSubArray length: " + updatedSubArray.length)

    if (updatedSubArray.length > 0) {
      
      let tempAndArraysState = this.state.andArrays.slice() // copy the state... inefficient but whatever
      tempAndArraysState[indexOfSubArray] = updatedSubArray
      this.setState({ andArrays: tempAndArraysState })
    } else {

      let tempAndArraysState2 = this.state.andArrays.slice()
      tempAndArraysState2.splice(indexOfSubArray, 1)  // remove the subArray

      this.setState({ andArrays: tempAndArraysState2 })
    }
    this._fetchImagesBasedOnProps()
  } // _onDeleteSearchItem

  _multiSliderValuesChange = values => {
    this.setState({
      multiSliderValue: values,
    })
    this._fetchImagesBasedOnProps()
  }

  _closeOrOpenSubCategoryFlatList(){
    // console.log("size "+this.state.subCategoryOptions.length+" s "+this.state.showSubCategory)
    if (this.state.subCategoryOptions.length>0) {
      var arrowDirection = (this.state.showSubCategory ? "chevron-down" : "chevron-up")
      this.setState(prevState => ({ 
        showSubCategory: !prevState.showSubCategory,
        iconArrow: arrowDirection
      }))
    }
  } // _closeOrOpenSubCategoryFlatList

  render() {

    // console.log("triggered HomeScreen render!")

    const { navigate } = this.props.navigation
    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80
    };

    // console.log(this.state.topLevelProps)
    // console.log("props array in render:")
    /* this.state.andArrays.forEach(array => {
      array.forEach(item => {

        console.log(item.toString())
      })
    }) */

    return (
      <SafeAreaView style={ styles.container }>
        <GestureRecognizer
          //onSwipeUp={(state) => this._onSwipeUp(state)}
          onSwipeUp={() => this._closeOrOpenSubCategoryFlatList()}
          config={config}
        >    
          {(this.state.andArrays.length > 0) && 
            <SelectedFiltersFlatList
                  data = {this.state.andArrays}
                  onDelete = {this._onDeleteSearchItem}
                  toggleNegativity = {this._toggleNegativity}
            />
          }
          <ScrollableFlatList
                onCategoryItemPress={this._onFlatListItemPress}
                data = {this.state.topLevelProps}
          />
          {/*Show the new sub category FlatList when clicking item from Main category FlatList*/}
          {(this.state.showSubCategory) && 
            (<ScrollableFlatList
                      onCategoryItemPress={this._onFlatListItemPress}
                      data = {this.state.subCategoryOptions}/>
            )
          }
          <View style={styles.timeCheckboxAndCloseSubCategory}>
            <View style={styles.timeBox}>
              <Checkbox
                status={this.state.showSlider ? 'checked' : 'unchecked'}
                onPress={() => { this.setState(prevState => ({ showSlider: !prevState.showSlider })); this._fetchImagesBasedOnProps() }}
              />
              <Text style={{alignSelf:'center'}}>Search by time</Text>
            </View>
            <View style={styles.closeSubCategoryBox}>
              {/*Show the arrow only if there is subcategory data*/}
              {((this.state.subCategoryOptions && this.state.iconArrow)) && 
                (<Icon
                  name={this.state.iconArrow}
                  type='entypo'
                  color='#517fa4'
                  onPress={()=>{ this._closeOrOpenSubCategoryFlatList() }}
                />
                )
              }
            </View>
            {/*Empty view so that the arrow icon is in center of screen*/}
            <View style={{flex:1}}>
            </View>
          </View>
        </GestureRecognizer>
        {(this.state.showSlider) && 
          <TimeLineSlider selectedStartYear={this.state.multiSliderValue[0]} selectedEndYear={this.state.multiSliderValue[1]} multiSliderValuesChange={this._multiSliderValuesChange} />
        }
        <FlatList 
          style = {{marginTop:5}}
          vertical            
          removeClippedSubviews
          disableVirtualization
          data = {this.state.chosenImages || []}
          numColumns = { 2 }
          renderItem = {({ item: rowData }) => {

            const smallImageUrl = API.smallImageDisplayUrl(rowData)
            const fullImageUrl = API.fullImageDisplayUrl(rowData) // shown when opening the image details
            // console.log("rowData: " + rowData)
            return (
                <TouchableWithoutFeedback onPress={() => navigate('Details', { name: "", imageurl: fullImageUrl })}>
                  <View style={styles.box2} >
                    <ImageCardListItem name="" imageUrl={smallImageUrl}/>
                  </View>
                </TouchableWithoutFeedback>
            )
          }}
          keyExtractor={(item, index) => index.toString()}
        />
        </SafeAreaView>
    ) // return
  } // render
} // class

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    flexDirection: 'column', 
    justifyContent: 'flex-start', 
    marginTop: StatusBar.currentHeight+5 
  },
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
  }, 
  timeCheckboxAndCloseSubCategory: {
    flexDirection: 'row', 
    justifyContent:'center', 
    marginLeft: 5, 
    marginRight: 5
  },
  timeBox: {
    flex:1, 
    flexDirection: 'row'
  },
  closeSubCategoryBox: {
    flex:1, 
    flexDirection: 'row', 
    alignSelf:'center', 
    justifyContent:'center'
  }
}) // styles