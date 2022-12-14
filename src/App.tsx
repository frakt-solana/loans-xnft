import React from 'react'
import { Stack, View, Text } from 'react-xnft'

import Home from './Home'
import Suggestions from './Suggestions'
import { Frakt } from './iconsNew/Frakt'

export function App() {
  return (
    <Stack.Navigator
      initialRoute={{ name: 'home' }}
      // @ts-ignore
      options={({ route }) => {
        switch (route.name) {
          case 'home':
            return {
              title: (
                <View style={{ display: 'flex', justifyContent: 'center' }}>
                  <Frakt />
                </View>
              ),
            }
          case 'suggestions':
            return { title: <Text>Select option</Text> }

          default:
            throw new Error('unknown route')
        }
      }}
      style={{}}
    >
      <Stack.Screen name={'home'} component={() => <Home />} />
      <Stack.Screen name={'suggestions'} component={Suggestions} />
    </Stack.Navigator>
  )
}
