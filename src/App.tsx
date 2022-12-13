import React from 'react'
import ReactXnft, { Stack } from 'react-xnft'

import Home from './Home'
import Suggestions from './Suggestions'

export function App() {
  return (
    <Stack.Navigator
      initialRoute={{ name: 'home' }}
      options={({ route }) => ({
        title: route.name,
      })}
    >
      <Stack.Screen name={'home'} component={Home} />
      <Stack.Screen name={'suggestions'} component={Suggestions} />
    </Stack.Navigator>
  )
}
