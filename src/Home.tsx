import React, { useCallback, useState } from 'react'
import {
  Button,
  Loading,
  Text,
  TextField,
  useNavigation,
  View,
} from 'react-xnft'
import { isNull } from 'lodash'

import { useMaxBorrowValue } from './hooks'

const Home = () => {
  const navigation = useNavigation()
  const { maxBorrowValue, isLoading } = useMaxBorrowValue()

  const [borrowValue, setBorrowValue] = useState<string>('')

  const onMaxClick = useCallback(
    () => setBorrowValue(maxBorrowValue?.toFixed(2) || ''),
    [maxBorrowValue]
  )

  const onTextFieldChange = (event: any) => {
    const value = event.target.value
    setBorrowValue(value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1'))
  }

  const isBorrowBtnDisabled =
    !borrowValue ||
    parseFloat(borrowValue) > parseFloat(maxBorrowValue?.toFixed(2) || '0')

  const onBorrowClick = () => {
    if (!isBorrowBtnDisabled) {
      navigation.push('suggestions', { solAmount: parseFloat(borrowValue) })
    }
  }

  if (isLoading || isNull(maxBorrowValue)) {
    return (
      <View>
        <Loading />
      </View>
    )
  }
  return (
    <View
      style={{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '60px',
        gap: '15px',
      }}
    >
      <View>
        <Text>Borrow up tp {maxBorrowValue?.toFixed(2)}◎ with your NFTs!</Text>
      </View>
      <View style={{ position: 'relative' }}>
        <TextField
          style={{ width: '100%' }}
          placeholder={maxBorrowValue?.toFixed(2)}
          value={borrowValue}
          onChange={onTextFieldChange}
        />
        <Button
          onClick={onMaxClick}
          style={{
            background: 'transparent',
            position: 'absolute',
            right: 0,
            top: '5px',
            bottom: '5px',
          }}
        >
          MAX
        </Button>
      </View>
      <View>
        <Button
          style={{
            opacity: isBorrowBtnDisabled ? '0.5' : '1',
            backgroundColor: '#9cff1f',
            color: 'black',
          }}
          onClick={onBorrowClick}
        >
          Borrow
        </Button>
      </View>
    </View>
  )
}

export default Home
