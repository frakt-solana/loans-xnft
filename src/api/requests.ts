import { web3 } from 'fbonds-core'
import axios from 'axios'

import { BorrowNft, Market, Pair } from './types'

const BACKEND_DOMAIN = 'api.frakt.xyz'

type FetchWalletBorrowNfts = (props: {
  walletPublicKey: web3.PublicKey
}) => Promise<BorrowNft[]>

export const fetchWalletBorrowNfts: FetchWalletBorrowNfts = async ({
  walletPublicKey,
}) => {
  const { data } = await axios.get<BorrowNft[]>(
    `https://${BACKEND_DOMAIN}/nft/meta2/${walletPublicKey?.toBase58()}?sort=asc&skip=0&limit=100&sortBy=name`
  )

  return data
}

type FetchCertainMarket = (props: {
  marketPubkey: web3.PublicKey
}) => Promise<Market>

export const fetchCertainMarket: FetchCertainMarket = async ({
  marketPubkey,
}) => {
  const { data } = await axios.get<Market>(
    `https://${BACKEND_DOMAIN}/markets/${marketPubkey?.toBase58()}`
  )

  return data
}

type FetchMarketPairs = (props: {
  marketPubkey: web3.PublicKey
}) => Promise<Pair[]>
export const fetchMarketPairs: FetchMarketPairs = async ({ marketPubkey }) => {
  const { data } = await axios.get<Pair[]>(
    `https://api.frakt.xyz/bond-offers/${marketPubkey?.toBase58()}`
  )

  return data
}
