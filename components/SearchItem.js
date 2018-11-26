import React from 'react'
import { Chip } from 'react-native-paper'
import { StyleSheet} from 'react-native'

export default class SearchItem extends React.Component { 

  constructor(props) {
    super(props)

    // console.log("term in search item props: " + props.queryData.term)

    this.state = {
      isNegative: props.queryData.isNegative
    }
  }

  // TODO: hook this method up with the ui (visual change for negative queries)
  _onPressSearchItem = () => {

    const newNeg = !this.state.isNegative
    this.setState({isNegative: newNeg})
  }

  // uses stuffs that are passed here all the way from HomeScreen... beautiful f'in mess, React -.-
  _onDeleteItem = () => {

    this.props.onDeleteItem(this.props.queryData.term, this.props.containerArrayIndex)
  }

  render() {

    // console.log("term in SearchItem component: " + this.state.term)

    return (
      <Chip onPress={() => {this._onPressSearchItem()}} onClose={() => {this._onDeleteItem()}} style={styles.chip}>
        {this.props.queryData.term}
      </Chip>
    )
  } // render

} // SearchItem

const styles = StyleSheet.create({

  chip: {
    backgroundColor: '#fff',
    margin: 4,
  },
})