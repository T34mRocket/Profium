import React from 'react'
import { Platform } from 'react-native'
import { createStackNavigator } from 'react-navigation'
import TabBarIcon from '../components/TabBarIcon'
import HomeScreen from '../screens/HomeScreen'
import DetailsScreen from '../screens/DetailsScreen'

const HomeStack = createStackNavigator({
  Home: HomeScreen,
  Details: DetailsScreen
})

export default HomeStack