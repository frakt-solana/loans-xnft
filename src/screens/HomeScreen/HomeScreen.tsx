import { isNull } from 'lodash'
import { useCallback, useState } from 'react'
import {
  Text,
  View,
  TextInput,
  Pressable,
  ActivityIndicator,
} from 'react-native'

import { Screen } from '../../components/Screen'
import { useMaxBorrowValue } from '../../hooks'

import { styles } from './styles'

function HomeScreen({ navigation }: { navigation: any }) {
  const { maxBorrowValue, isLoading } = useMaxBorrowValue()
  const [borrowValue, setBorrowValue] = useState<string>('0')

  const onMaxClick = useCallback(
    () => setBorrowValue(maxBorrowValue?.toFixed(2) || ''),
    [maxBorrowValue]
  )

  const onTextFieldChange = (event: any): void => {
    const value = event.target.value
    setBorrowValue(value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1'))
  }

  const isBorrowBtnDisabled = !parseFloat(borrowValue)

  const onBorrowClick = () => {
    if (!isBorrowBtnDisabled) {
      navigation.navigate('Suggestion', { solAmount: parseFloat(borrowValue) })
    }
  }

  if (isLoading || isNull(maxBorrowValue)) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <Screen style={styles.screen}>
      <Text style={styles.text}>
        Borrow up tp {maxBorrowValue?.toFixed(2)}◎ with your NFTs!
      </Text>
      <View style={{ position: 'relative' }}>
        <TextInput
          style={styles.input}
          placeholder={maxBorrowValue?.toFixed(2)}
          value={borrowValue}
          onChange={onTextFieldChange}
        />
        <Pressable style={styles.button} onPress={onMaxClick}>
          <Text style={styles.text}>MAX</Text>
        </Pressable>
      </View>
      <View>
        <Pressable
          disabled={isBorrowBtnDisabled}
          style={[
            styles.borrowButton,
            isBorrowBtnDisabled ? styles.borrowButtonDisabled : '',
          ]}
          onPress={onBorrowClick}
        >
          <Text style={styles.textDark}>Borrow</Text>
        </Pressable>
      </View>
    </Screen>
  )
}

export default HomeScreen
