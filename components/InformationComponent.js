import React from 'react'
import { StyleSheet } from 'react-native'
import { Button, Card, Title, Paragraph } from 'react-native-paper'

/**
 * Component for displaying help texts if the user needs them.
 * @author Timi Liljeström
 */

const InformationComponent = ({ toggleInformation, MAX_AND_QUERIES, MAX_OR_QUERIES }) => {
  
  return (
    <Card.Content>
      <Title>How to use SRCH</Title>
      <Paragraph>By clicking main categories on top of this screen, you can search pictures from our database. All the selected/clicked filters will be added to a list that will pop up above the main categories (max amount of these selected filters: {MAX_OR_QUERIES}). These selected filters can be deleted when no longer needed. See picture below.</Paragraph>
      <Card.Cover style={styles.image} source={{uri: 'http://users.metropolia.fi/~timili/images/Screenshot_20181204-152603%20-%20Copy.jpg'}} />
      <Paragraph>If the clicked main category has subcategories, they will be shown below the main categories. After clicking any category, the application will search for images that contain the filters that you have clicked. The searched items can also be filtered by clicking the "Search by time" switch. If you feel like the categories take too much space from the screen, they can be closed from the arrow on the left of overall search results. See picture below.</Paragraph>
      <Card.Cover style={styles.largeImage} source={{uri: 'http://users.metropolia.fi/~timili/images/Screenshot_20181204-152712%20-%20Copy.jpg'}} />
      <Paragraph>Clicking any of the images will give more details based on that image. The data in details view can be clicked for more filters.</Paragraph>
      <Paragraph>Filters can be also combined for AND type queries (default is OR) by long pressing that selected filter and then dragging it on top of some other filter (max combined filters: {MAX_AND_QUERIES}).</Paragraph>
      <Card.Cover style={styles.smallImage} source={{uri: 'http://users.metropolia.fi/~timili/images/Screenshot_20181204-152620%20-%20Copy.jpg'}} />
      <Paragraph>For making negative queries, you can click the selected filter once. This will change the color of that filter.</Paragraph>
      <Card.Cover style={styles.smallImage} source={{uri: 'http://users.metropolia.fi/~timili/images/Screenshot_20181204-152703%20-%20Copy.jpg'}} />
      <Card.Actions style={{marginLeft:0, paddingLeft:0}}>
        <Button onPress={()=>{toggleInformation()}}>Hide</Button>
      </Card.Actions>
    </Card.Content>
  )
}

export default InformationComponent

const styles = StyleSheet.create({
  image: {
    height: 80, 
    marginTop: 5, 
    marginBottom: 5
  },
  largeImage: {
    height: 320, 
    marginTop: 5, 
    marginBottom: 5
  },
  smallImage: {
    height: 60, 
    marginTop: 5, 
    marginBottom: 5
  }
})