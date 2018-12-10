import React from 'react'
import { ScrollView, StyleSheet, View, Image, BackHandler, TouchableOpacity, Text } from 'react-native'
import { CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-cards'
import { Button, Card, Title, Paragraph } from 'react-native-paper'
import { HeaderBackButton } from 'react-navigation'
import { Icon, colors } from 'react-native-elements'
import SelectedFiltersFlatList from '../components/SelectedFiltersFlatList'
import API from '../api/API'
import HomeScreen from './HomeScreen'
import QueryData from '../dataclasses/QueryData'

export default class DetailsScreen extends React.Component {

  static navigationOptions = ({navigation}) => ({
    
      title: 'Details',
      headerLeft: ( <HeaderBackButton tintColor={'white'} onPress={ () => { 
        navigation.state.params.onBackPress()
      } }  /> ),
      headerStyle: {
        backgroundColor: '#517fa4',
      },
      headerTintColor: 'white',
  })

  constructor(props) {
    super(props)

    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

    this.state = this.props.navigation.state.params.state

    this._obtainImageDetails()
  }

  _obtainImageDetails = () => {

    API.getImageDetails(this.props.navigation.state.params.rawImageUrl).then(imageDetails => {  

      this.setState({ timeStamp: imageDetails.timeStamp, tags: imageDetails.tags })
    })
  }

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

  } // _toggleNegativity

  _onDeleteSearchItem = (term, indexOfSubArray) => {

    const updatedSubArray = this.state.andArrays[indexOfSubArray].filter(queryItem => queryItem.term != term)

    if (updatedSubArray.length > 0) {
      
      let tempAndArraysState = this.state.andArrays.slice() // copy the state... inefficient but whatever
      tempAndArraysState[indexOfSubArray] = updatedSubArray
      this.setState({ andArrays: tempAndArraysState })
    } else {

      let tempAndArraysState2 = this.state.andArrays.slice()
      tempAndArraysState2.splice(indexOfSubArray, 1)  // remove the subArray

      this.setState({ andArrays: tempAndArraysState2 })
    }

  } // _onDeleteSearchItem

  // called when dropping a visual search item on another in the top pen
  _onFilterDrag = (from, to, andArray) => {

    if (from === to) return

    let tempAndArraysState = this.state.andArrays.slice()
    tempAndArraysState[to] = andArray
    tempAndArraysState.splice(from, 1)
    this.setState({ andArrays: tempAndArraysState })

  } // _onFilterDrag

  _onTagPress = (item) => {

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
    if(oneItemSubArrayContainsItem || this.state.andArrays.length > HomeScreen.MAX_QUERIES) return

    this.setState(prevState => ({
      andArrays: [[new QueryData(item, false)], ...prevState.andArrays] // queries are positive by default
    }))

  } // _onTagPress

  componentWillMount() {
      BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
      // resize image based on the passed parameters (width or height)
      Image.getSize(this.props.navigation.state.params.imageurl, (width, height) => {
          if (this.props.navigation.state.params.width && !this.props.navigation.state.params.height) {
              this.setState({
                  width: this.props.navigation.state.params.width,
                  height: height * (this.props.navigation.state.params.width / width)
              });
          } else if (!this.props.navigation.state.params.width && this.props.navigation.state.params.height) {
              this.setState({
                  width: width * (this.props.navigation.state.params.height / height),
                  height: this.props.navigation.state.params.height
              });
          } else {
              this.setState({ width: width, height: height });
          }
      });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentDidMount() {
    this.props.navigation.setParams({
      onBackPress: this.handleBackButtonClick
    })
  }

  // when navigating back, set home screen state as the same as details screen's current state ->
  // this is because we don't have time to implement state management (MobX or Redux)  
  // at this point anymore
  handleBackButtonClick() {
    this.props.navigation.state.params.setHomescreenState(this.state)
    this.props.navigation.goBack(null);
    
    return true;
  }

  render() {

    const tags  = this.state.tags.map(tag => {

      return <Card.Actions style={{margin:0, padding: 0, paddingLeft:8, alignSelf:'flex-start'}} key={tag}>
                <Button onPress={() => {this._onTagPress(tag)}}>{tag}</Button>
             </Card.Actions>
    })

    const descriptions = this.state.tags.map(tag => {
      
      return <CardContent text='Tag: ' key={tag} />
    })

    return (
    <View style={{flex:1}}>
      <SelectedFiltersFlatList
              data = {this.state.andArrays}
              onDelete = {this._onDeleteSearchItem}
              toggleNegativity = {this._toggleNegativity}
              onFilterDrag = {this._onFilterDrag}
      />
      <ScrollView style={styles.container}>
        <Card style={styles.card}>
          <Card.Cover style={{height:this.state.height}} source={{uri: this.props.navigation.state.params.imageurl}} />
          <Card.Content>
            <View style={styles.row}>
            <View style={styles.box1}>
              <CardTitle
                subtitle="Property"
              />
              <CardContent text={`Taken:`} />
              {descriptions}
            </View>
            <View style={styles.box2} >
              <CardTitle
                  subtitle={`Value`}
              />
              <CardContent text={this.state.timeStamp} />
              {tags}
            </View>
          </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  )}
}

const styles = StyleSheet.create({
  card: {
    margin:5
  },
  container: {
    flex: 1,
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
  image:{
    backgroundColor: '#fff',
    marginTop: 5
  }
})