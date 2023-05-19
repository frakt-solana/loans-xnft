import { HARD_CODE_CONNECTION } from './SuggestionsScreen'
import { filterPairs, getBondOrderParams } from './heplers'
import { useSolanaWallet } from '../../hooks'
import { web3 } from '@frakt-protocol/frakt-sdk'
import { BondCartOrder, Market, Pair } from './types'
import axios from 'axios'
import {
  MAX_ACCOUNTS_IN_FAST_TRACK,
  makeCreateBondMultiOrdersTransaction,
} from '../../utils/bonds'
import { signAndSendV0TransactionWithLookupTables } from '../../utils/transactions'

export const useBorrowSingleBond = () => {
  const wallet = useSolanaWallet()

  const onSubmit = async (nft: any) => {
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
      })

      if (!result) {
        throw new Error('Borrow failed')
      }
    } catch (error) {
      console.log(error)
    } finally {
      //   closeLoadingModal()
    }
  }

  return { onSubmit }
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
}: {
  nft: any
  bondOrderParams: BondCartOrder[]
  connection: web3.Connection
  wallet: any
}) => {
  console.log(nft, 'nft')
  console.log({
    nftMint: nft?.mint,
    marketPubkey: nft?.bondParams?.marketPubkey,
    fraktMarketPubkey: nft?.fraktMarket,
    oracleFloorPubkey: nft?.oracleFloor,
    whitelistEntryPubkey: nft?.bondParams?.whitelistEntry?.publicKey,
    bondOrderParams: bondOrderParams,
    connection,
    wallet,
  })
  const {
    createLookupTableTxn,
    extendLookupTableTxns,
    createAndSellBondsIxsAndSigners,
  } = await makeCreateBondMultiOrdersTransaction({
    nftMint: nft?.mint,
    marketPubkey: nft?.bondParams?.marketPubkey,
    fraktMarketPubkey: nft?.bondParams?.fraktMarket,
    oracleFloorPubkey: nft?.bondParams?.oracleFloor,
    whitelistEntryPubkey: nft?.bondParams?.whitelistEntry?.publicKey,
    bondOrderParams: bondOrderParams,
    connection,
    wallet,
  })

  const ableToOptimize =
    createAndSellBondsIxsAndSigners.lookupTablePublicKeys
      .map((lookup: any) => lookup.addresses)
      .flat().length <= MAX_ACCOUNTS_IN_FAST_TRACK

  return await signAndSendV0TransactionWithLookupTables({
    createLookupTableTxns: ableToOptimize ? [] : [createLookupTableTxn],
    extendLookupTableTxns: ableToOptimize ? [] : extendLookupTableTxns,
    v0InstructionsAndSigners: ableToOptimize
      ? []
      : [createAndSellBondsIxsAndSigners],
    fastTrackInstructionsAndSigners: ableToOptimize
      ? [createAndSellBondsIxsAndSigners]
      : [],
    connection,
    wallet,
    commitment: 'confirmed',
  })
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

type FetchCertainMarket = (props: {
  marketPubkey: web3.PublicKey
}) => Promise<Market>
export const fetchCertainMarket: FetchCertainMarket = async ({
  marketPubkey,
}) => {
  const { data } = await axios.get<Market>(
    `https://api.frakt.xyz/markets/${marketPubkey?.toBase58()}`
  )

  return data
}
