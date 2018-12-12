import React from 'react'
import { ScrollView, StyleSheet, View, Image, BackHandler } from 'react-native'
import { CardTitle, CardContent } from 'react-native-cards'
import { Button, Card } from 'react-native-paper'
import { HeaderBackButton } from 'react-navigation'
import SelectedFiltersFlatList from '../components/SelectedFiltersFlatList'
import API from '../api/API'

/**
 * Component for the detail view that opens when you click on an image in
 * the main view.
 * @author Timi Liljeström, Ville Lohkovuori
 */

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
  }) // navigationOptions

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

  toggleNegativity = (term, subArrayIndex) => {

    this.props.navigation.state.params.toggleNegativity(term, subArrayIndex, this)
    this._setHomeScreenState()
  }

  onDeleteSearchItem = (term, indexOfSubArray) => {

    this.props.navigation.state.params.onDeleteSearchItem(term, indexOfSubArray, this)
    this._setHomeScreenState()
  }

  onFilterDrag = (from, to, andArray) => {

    this.props.navigation.state.params.onFilterDrag(from, to, andArray, this)
    this._setHomeScreenState()
  }

  _onTagPress = (item) => {

    this.props.navigation.state.params.onTagPress(item, this)
    this._setHomeScreenState()
  }

  componentWillMount() {

    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick)
    // resize image based on the passed parameters (width or height)
    Image.getSize(this.props.navigation.state.params.imageurl, (width, height) => {
      if (this.props.navigation.state.params.width && !this.props.navigation.state.params.height) {
        this.setState({
          width: this.props.navigation.state.params.width,
          height: height * (this.props.navigation.state.params.width / width)
        })
      } else if (!this.props.navigation.state.params.width && this.props.navigation.state.params.height) {
        this.setState({
          width: width * (this.props.navigation.state.params.height / height),
          height: this.props.navigation.state.params.height
        })
      } else {
        this.setState({ width: width, height: height })
      }
    })
  } // componentWillMount

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentDidMount() {
    this.props.navigation.setParams({
      onBackPress: this.handleBackButtonClick
    })
  }

  // there's no need to set HomeScreen's state on back press anymore, as it's done with each change of DetailsScreen's state
  handleBackButtonClick() {

    this.props.navigation.goBack(null)
    return true;
  }

  _setHomeScreenState() {

    const self = this
    setTimeout(function() {

      self.props.navigation.state.params.setHomescreenState(self.state)
    }, 50)
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
                onDelete = {this.onDeleteSearchItem}
                toggleNegativity = {this.toggleNegativity}
                onFilterDrag = {this.onFilterDrag}
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
  )} // render
} // DetailsScreen

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
}) // styles