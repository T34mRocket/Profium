import React from 'react'
import { Platform } from 'react-native'
import { createStackNavigator } from 'react-navigation'
import HistoryScreen from '../screens/HistoryScreen'
import SettingsScreen from '../screens/SettingsScreen'
import TabBarIcon from '../components/TabBarIcon'
import HomeScreen from '../screens/HomeScreen'
import DetailsScreen from '../screens/DetailsScreen'

const HomeStack = createStackNavigator({
  Home: HomeScreen,
  Details: DetailsScreen
})

HomeStack.navigationOptions = {
  /*tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused = {focused}
      name = {
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),*/
}

const HistoryStack = createStackNavigator({
  Links: HistoryScreen,
})

HistoryStack.navigationOptions = {
  tabBarLabel: 'Info',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused = {focused}
      name = {Platform.OS === 'ios' ? 'ios-link' : 'md-link'}
    />
  ),
}

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen,
})

SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused = {focused}
      name = {Platform.OS === 'ios' ? 'ios-options' : 'md-options'}
    />
  ),
}


export default HomeStack/* createStackNavigator({
  HomeStack,
  HistoryStack,
  SettingsStack,
})*/