import { useState } from 'react'

import { Text, View, Pressable, ActivityIndicator } from 'react-native'
import { isEmpty } from 'lodash'

import { useSolanaConnection } from '../../hooks/xnft-hooks'
import { useSolanaWallet, useWalletNFTs } from '../../hooks'
import { Screen } from '../../components/Screen'

import { useBorrowSingleBond } from './hooks'
import { styles } from './styles'

enum LoanStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
}

export const HARD_CODE_CONNECTION = window.xnft.solana.connection

interface SuggestionsScreenProps {
  navigation: any
}

function SuggestionsScreen({ navigation }: SuggestionsScreenProps) {
  const wallet = useSolanaWallet()
  const connection = useSolanaConnection()

  const { nfts } = useWalletNFTs()

  const [loanStatus, setLoanStatus] = useState<LoanStatus | null>(null)

  const { onSubmit } = useBorrowSingleBond()

  return (
    <Screen style={styles.screen}>
      <View style={styles.container}>
        {isEmpty(nfts) ? (
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
              <div>
                {nfts.map((nft: any) => (
                  <div onClick={() => onSubmit(nft)}>{nft.name}</div>
                ))}
              </div>
            )}
          </>
        )}
      </View>
    </Screen>
  )
}

export default SuggestionsScreen
