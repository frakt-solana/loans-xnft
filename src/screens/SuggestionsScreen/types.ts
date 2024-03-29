import { web3 } from '@frakt-protocol/frakt-sdk'
import {
  MarketState,
  MarketTrustType,
  PairTokenType,
  PairValidationType,
  CollateralBoxType,
  FraktBondState,
  BondOfferV2,
  BondTradeTransactionV2,
} from 'fbonds-core/lib/fbond-protocol/types'

interface FMarket {
  publicKey: string
  authority: string
  createdAt: string
  isRemoved: false
  state: 'initialized' //TODO what's this?
  updatedAt: string
  whitelistQuantity: number
  hadoMarket: string
}

export enum WhitelistType {
  NFT = 'nft',
  CREATOR = 'creator',
  MERKLE_TREE = 'merkleTree',
}

interface MarketWhitelistEntry {
  _id: string
  publicKey: string
  createdAt: string
  fraktMarket: string
  isDeployed: boolean
  isRemoved: boolean
  updatedAt: string
  whitelistType: WhitelistType
  whitelistedAddress: string
}

interface MarketOracle {
  publicKey: string
  fraktMarket: string
  oracleAuthority: string
  oracleInfo: string
  floor: number
  lastUpdatedAt: number
}

export interface Market {
  marketPubkey: string
  collectionImage: string
  collectionName: string
  createdAt: string
  isRemoved: boolean
  marketAuthority: string
  marketDecimals: number
  marketState: MarketState
  marketTrustType: MarketTrustType
  minBidCap: number
  pairTokenMint: string
  pairTokenType: PairTokenType
  pairValidationType: PairValidationType
  updatedAt: string
  validationAdapterProgram: string
  image: string
  name: string
  fraktMarket: FMarket
  whitelistEntry: MarketWhitelistEntry
  oracleFloor: MarketOracle
  fbondTokenName: string
}

export interface MarketPreview {
  marketPubkey: string
  collectionName: string
  collectionImage: string
  offerTVL: string
  walletRedeemAmount?: number
  apy: number //? %
  duration: Array<number> //? [7], [7, 14], [14]
  bestOffer: number //? lamports
  bestLTV: number
  activeBondsAmount: number
  fee: number
  bestDuration: number
}

export type Pair = BondOfferV2

interface FBond {
  publicKey: string
  activatedAt: number
  liquidatingAt: number
  actualReturnedAmount: number //? in lamports
  amountToReturn: number
  bondProgramAuthoritySeed: number
  collateralBoxesQuantity: number
  fbondIssuer: string
  fbondTokenMint: string
  fbondTokenSupply: number
  fraktBondState: FraktBondState
  isRemoved: boolean
  redeemedAt: number
  returnFundsOwnerSeed: number
  returnTokenAccount: string
  returnTokenMint: string
  bondCollateralOrSolReceiver: string
  fbondTokenName: string
  marketPubkey: string
  ltvPercent: string
}

interface CollateralBox {
  publicKey: string
  collateralAmount: number
  collateralBoxType: CollateralBoxType
  collateralTokenAccount: string
  collateralTokenMint: string
  fbond: string
  isRemoved: boolean
  nft: {
    mint: string
    name: string
    imageUrl: string
  }
}

export interface BondStats {
  interest: number
  averageBondPrice: number
  amountOfUserBonds: number
  apy: number
  pnl: number
  size: number
  ltv: number
  estProfit: number
  expiration: number
  isExitAvailable?: boolean
  state?: string
  when?: number
  autocompound?: string
  received?: number
  status?: FraktBondState
  pnlProfit?: number
}

export interface Bond {
  fbond: FBond
  collateralBox: CollateralBox
  autocompoundDeposits?: BondTradeTransactionV2[]
  ownerPubkey?: string
  marketPubkey: string
  stats: BondStats
  eventSignature: string
}

export interface FetchBondsRequestParams {
  skip: number
  limit: number
  sortBy: string
  order: string
  walletPubkey: web3.PublicKey
  eventType?: string
  marketPubkey?: string
}

export interface TotalBondsStats {
  activeLoans: number
  tvl: number
}

export interface MarketHistory {
  time: string
  activeBonds: number
  highestLTV: number
}

export interface BondCartOrder {
  orderSize: number //? lamports
  spotPrice: number //? lamports
  pairPubkey: string
  assetReceiver: string
  durationFilter: number
}

export interface BondOrderParams {
  market: Market
  orderParams: BondCartOrder[]
}

export interface Order {
  orderSize: number
  pricePerShare: number
  pairPubkey: string
  nftMint: string
  mathCounter: number
}
