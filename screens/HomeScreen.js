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
      topLevelProps: [],
      chosenImages: [], // urls
      subCategoryOptions: [],
      showSubCategory: false,
      clickedCategoryItem: '',
      selectedFiltersArray: [],
      startDate: '2010-04-28T05:13:00', // these need to be made dynamic (based on the slider)
      endDate: '2017-04-28T05:13:22',
      // IMPORTANT NOTE: it seems that all the images under our categories have the same timestamp; 
      // if I alter the end date to be before that time ('2017-04-28T05:13:21'), no images are returned.
      // unless the timestamps are updated to be more variable, our timeline feature is both useless
      // and almost impossible to test for proper functionality
      multiSliderValue: [1960, (new Date()).getFullYear()],
      showSlider: false,
      iconArrow: 'chevron-up'
    }
  }

  componentDidMount = () => {

    // I'm not sure why tf it needs such an elaborate check, but it doesn't work without it
    if (typeof this.state.topLevelProps === 'undefined' || this.state.topLevelProps.length <= 0) {

      API.getTopLevelImageProps().then( resultsSet => {
      
        this.setState({
          topLevelProps: Array.from(resultsSet)
        })
      })
    }
  } // componentDidMount

  _fetchImagesBasedOnProps = (queryType) => {

    // we need to do this so that the state is actually updated when we do this operation...
    // i'm not sure wtf the problem is because this should absolutely not be necessary.
    // we could investigate but a 10 ms delay is acceptable imo
    const self = this // needed due to the inherent funkiness of the setTimeOut function
    setTimeout(function() {
      
      const propsArray = self.state.selectedFiltersArray
      if (propsArray.length === 0) {

        self.setState({ 
          chosenImages: [] // remove the images if there are no chosen props
        })
        return
      }

      API.onChoosingPropsGetUrls(propsArray, queryType, self.state.startDate, self.state.endDate).then( resultsSet => {

        const arr = Array.from(resultsSet) // needs a check to see if it's a Set !
        // console.log("array length: " + arr.length)
        // arr.forEach(item => console.log("item: " + item))
        self.setState({
          chosenImages: arr
        })
       }) // then
    }, 10) // setTimeout
  } // _fetchImagesBasedOnProps

  // given to ScrollableFlatList as its onCategoryItemPress callback
  _onFlatListItemPress = (item) => {
    let containsFilter = false
    this.state.selectedFiltersArray.forEach((filter) => {
      if(filter == item) {
        containsFilter = true
      }
    })
    if(!containsFilter) {
      this.setState(prevState => ({
        selectedFiltersArray: [...prevState.selectedFiltersArray, item]
      }))
      this._fetchImagesBasedOnProps(API.QUERY_TYPE.AND)
    } // if

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
    
    this.setState({showSubCategory: true})
  } // _onFlatListItemPress

  _deleteSelectedFilter = (filter) => {
    this.state.selectedFiltersArray.forEach((item, index) => {
        if(item == filter) {
          // create new array without the filter that user is deleting and set it as the new state
          this.setState(prevState => ({ selectedFiltersArray: prevState.selectedFiltersArray.filter(item => item != filter) }))
          this._fetchImagesBasedOnProps(API.QUERY_TYPE.AND) // update the visible images based on the change
        }
    })
  } // _deleteSelectedFilter

  _multiSliderValuesChange = values => {
    this.setState({
      multiSliderValue: values,
    });
  };

  _closeOrOpenSubCategoryFlatList(){
    console.log("size "+this.state.subCategoryOptions.length+" s "+this.state.showSubCategory)
    if (this.state.subCategoryOptions.length>0) {
      var arrowDirection = (this.state.showSubCategory ? "chevron-down" : "chevron-up")
      this.setState(prevState => ({ 
        showSubCategory: !prevState.showSubCategory,
        iconArrow: arrowDirection
      }))
    }
  }

  render() {

    const { navigate } = this.props.navigation
    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80
    };

    // console.log(this.state.topLevelProps)
    // 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Phoenicopterus_ruber_in_S%C3%A3o_Paulo_Zoo.jpg'

    // console.log("props array in render: " + this.state.selectedFiltersArray)

    return (
      <SafeAreaView style={ styles.container }>
        <GestureRecognizer
          //onSwipeUp={(state) => this._onSwipeUp(state)}
          onSwipeUp={() => this._closeOrOpenSubCategoryFlatList()}
          config={config}
        >    
          {(this.state.selectedFiltersArray.length > 0) && 
            <SelectedFiltersFlatList
                  data = {this.state.selectedFiltersArray}
                  onDelete = {this._deleteSelectedFilter}
            />
          }
          <ScrollableFlatList
                onCategoryItemPress={this._onFlatListItemPress}
                data = {this.state.topLevelProps}
                // onClickProp = {this.onClickProp} // pass the callback... I hate React -.-
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
                onPress={() => { this.setState(prevState => ({ showSlider: !prevState.showSlider })) }}
              />
              <Text style={{alignSelf:'center'}}>Search by time</Text>
            </View>
            <View style={styles.closeSubCategoryBox}>
              {/*Show the arrow only if there is subcategory data
                TODO: The displaying of the arrow is not updating correctly if the flatlist is closed and then a new category is pressed from the list...
              */}
              {(this.state.subCategoryOptions.length>0) && 
                (<Icon
                  name={this.state.iconArrow}
                  type='entypo'
                  color='#517fa4'
                  onPress={()=>{ this._closeOrOpenSubCategoryFlatList() }}
                />
                )
              }
              {/*<Icon
                name='chevron-down'
                type='entypo'
                color='#517fa4'
                onPress={()=>{console.log("pressed down")}}
              />*/}
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
            const fullImageUrl = API.fulllImageDisplayUrl(rowData) // shown when opening the image details
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