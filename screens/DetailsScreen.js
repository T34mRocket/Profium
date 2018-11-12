import React from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-cards'

export default class DetailsScreen extends React.Component {
  static navigationOptions = {
    title: 'Details',
  }

  constructor(props) {
    super(props)
  }

  render() {
      return (
      <ScrollView style={styles.container}>
        <Card >
          <CardTitle
                subtitle={this.props.navigation.state.params.name}
                style={{ maxHeight: 50 }}
          />
          <CardImage 
            source={{uri: this.props.navigation.state.params.imageurl}}
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
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
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
})