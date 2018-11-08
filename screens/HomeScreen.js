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

    // I'm not sure why tf it needs such an elaborate check, but it doesn't work without it
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
    } // if
  } // componentDidMount

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