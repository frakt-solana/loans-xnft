import { useState } from 'react'
import { borrow } from 'fbonds-core/lib/fbond-protocol/functions/management'
import { web3 } from '@frakt-protocol/frakt-sdk'

import { filterPairs, getBondOrderParams } from './heplers'
import { HARD_CODE_CONNECTION } from './SuggestionsScreen'
import { useSolanaWallet } from '../../hooks'
import { BondCartOrder } from './types'

import { BorrowNft, fetchCertainMarket, fetchMarketPairs } from '../../api'

export enum LoanStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
}

export const useBorrowSingleBond = () => {
  const wallet = useSolanaWallet()

  const [loanStatus, setLoanStatus] = useState<LoanStatus | null>(null)

  const onSubmit = async (nft: BorrowNft) => {
    try {
      const { market, pairs } = await fetchMarketAndPairs(
        nft?.bondParams?.marketPubkey,
        wallet?.publicKey
      )

      if (!market) return

      const bondOrderParams = getBondOrderParams({
        market,
        pairs,
        maxLoanValue: nft?.maxLoanValue,
      })

      const result = await borrowSingle({
        nft,
        bondOrderParams: bondOrderParams?.orderParams,
        wallet,
        connection: HARD_CODE_CONNECTION,
        onAfterSend: () => setLoanStatus(LoanStatus.PENDING),
        onSuccess: () => setLoanStatus(LoanStatus.SUCCESS),
      })

      if (!result) {
        throw new Error('Borrow failed')
      }
    } catch (error) {
      setLoanStatus(null)
    }
  }

  return { onSubmit, loanStatus }
}

const fetchMarketAndPairs = async (
  marketPubkey: string,
  walletPubkey: web3.PublicKey
) => {
  const marketWeb3Pubkey = new web3.PublicKey(marketPubkey)
  const [pairs, market] = await Promise.all([
    await fetchMarketPairs({ marketPubkey: marketWeb3Pubkey }),
    await fetchCertainMarket({ marketPubkey: marketWeb3Pubkey }),
  ])

  const filteredPairs = filterPairs(pairs, walletPubkey)

  return { pairs: filteredPairs, market }
}

const borrowSingle = async ({
  nft,
  bondOrderParams,
  connection,
  wallet,
  onAfterSend,
  onSuccess,
}: {
  nft: BorrowNft
  bondOrderParams: BondCartOrder[]
  connection: web3.Connection
  wallet: any
  onAfterSend: () => void
  onSuccess: () => void
}) => {
  const order = {
    borrowNft: nft,
    bondOrderParams,
  }

  return await borrow({
    notBondTxns: [],
    orders: [order],
    connection,
    wallet,
    /* can place toast messages here */
    onAfterSend,
    onError: () => {},
    onSuccess,
  })
}
