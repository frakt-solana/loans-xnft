import { useEffect, useState } from 'react'
import { BulkSuggestion } from '../loansService'

import { useLoansService } from './useLoansService'
import { useSolanaWallet } from './useWallet'

export const useBulkSuggestion = (solAmount = 0) => {
  const { publicKey } = useSolanaWallet()

  const { fetchBulkSuggestion } = useLoansService()

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [suggestion, setSuggestion] = useState<BulkSuggestion | null>(null)

  useEffect(() => {
    if (solAmount) {
      ;(async () => {
        try {
          setIsLoading(true)
          const suggestion = await fetchBulkSuggestion({
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
