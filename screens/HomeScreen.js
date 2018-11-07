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
  FlatList,
  Button
} from 'react-native';
import { WebBrowser } from 'expo';

import { MonoText } from '../components/StyledText';
import { CustomPicker } from 'react-native-custom-picker'
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-cards';

const data = [
  {
    title: "something"
  },
  {
    title: "something two"
  },
  {
    title: "something three"
  },
  {
    title: "something four"
  },
  {
    title: "something five"
  },
  {
    title: "something six"
  }
];

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      data: data
    };
  }

  render() {
    const options = ['One', 'Two', 'Three', 'Four', 'Five']
    return (
      <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start' }}>
        <FlatList 
          style={{maxHeight:60, marginTop:25}}
          horizontal
          data={this.state.data}
          renderItem={({ item: rowData }) => {
            return (
              <TouchableOpacity
                style={styles.button}
                onPress={console.log("clicked "+rowData.title)}
              >
                <Text> {rowData.title} </Text>
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item, index) => index.toString()}
        />
        <CustomPicker
          options={options}
          onValueChange={value => {
            value 
          }}
        />
      
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
        </Card>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: "row"
  },
  box1: {
    flex: 1,
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
  }
});