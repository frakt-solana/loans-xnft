import { useEffect, useState } from 'react'

import { BorrowNft, fetchWalletBorrowNfts } from '../api'
import { useSolanaWallet } from './useWallet'

export const useWalletNFTs = () => {
  const { publicKey } = useSolanaWallet()

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [nfts, setNfts] = useState<BorrowNft[]>([])

  useEffect(() => {
    ;(async () => {
      try {
        setIsLoading(true)
        const nfts = await fetchWalletBorrowNfts({
          walletPublicKey: publicKey,
        })

        setNfts(nfts)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    })()
  }, [])

  return { nfts, isLoading }
}
