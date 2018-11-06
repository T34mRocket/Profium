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


export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props)
    this.state = { options: [] }
  }

  // not sure if this is the best place to do this... change if needed
  componentDidMount = () => {

    const config = {
      query: API.GET_ALL_IMAGE_VIEWS // fetch the top level category names
      // this can have other properties as needed
    }
    API.query(config).then( results =>
      
      this.setState(prevState => { return {
        options: results
      }})
      // console.log(results)
    )
  }

  render() {
    const options = this.state.options
    return (
      <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-around' }}>
        <CustomPicker
          options={options}
          onValueChange={value => {
            value 
          }}
        />
      </View>
    )
  }

}