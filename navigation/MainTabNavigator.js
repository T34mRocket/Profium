import { createStackNavigator } from 'react-navigation'
import HomeScreen from '../screens/HomeScreen'
import DetailsScreen from '../screens/DetailsScreen'

const HomeStack = createStackNavigator({
  Home: HomeScreen,
  Details: DetailsScreen
})

export default HomeStack