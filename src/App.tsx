import { ActivityIndicator, Pressable, View } from 'react-native'
import { registerRootComponent } from 'expo'
import { RecoilRoot } from 'recoil'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useFonts, Inter_900Black } from '@expo-google-fonts/dev'
import { NavigationContainer } from '@react-navigation/native'

import SuggestionsScreen from './screens/SuggestionsScreen'
import HomeScreen from './screens/HomeScreen'
import { Arrow, Frakt } from './icons'

const Tab = createBottomTabNavigator()

function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#19191c',
          borderBottomColor: '#19191c',
        },
        headerTitleAlign: 'center',
        headerTintColor: '#fff',
        tabBarStyle: { display: 'none' },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={() => ({
          headerTitle: () => <Frakt />,
        })}
      />
      <Tab.Screen
        name="Suggestion"
        component={SuggestionsScreen}
        options={({ navigation }) => ({
          headerTitle: 'Select option',
          headerLeft: () => (
            <Pressable
              style={{ paddingLeft: 15 }}
              onPress={() => navigation.navigate('Home')}
            >
              <Arrow />
            </Pressable>
          ),
        })}
      />
    </Tab.Navigator>
  )
}

function App() {
  let [fontsLoaded] = useFonts({
    Inter_900Black,
  })

  if (!fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator />
      </View>
    )
  }

  return (
    <RecoilRoot>
      <NavigationContainer>
        <TabNavigator />
      </NavigationContainer>
    </RecoilRoot>
  )
}

export default registerRootComponent(App)
