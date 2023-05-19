import { useEffect, useState } from 'react'
import {
  BorrowNftBulk,
  BulkTypes,
} from '@frakt-protocol/frakt-sdk/lib/loans/loansService'
import { web3 } from '@frakt-protocol/frakt-sdk'

import { useSolanaWallet } from './useWallet'

export declare type BulkSuggestion = {
  [key in BulkTypes]?: BorrowNftBulk[]
}

export const useWalletNFTs = () => {
  const { publicKey } = useSolanaWallet()

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [suggestion, setSuggestion] = useState<BulkSuggestion | any>(null)

  useEffect(() => {
    ;(async () => {
      try {
        setIsLoading(true)
        const suggestion = await fetchSuggestNfts({
          walletPublicKey: publicKey,
        })

        setSuggestion(suggestion)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    })()
  }, [])

  return {
    suggestion: suggestion || null,
    isLoading,
  }
}

const fetchSuggestNfts = async ({
  walletPublicKey,
}: {
  walletPublicKey: web3.PublicKey
}): Promise<BulkSuggestion | null> => {
  try {
    const result = await (
      await fetch(
        `https://api.frakt.xyz/nft/meta2/${walletPublicKey?.toBase58()}?sort=asc&skip=0&limit=100&sortBy=name`
      )
    ).json()

    return result
  } catch (error) {
    console.error(error)
    return null
  }
}
