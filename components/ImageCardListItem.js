import React from 'react'
import { StyleSheet, Dimensions } from 'react-native'
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-cards'

const imageWidth = (Dimensions.get("window").width / 2) - 10

const ImageCardListItem = ({ props, name, imageUrl }) => {

  return (
    <Card>
      <CardTitle
        subtitle = {name}
        style={{ maxHeight: 50 }}
      />
      <CardImage
        style = {styles.image}
        resizeMode = {'contain'}
        source={{ uri: imageUrl }}
      />
    </Card>
  )
}

export default ImageCardListItem

const styles = StyleSheet.create({
  image: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})