import React from 'react'
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  FlatList,
  StatusBar,
  SafeAreaView,
  Dimensions
} from 'react-native'
import { Icon, SearchBar } from 'react-native-elements'
import { Checkbox } from 'react-native-paper'
import { Button, Card } from 'react-native-paper'
import ScrollableFlatList from '../components/ScrollableFlatList'
import ImageCardListItem from '../components/ImageCardListItem'
import API from '../api/API'
import SelectedFiltersFlatList from '../components/SelectedFiltersFlatList'
import TimeLineSlider from '../components/TimeLineSlider'
import QueryData from '../dataclasses/QueryData'
import InformationComponent from '../components/InformationComponent'

/**
 * The 'main' file of the app that keeps track of the overall app state
 * and presents the main ui view.
 * @author Ville Lohkovuori, Timi Liljeström
 */

// placeholder data (since we have no actual subcategories)
const subCategoryTemporaryData = [
    "subcategory 1",
    "subcategory 2",
    "subcategory 3",
    "subcategory 4",
]

// placeholder data (since we have no actual subcategories)
const subCategoryTemporaryData2 = [
    "hi",
    "hey",
    "hello",
    "greetings",
]

// default dates for the timeline slider
const DEFAULT_START_DATE = 1960
const DEFAULT_END_DATE = (new Date()).getFullYear()

// max numbers of search terms that can be present in the top pen
const MAX_OR_QUERIES = 4
const MAX_AND_QUERIES = 3

export default class HomeScreen extends React.Component {

  static navigationOptions = ({ navigation }) => ({
    header: ( /* Custom header */
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: '#517fa4',
          height: 80,
          elevation: 10,
          paddingTop: StatusBar.currentHeight,
          overflow:'hidden' 
        }}
      >
        <Image
            style={{height:50, width:50, marginLeft:5}}
            resizeMode={'contain'}
            source={require('../assets/images/logoSRCH2.png')}
        />
        <Image
            style={{height:50, width:70, marginLeft:5, alignSelf: 'center'}}
            resizeMode={'contain'}
            source={require('../assets/images/logoSRCH3.png')}
        />
        <SearchBar
          round
          lightTheme
          autoCapitalize = 'none'
          maxLength={30}
          clearIcon={{ color: 'black' }}
          containerStyle={{backgroundColor: '#517fa4', flex:1, alignSelf: 'center', borderTopColor:'#517fa4', borderBottomColor:'#517fa4'}}
          inputStyle={{backgroundColor: 'white'}}
          placeholder='Search'
          // called when enter/return is tapped on keyboard 
          onSubmitEditing={(event) => {navigation.state.params.addTypedQuery(event.nativeEvent.text)}} />
      </View>
    ) // header
  }) // navigationOptions

  constructor(props) {
    super(props)

    this.state = {
      topLevelProps: [],
      chosenImages: [], // urls
      subCategoryOptions: [],
      showSubCategory: false,
      clickedCategoryItem: '',

      andArrays: [], // array of arrays of combined elements in one AND-type query (visually, a bunch of dragged together search terms)

      multiSliderValue: [DEFAULT_START_DATE, DEFAULT_END_DATE],
      showSlider: false,
      iconArrow: null,
      screenWidth: Dimensions.get('window').width,
      showInformation: false,
      width: null,
      height: null,
      timeStamp: '',
      tags: [],
    }
  } // constructor

  componentDidMount = () => {

    // we need to pass this method to the SearchBar in the static navigationOptions
    this.props.navigation.setParams({
      addTypedQuery: this._addTypedQuery
    })

    // I'm not sure why it needs such an elaborate check, but it doesn't work without it
    if (typeof this.state.topLevelProps === undefined || this.state.topLevelProps.length <= 0) {

      API.getTopLevelImageProps().then( resultsArray => {
      
        this.setState({
          topLevelProps: resultsArray
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

      if (queryArray.length === 0) {

        self.setState({ 
          chosenImages: [] // remove the images if there are no chosen query terms
        })
        return
      }

      // plate of mom's spaghetti... since we have no month-based searching, this works for now though
      const searchByTime = self.state.showSlider
      let startDate = searchByTime ? self.state.multiSliderValue[0].toString() : DEFAULT_START_DATE.toString()
      startDate += '-01-01T00:00:00'
      let endDate = searchByTime ? self.state.multiSliderValue[1].toString() : DEFAULT_END_DATE.toString() 
      endDate += '-12-31T23:59:59'

      API.onChoosingPropsGetUrls(queryArray, startDate, endDate).then( resultsArray => {

        const extension = /\.(gif|jpg|jpeg|tiff|png)$/i // we need to filter out the one .docx that's returned for some reason
        const filteredArray = resultsArray.filter(url => extension.test(url))

        self.setState({
          chosenImages: filteredArray
        })
       })
    }, 10) // setTimeout
  } // _fetchImagesBasedOnProps

  // called when hitting 'enter' after typing in the search bar
  _addTypedQuery = (typedString) => {

    // it makes sense to make the query strings case-agnostic, as the user doesn't know the casing 
    // when typing. right now, all the top categories are fetched by default, so the search is 
    // pretty useless, but it works and would be useable with more varied data
    typedString = typedString.toLowerCase() 

    this.addOrTypeSearchItem(typedString, this)
    this._fetchImagesBasedOnProps()
  } // _addTypedQuery

  // passed all the way down to individual SearchItem components
  _toggleNegativity = (term, subArrayIndex) => {

    // NOTE: there might be a less convoluted way to do this, but rn I can't think of it
    let subArray = this.state.andArrays[subArrayIndex].slice()

    subArray.map(queryData => {
        if (queryData.term === term) {
        queryData.isNegative = !queryData.isNegative
        return queryData
      }
    })
    
    let tempAndArraysState = this.state.andArrays.slice() // copy the state... inefficient but whatever
    tempAndArraysState[subArrayIndex] = subArray
    this.setState({ andArrays: tempAndArraysState })
    
    this._fetchImagesBasedOnProps()
  } // _toggleNegativity

  _toggleInformation = () => {
    this.setState(prevState=>({ showInformation: !prevState.showInformation}))
  }

  // given to ScrollableFlatList as its onCategoryItemPress callback
  _onFlatListItemPress = (item) => {

    this.addOrTypeSearchItem(item, this)
    this._fetchImagesBasedOnProps()
    
    this.setState({clickedCategoryItem: item})

    // just for testing that when pressing category from Main FlatList, the sub FlatList will "live" reload 
    // TODO: delete when this is no longer needed and there are subcategories in the database
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

  // helper method to reduce code duplication.
  // used in _onFlatListItemPress, _addTypedQuery, and in DetailsScreen's _onTagPress.
  // NOTE: we need the 'this' reference due to some hacky ui update stuffs in DetailsScreen
  addOrTypeSearchItem = (item, self) => {

    let oneItemSubArrayContainsItem = false
    self.state.andArrays.forEach(andArray => {

      if (andArray.length === 1) {

        if(andArray[0].term === item) {
          oneItemSubArrayContainsItem = true
        }
      }
    })
    // you can't add more than one 'orphan' search term; e.g. 'dog' OR 'dog' OR 'dog'.
    // combining terms with other terms twice or more is fine though;
    // e.g. 'dog AND alive' OR 'dog AND red'
    if(oneItemSubArrayContainsItem || self.state.andArrays.length >= MAX_OR_QUERIES) return

    self.setState(prevState => ({
      andArrays: [[new QueryData(item, false)], ...prevState.andArrays] // queries are positive by default
    }))
  } // addOrTypeSearchItem

  // passed all the way down to individual SearchItem components... non-ideal, 
  // but to force a re-render with each altering of HomeScreen state, it must be done
  _onDeleteSearchItem = (term, indexOfSubArray) => {

    const updatedSubArray = this.state.andArrays[indexOfSubArray].filter(queryItem => queryItem.term != term)

    if (updatedSubArray.length > 0) {
      
      let tempAndArraysState = this.state.andArrays.slice()
      tempAndArraysState[indexOfSubArray] = updatedSubArray
      this.setState({ andArrays: tempAndArraysState })
    } else {

      let tempAndArraysState2 = this.state.andArrays.slice()
      tempAndArraysState2.splice(indexOfSubArray, 1)  // remove the subArray

      this.setState({ andArrays: tempAndArraysState2 })
    }
    this._fetchImagesBasedOnProps()
  } // _onDeleteSearchItem

  // called when dropping a visual search item on another in the top pen
  _onFilterDrag = (from, to, andArray) => {

    if (from === to) return

    // the ui can only comfortably fit a limited number of AND-type queries
    if (andArray.length > MAX_AND_QUERIES) return

    let tempAndArraysState = this.state.andArrays.slice()
    tempAndArraysState[to] = andArray
    tempAndArraysState.splice(from, 1)
    this.setState({ andArrays: tempAndArraysState })

    this._fetchImagesBasedOnProps()
  } // _onFilterDrag

  _multiSliderValuesChange = values => {
    this.setState({
      multiSliderValue: values,
    })
    this._fetchImagesBasedOnProps()
  }

  _closeOrOpenSubCategoryFlatList() {

    if (this.state.subCategoryOptions.length>0) {
      var arrowDirection = (this.state.showSubCategory ? "chevron-down" : "chevron-up")
      this.setState(prevState => ({ 
        showSubCategory: !prevState.showSubCategory,
        iconArrow: arrowDirection
      }))
    }
  } // _closeOrOpenSubCategoryFlatList

  // this is called from details screen
  _setHomeScreenState = (state) => {
    this.setState(state)
    this._fetchImagesBasedOnProps()
  }

  render() {

    const { navigate } = this.props.navigation
    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80
    }

    return (
      <SafeAreaView style={ styles.container }>
        {(this.state.andArrays.length > 0) && 
          <SelectedFiltersFlatList
                data = {this.state.andArrays}
                onDelete = {this._onDeleteSearchItem}
                toggleNegativity = {this._toggleNegativity}
                onFilterDrag = {this._onFilterDrag}
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
        {(this.state.andArrays.length > 0) && (
          <View style={styles.timeCheckboxAndCloseSubCategory}>
            <View style={styles.timeBox}>
              <Checkbox
                color={'#517fa4'}
                status={this.state.showSlider ? 'checked' : 'unchecked'}
                onPress={() => { this.setState(prevState => ({ showSlider: !prevState.showSlider })); this._fetchImagesBasedOnProps() }}
              />
              <Text style={{marginTop: 5, paddingTop:3}}>Search by time</Text>
            </View>
            <View style={styles.closeSubCategoryBox}>
              {/*Show the arrow only if there is subcategory data*/}
              {((this.state.subCategoryOptions && this.state.iconArrow)) && 
                (<Icon
                  containerStyle={{marginTop:5, marginBottom:5}}
                  raised
                  reverse
                  underlayColor={'transparent'}
                  size={14}
                  name={this.state.iconArrow}
                  type='entypo'
                  color='#517fa4'
                  onPress={()=>{ this._closeOrOpenSubCategoryFlatList() }}
                />
                )
              }
            </View>
            {/*Empty view so that the arrow icon is in center of screen*/}
            <View style={styles.resultsBox}>
              <Text style={{fontSize:18}}>Results: {this.state.chosenImages.length}</Text>
            </View>
          </View>
        )}
        {(this.state.showSlider && this.state.andArrays.length > 0) && 
          <TimeLineSlider selectedStartYear={this.state.multiSliderValue[0]} selectedEndYear={this.state.multiSliderValue[1]} multiSliderValuesChange={this._multiSliderValuesChange} />
        }
        {(this.state.andArrays.length > 0 && this.state.chosenImages.length > 0) && (
          <FlatList 
            style = { styles.imagesFlatList }
            vertical            
            removeClippedSubviews
            disableVirtualization
            data = {this.state.chosenImages || []}
            numColumns = { 3 }
            renderItem = {({ item: rowData }) => {

              const fullImageUrl = API.fullImageDisplayUrl(rowData) // shown when opening the image details
              return (
                  <TouchableWithoutFeedback onPress={() => navigate('Details', { 
                    width: this.state.screenWidth, 
                    imageurl: fullImageUrl,
                    rawImageUrl: rowData,
                    state: this.state,
                    onTagPress: this.addOrTypeSearchItem,
                    setHomescreenState: this._setHomeScreenState
                  })}>
                    <View style={styles.box2} >
                      {/* fullImageDisplayUrl passed also here, because it looks a lot better than smallImageDisplayUrl */}
                      <ImageCardListItem imageUrl={fullImageUrl}/>
                    </View>
                  </TouchableWithoutFeedback>
              )
            }}
            keyExtractor={(item, index) => index.toString()}
          />
        )}
        
        <View style={{flex:1}}>
          {(this.state.andArrays.length === 0) && (
          <ScrollView style={{flex: 1}}>
            <Card style={{marginTop:0, marginLeft: 5, marginRight: 5, marginBottom: 5}}>
              <Card.Actions>
                <Button onPress={this._toggleInformation}>{(this.state.showInformation)? 'Hide' : 'How to use?'}</Button>
              </Card.Actions>
              {(this.state.showInformation) && (
                <InformationComponent toggleInformation={this._toggleInformation} MAX_AND_QUERIES={MAX_AND_QUERIES} MAX_OR_QUERIES={MAX_OR_QUERIES}/>
              )}
            </Card>
          </ScrollView>
          )}
        </View>
      </SafeAreaView>
    ) // return
  } // render
} // HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    flexDirection: 'column', 
    justifyContent: 'flex-start', 
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
    flex: 1,
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
    marginRight: 5,
    backgroundColor: 'white', 
    elevation: 10, 
    borderTopRightRadius: 5, 
    borderTopLeftRadius: 5,
  },
  timeBox: {
    flex:1, 
    flexDirection: 'row',
    paddingTop: 5,
  },
  closeSubCategoryBox: {
    flex:1, 
    flexDirection: 'row', 
    alignSelf:'center', 
    justifyContent:'center',
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5
  },
  resultsBox: {
    flex:1, 
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    backgroundColor: 'white',
    alignSelf: 'center',
    justifyContent: 'flex-end',
  },
  imagesFlatList: {
    backgroundColor: 'white', 
    elevation: 10, 
    borderBottomRightRadius: 5, 
    borderBottomLeftRadius: 5, 
    paddingTop: 2.5, 
    marginRight: 5, 
    marginLeft: 5
  }
}) // styles