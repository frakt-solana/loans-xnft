import { useState } from 'react'

import {
  Text,
  View,
  Pressable,
  ActivityIndicator,
  FlatList,
  ScrollView,
} from 'react-native'
import { isEmpty } from 'lodash'

import { useSolanaConnection } from '../../hooks/xnft-hooks'
import { useSolanaWallet, useWalletNFTs } from '../../hooks'
import { Screen } from '../../components/Screen'

import { useBorrowSingleBond } from './hooks'
import { styles } from './styles'
import { NFTtoBorrow } from '../../components/NFTtoBorrow'

enum LoanStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
}

export const HARD_CODE_CONNECTION = window?.xnft?.solana?.connection

interface SuggestionsScreenProps {
  navigation: any
}

function SuggestionsScreen({ navigation }: SuggestionsScreenProps) {
  const wallet = useSolanaWallet()
  const connection = useSolanaConnection()

  const { nfts } = useWalletNFTs()

  const nftsWithBonds = nfts.filter((nft) => nft?.bondParams)

  console.log({ nftsWithBonds })

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
                  Congrats! See your loan on frakt.xyz
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
              <ScrollView style={{ height: '100vh' }}>
                <Text style={styles.heading}>Tap to borrow</Text>
                <FlatList
                  data={nftsWithBonds}
                  numColumns={2}
                  renderItem={({ item: nft }) => (
                    <NFTtoBorrow
                      onPress={() => onSubmit(nft)}
                      imageUrl={nft.imageUrl}
                      loanValue={nft.maxLoanValue}
                      fee={nft.bondParams.fee}
                      duration={nft.bondParams.duration}
                    >
                      {nft.name}
                    </NFTtoBorrow>
                  )}
                  keyExtractor={(item) => item.mint}
                />
              </ScrollView>
            )}
          </>
        )}
      </View>
    </Screen>
  )
}

export default SuggestionsScreen
