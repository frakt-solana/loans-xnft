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

export const useBulkSuggestion = (solAmount = 0) => {
  const { publicKey } = useSolanaWallet()

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [suggestion, setSuggestion] = useState<BulkSuggestion | any>(null)

  useEffect(() => {
    if (solAmount) {
      ;(async () => {
        try {
          setIsLoading(true)
          const suggestion = await fetchSuggestNfts({
            walletPublicKey: publicKey,
            totalValue: solAmount,
          })

          setSuggestion(suggestion)
        } catch (error) {
          console.error(error)
        } finally {
          setIsLoading(false)
        }
      })()
    }
  }, [solAmount])

  return {
    suggestion: suggestion || null,
    isLoading,
  }
}

const fetchSuggestNfts = async ({
  walletPublicKey,
  totalValue,
}: {
  walletPublicKey: web3.PublicKey
  totalValue: number
}): Promise<BulkSuggestion | null> => {
  try {
    const result = await (
      await fetch(
        `https://api.frakt.xyz/nft/suggest2/${walletPublicKey?.toBase58()}?solAmount=${totalValue}`
      )
    ).json()

    return result
  } catch (error) {
    console.error(error)
    return null
  }
}
