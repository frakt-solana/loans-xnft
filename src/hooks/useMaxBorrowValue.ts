import { map, sum } from 'lodash'
import { useEffect, useState } from 'react'

import { useLoansService } from './useLoansService'
import { useSolanaWallet } from './useWallet'

export const useMaxBorrowValue = () => {
  const { publicKey } = useSolanaWallet()

  const { fetchWalletNfts } = useLoansService()

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [maxBorrowValue, setMaxBorrowValue] = useState<number | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        setIsLoading(true)
        const walletNfts = await fetchWalletNfts({
          walletPublicKey: publicKey,
          offset: 0,
          limit: 1000,
        })
        const maxBorrowValue = sum(
          map(walletNfts, ({ maxLoanValue }) => maxLoanValue)
        )
        setMaxBorrowValue(maxBorrowValue)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    })()
  }, [])

  return {
    maxBorrowValue: maxBorrowValue || null,
    isLoading,
  }
}
