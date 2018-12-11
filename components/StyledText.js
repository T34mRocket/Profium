import React from 'react'
import { Text } from 'react-native'

/**
 * @author Timi Liljeström
 */

export class MonoText extends React.Component {
  render() {
    return <Text {...this.props} style={[this.props.style, { fontFamily: 'space-mono' }]} />;
  }
}