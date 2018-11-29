import React from 'react'
import { ScrollView, StyleSheet, View, PanResponder, Animated, Text } from 'react-native'
import { ExpoLinksView } from '@expo/samples'

export default class HistoryScreen extends React.Component {
  static navigationOptions = {
    title: 'Links',
  }
  
  constructor(props) {
    super(props)
    this.state = {
      showDraggable: true,
      dropAreaValues: null,
      pan: new Animated.ValueXY(),
      opacity: new Animated.Value(1)
    }
  }

  componentWillMount() {
    // Add a listener for the delta value change
    this._val = { x:0, y:0 }
    this.state.pan.addListener((value) => this._val = value);
    // Initialize PanResponder with move handling
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (e, gesture) => true,
      onPanResponderMove: Animated.event([
        null, { dx: this.state.pan.x, dy: this.state.pan.y }
      ]),
      onPanResponderRelease: (e, gesture) => {
        if (this.isDropArea(gesture)) {
          Animated.timing(this.state.opacity, {
          toValue: 0,
          duration: 1000
        }).start(() =>
          this.setState({
             showDraggable: false
          })
        );
      } else {
          Animated.spring(this.state.pan, {
            toValue: { x: 0, y: 0 },
            friction: 5
          }).start();
        }
      }
    })
    
      // adjusting delta value
      this.state.pan.setValue({ x:0, y:0})
  }

  isDropArea(gesture) {
    return gesture.moveY < 200;
  }

  render() {

    const panStyle = {
      transform: this.state.pan.getTranslateTransform()
    }

    return (
      <ScrollView style={styles.container}>
        {/* Go ahead and delete ExpoLinksView and replace it with your
           * content, we just wanted to provide you with some helpful links */}
        <View style={styles.dropZone}>
          <Text style={styles.text}>Drop them here!</Text>
        </View>
        
        <View style={styles.ballContainer} />
        <View style={styles.row}>
        <Animated.View
        {...this.panResponder.panHandlers}
        style={[panStyle, styles.circle]}
        ><Text style={styles.text}>Drop them here!</Text></Animated.View>
      <Animated.View
          {...this.panResponder.panHandlers}
          style={[panStyle, styles.circle]}
        />
        <Animated.View
          {...this.panResponder.panHandlers}
          style={[panStyle, styles.circle]}
        />
        <Animated.View
          {...this.panResponder.panHandlers}
          style={[panStyle, styles.circle]}
        />
        </View>
      </ScrollView>
    )
  }
}

let CIRCLE_RADIUS = 30;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
  circle: {
    backgroundColor: "skyblue",
    width: CIRCLE_RADIUS * 2,
    height: CIRCLE_RADIUS * 2,
    borderRadius: CIRCLE_RADIUS
  },
  dropZone: {
    height: 200,
    backgroundColor: "#00334d"
  },
  ballContainer: {
    height:200
  },
  row: {
    flexDirection: "row"
  },  
})