import React from 'react'
import { StyleSheet, View, Text, Dimensions } from 'react-native'
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { Card, CardContent } from 'react-native-cards'


const windowWidth = (Dimensions.get("window").width) - 40

const TimeLineSlider = ({ selectedStartYear, selectedEndYear, multiSliderValuesChange }) => {

  return (
          <View style={styles.sliderContainer}>
            <Card>
              <View style={styles.multiSlider}>
              <CardContent style={{marginTop:5}} text={`Choose Timeline`} />
                <View style={styles.sliderTextContainer}>
                    <View style={styles.boxStartTime}>
                        <Text style={styles.textStart}>{selectedStartYear} </Text>
                    </View>
                    <View style={styles.boxEndTime}>
                        <Text style={styles.textEnd}>{selectedEndYear}</Text>
                    </View>
                </View>
                <MultiSlider
                  values={[
                    selectedStartYear,
                    selectedEndYear,
                  ]}
                  onValuesChange={multiSliderValuesChange}
                  sliderLength={windowWidth}
                  min={1960}
                  max={(new Date()).getFullYear()}
                  step={1}
                  //allowOverlap
                  snapped
                />
              </View>
            </Card>
          </View>
  )
}

export default TimeLineSlider

const styles = StyleSheet.create({
    sliderContainer: {
        flexDirection: 'column',
        height:100,
        maxHeight:100
    },  
    multiSlider: {
        flex:2,
        alignItems: 'center',
    },
    sliderTextContainer : {
        flex:1,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 5,
        marginRight: 5,
        marginTop: 5,
    },
    boxStartTime: {
        flex:1
    },
    boxEndTime: {
        flex:1,
        alignItems: 'flex-end'
    },
    textStart: {
        color: 'gray',
        fontSize: 14,
        marginLeft: 5
    },
    textEnd: {
        color: 'gray',
        fontSize: 14,
        marginRight: 5
    },
})