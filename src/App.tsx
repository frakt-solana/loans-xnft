import { ActivityIndicator, Pressable, View } from 'react-native'
import { registerRootComponent } from 'expo'
import { RecoilRoot } from 'recoil'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useFonts, Inter_900Black } from '@expo-google-fonts/dev'
import { NavigationContainer } from '@react-navigation/native'

import SuggestionsScreen from './screens/SuggestionsScreen'
import { Frakt } from './icons'
import { Buffer } from 'buffer'

const Tab = createBottomTabNavigator()
// @ts-ignore
window.Buffer = Buffer

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
        name="Suggestion"
        component={SuggestionsScreen}
        options={() => ({
          headerTitle: () => <Frakt />,
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
