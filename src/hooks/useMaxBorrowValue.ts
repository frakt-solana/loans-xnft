import { useEffect, useState } from 'react'
import { web3 } from '@frakt-protocol/frakt-sdk'
import { map, sum } from 'lodash'

import { useSolanaWallet } from './useWallet'

export const useMaxBorrowValue = () => {
  const { publicKey } = useSolanaWallet()

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [maxBorrowValue, setMaxBorrowValue] = useState<number | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        setIsLoading(true)
        const walletNfts = await fetchWalletBorrowNfts({
          walletPublicKey: publicKey,
          limit: 1000,
          skip: 0,
        })
        const maxBorrowValue =
          sum(map(walletNfts, ({ maxLoanValue }) => maxLoanValue)) / 1e9
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

export const fetchWalletBorrowNfts = async ({
  walletPublicKey,
  limit,
  skip,
}: {
  walletPublicKey: web3.PublicKey
  limit: number
  skip: number
}) => {
  const result = await (
    await fetch(
      `https://api.frakt.xyz/nft/meta2/${walletPublicKey?.toBase58()}?limit=${limit}&skip=${skip}`
    )
  ).json()

  return result
}
