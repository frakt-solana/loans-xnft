import { useState } from 'react'
import {
  BorrowNftBulk,
  BulkTypes,
} from '@frakt-protocol/frakt-sdk/lib/loans/loansService'
import { Text, View, Pressable, ActivityIndicator } from 'react-native'
import { isEmpty } from 'lodash'

import { LOANS_FEE_ADMIN_PUBKEY, LOANS_PROGRAM_PUBKEY } from '../../constants'
import { getTotalValue, mapSuggestionsBulkNfts } from './heplers'
import { useSolanaConnection } from '../../hooks/xnft-hooks'
import { createProposeLoans } from '../../utils'
import { Screen } from '../../components/Screen'
import { badgesInfo } from './constants'
import {
  useBulkSuggestion,
  useLoansService,
  useSolanaWallet,
} from '../../hooks'

import { styles } from './styles'

enum LoanStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
}

const HARD_CODE_CONNECTION = window.xnft.solana.connection

interface SuggestionsScreenProps {
  route: any
  navigation: any
}

function SuggestionsScreen({ route, navigation }: SuggestionsScreenProps) {
  const wallet = useSolanaWallet()
  const connection = useSolanaConnection()

  const { proposeLoans } = useLoansService()

  const { suggestion } = useBulkSuggestion(route.params.solAmount || 0)

  const bestBulk = suggestion?.best ?? []
  const cheapestBulk = suggestion?.cheapest ?? []
  const safestBulk = suggestion?.safest ?? []
  const maxBulk = suggestion?.max ?? []

  const bestBulkValue = getTotalValue(bestBulk)
  const cheapestBulkValue = getTotalValue(cheapestBulk)
  const safestBulkValue = getTotalValue(safestBulk)
  const maxBulkValue = getTotalValue(maxBulk)

  const [loanStatus, setLoanStatus] = useState<LoanStatus | null>(null)

  const onBorrow = async (type: string): Promise<void> => {
    try {
      const bulkNfts = mapSuggestionsBulkNfts(
        suggestion?.[type]
      ) as BorrowNftBulk[]

      await createProposeLoans({
        programPublicKey: LOANS_PROGRAM_PUBKEY,
        adminPublicKey: LOANS_FEE_ADMIN_PUBKEY,
        wallet,
        bulkNfts,
        connection: HARD_CODE_CONNECTION,
        onAfterSend: () => setLoanStatus(LoanStatus.PENDING),
      })

      setLoanStatus(LoanStatus.SUCCESS)
    } catch (error) {
      console.error(error)
    }
  }

  const getBulkValues = (
    bulk: BorrowNftBulk[],
    value: number,
    type: string
  ) => {
    if (!bulk.length) return
    const { color, title } = (badgesInfo as any)[type]

    return (
      <View style={styles.viewStyles(color)}>
        <View>
          <View style={styles.badge(color)}>{title}</View>
          <View style={styles.valueInfoStyles}>
            <Text style={styles.valueStyles}>
              Borrowing {value.toFixed(2)}◎
            </Text>
          </View>
          <View style={styles.nftListStyles}>
            {(bulk || []).map(({ imageUrl }) => (
              <img key={imageUrl} src={imageUrl} style={styles.imageStyles} />
            ))}
          </View>
        </View>
        <View style={styles.buttonWrapperStyles}>
          <Pressable
            style={styles.borrowButtonStyles(color)}
            onPress={() => onBorrow(type)}
          >
            <Text>Borrow</Text>
          </Pressable>
        </View>
      </View>
    )
  }

  return (
    <Screen style={styles.screen}>
      <View style={styles.container}>
        {isEmpty(suggestion) ? (
          <ActivityIndicator size="large" />
        ) : (
          <>
            {loanStatus === LoanStatus.PENDING && (
              <View style={styles.loansStatusStyles}>
                <Text style={styles.text}>
                  We are collateralizing your jpegs. It should take less than a
                  minute
                </Text>
              </View>
            )}
            {loanStatus === LoanStatus.SUCCESS && (
              <View style={styles.loansStatusStyles}>
                <Text style={styles.text}>
                  Congrats! See your NFTs in app.frakt.xyz
                </Text>
                <Pressable
                  style={styles.goBackButton}
                  onPress={() => navigation.navigate('Home')}
                >
                  <Text>Home</Text>
                </Pressable>
              </View>
            )}
            {loanStatus === null && (
              <>
                {getBulkValues(bestBulk, bestBulkValue, BulkTypes.BEST)}
                {getBulkValues(
                  cheapestBulk,
                  cheapestBulkValue,
                  BulkTypes.CHEAPEST
                )}
                {getBulkValues(safestBulk, safestBulkValue, BulkTypes.SAFEST)}
                {getBulkValues(maxBulk, maxBulkValue, BulkTypes.MAX)}
              </>
            )}
          </>
        )}
      </View>
    </Screen>
  )
}

export default SuggestionsScreen
