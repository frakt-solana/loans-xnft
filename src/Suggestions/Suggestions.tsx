import React, { FC, useState } from 'react'
import {
  Button,
  Image,
  Loading,
  Text,
  useSolanaConnection,
  View,
} from 'react-xnft'

import { useBulkSuggestion, useLoansService, useSolanaWallet } from '../hooks'
import { BorrowNftBulk, BulkTypes } from '../loansService'
import { badgesInfo } from './constants'
import { getTotalValue } from './helpers'
import {
  badgeStyles,
  borrowButtonStyles,
  buttonWrapperStyles,
  containerStyles,
  imageStyles,
  nftListStyles,
  valueStyles,
  viewStyles,
  valueInfoStyles,
} from './styles'

const Suggestions: FC<{ solAmount: number }> = ({ solAmount }) => {
  const [loading, setLoading] = useState<boolean>(false)

  const wallet = useSolanaWallet()
  const connection = useSolanaConnection()

  const { proposeLoans } = useLoansService()

  const { suggestion } = useBulkSuggestion(solAmount)

  const bestBulk = suggestion?.best ?? []
  const cheapestBulk = suggestion?.cheapest ?? []
  const safestBulk = suggestion?.safest ?? []
  const maxBulk = suggestion?.max ?? []

  const bestBulkValue = getTotalValue(bestBulk)
  const cheapestBulkValue = getTotalValue(cheapestBulk)
  const safestBulkValue = getTotalValue(safestBulk)
  const maxBulkValue = getTotalValue(maxBulk)

  const onBorrow = async (type: string): Promise<void> => {
    try {
      await proposeLoans({
        bulkNfts: suggestion?.[type],
        connection,
        wallet,
      })
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const getBulkValues = (
    bulk: BorrowNftBulk[],
    value: number,
    type: string
  ) => {
    if (!bulk.length) return
    const { color, title } = badgesInfo[type]

    return (
      <View style={viewStyles.styles(color)}>
        <View>
          <View style={badgeStyles.styles(color)}>{title}</View>
          <View style={valueInfoStyles}>
            <Text style={valueStyles}>Borrowing {value.toFixed(2)}◎</Text>
          </View>
          <View style={nftListStyles}>
            {(bulk || []).map(({ imageUrl }) => (
              <Image key={imageUrl} src={imageUrl} style={imageStyles} />
            ))}
          </View>
        </View>
        <View style={buttonWrapperStyles}>
          <Button
            style={borrowButtonStyles.styles(color)}
            onClick={() => onBorrow(type)}
          >
            Borrow
          </Button>
        </View>
      </View>
    )
  }
  if (loading) {
    return (
      <View>
        <Loading />
      </View>
    )
  }
  return (
    <View style={containerStyles}>
      {getBulkValues(bestBulk, bestBulkValue, BulkTypes.BEST)}
      {getBulkValues(cheapestBulk, cheapestBulkValue, BulkTypes.CHEAPEST)}
      {getBulkValues(safestBulk, safestBulkValue, BulkTypes.SAFEST)}
      {getBulkValues(maxBulk, maxBulkValue, BulkTypes.BEST)}
    </View>
  )
}

export default Suggestions
