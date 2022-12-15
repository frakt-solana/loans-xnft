import React, { ChangeEvent, FC, useCallback, useState } from 'react'
import {
  Button,
  Loading,
  Text,
  TextField,
  useNavigation,
  View,
} from 'react-xnft'
import { isNull } from 'lodash'

import {
  borrowButtonStyles,
  loadingStyles,
  maxButtonStyles,
  viewStyles,
} from './styles'
import { useMaxBorrowValue } from '../hooks'

const Home: FC = () => {
  const navigation = useNavigation()
  const { maxBorrowValue, isLoading } = useMaxBorrowValue()

  const [borrowValue, setBorrowValue] = useState<string>('')

  const onMaxClick = useCallback(
    () => setBorrowValue(maxBorrowValue?.toFixed(2) || ''),
    [maxBorrowValue]
  )

  const onTextFieldChange = (event: ChangeEvent<HTMLInputElement>): void => {
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
        <Loading style={loadingStyles} />
      </View>
    )
  }
  <Loading style={loadingStyles} />
  
  return (
    <View style={viewStyles}>
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
        <Button onClick={onMaxClick} style={maxButtonStyles}>
          MAX
        </Button>
      </View>
      <View>
        <Button
          style={borrowButtonStyles.styles(isBorrowBtnDisabled)}
          onClick={onBorrowClick}
        >
          Borrow
        </Button>
      </View>
    </View>
  )
}

export default Home
