import React from 'react';
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
} from 'react-native';
import { WebBrowser } from 'expo';

import { MonoText } from '../components/StyledText';
import { CustomPicker } from 'react-native-custom-picker'


export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    const options = ['One', 'Two', 'Three', 'Four', 'Five']
    return (
      <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'left' }}>
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