import React from 'react'
import { ScrollView, StyleSheet, View, Image } from 'react-native'
import { CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-cards'
import { Button, Card, Title, Paragraph } from 'react-native-paper';

export default class DetailsScreen extends React.Component {
  static navigationOptions = {
    title: 'Details',
  }

  constructor(props) {
    super(props)
    this.state={
      width: null,
      height: null
    }
  }

  componentWillMount() {
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

  render() {
      return (
      <ScrollView style={styles.container}>
        <Card style={styles.card}>
          <Card.Cover style={{height:this.state.height}} source={{uri: this.props.navigation.state.params.imageurl}} />
          <Card.Actions>
            <Button>Cancel</Button>
            <Button>Ok</Button>
          </Card.Actions>
          
          <Card.Content>
            <Title>Card title</Title>
            <Paragraph>Card content</Paragraph>
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
            </View>
          </View>
          </Card.Content>
        </Card>
      </ScrollView>
    )
  }
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
  image:{
    backgroundColor: '#fff',
    marginTop: 5
  }
})