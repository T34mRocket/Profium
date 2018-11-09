import React from 'react';
import { Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';


const ScrollableFlatList = ({ props }) => {

    return (
        <FlatList 
            style={{maxHeight:50}}
            horizontal            
            showsHorizontalScrollIndicator={false}
            data={props}
            renderItem={({ item: rowData }) => {
            return (
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => console.log("pressed "/*+rowData.title*/)}
                    delayPressIn={50}
                    >
                    <Text>{/*{rowData.title} */} some</Text>
                </TouchableOpacity>
            );
            }}
            keyExtractor={(item, index) => index.toString()}
        />
    );
};

export default ScrollableFlatList;
  
const styles = StyleSheet.create({
    button: {
      shadowColor: 'rgba(0,0,0, .4)', // IOS
      shadowOffset: { height: 1, width: 1 }, // IOS
      shadowOpacity: 1, // IOS
      shadowRadius: 1, //IOS,
      borderRadius: 5,
      backgroundColor: '#fff',
      elevation: 4, // Android
      maxHeight: 36,
      justifyContent: 'center',
      alignItems: 'center',
      margin: 5,
      padding: 5
    }
  });