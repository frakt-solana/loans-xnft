import React, { FC } from 'react'
import { Stack, View, Text } from 'react-xnft'

import Suggestions from './Suggestions/Suggestions'
import { Frakt } from './iconsNew/Frakt'
import Home from './Home/Home'

export const App: FC = () => {
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
    >
      <Stack.Screen name={'home'} component={() => <Home />} />
      <Stack.Screen name={'suggestions'} component={Suggestions} />
    </Stack.Navigator>
  )
}
