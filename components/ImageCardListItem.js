import React from 'react'
import { StyleSheet } from 'react-native'
import { Card } from 'react-native-paper'

/**
 * @author Timi Liljeström
 */

const ImageCardListItem = ({ imageUrl }) => {

  return (
    <Card style={styles.image}>
        <Card.Cover source={{ uri: imageUrl }} />
    </Card>
  )
}

export default ImageCardListItem

const styles = StyleSheet.create({
  image: {
    marginBottom:5,
    marginLeft: 2.5,
    marginRight: 2.5
  }
})