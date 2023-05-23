import {
  BondOfferV2,
  MarketState,
  MarketTrustType,
  PairTokenType,
  PairValidationType,
} from 'fbonds-core/lib/fbond-protocol/types'

export interface BorrowNft {
  mint: string
  name: string
  collectionName: string
  imageUrl: string

  valuation: number // lamports
  freezable: boolean
  stakingAvailable: boolean
  maxLoanValue: number // Max borrow value that user can get across all loan type

  classicParams?: {
    isLimitExceeded: boolean
    maxLoanValue: number // lamports
    timeBased: {
      liquidityPoolPubkey: string
      returnPeriodDays: number // 14 (days)
      ltvPercent: number // 40 (%)
      fee: number // lamports
      feeDiscountPercent: number // 2 (%)

      loanValue: number // lamports
      repayValue: number // lamports
    }
    priceBased?: {
      liquidityPoolPubkey: string
      ltvPercent: number // 40 (%)
      borrowAPRPercent: number // 10 (%)
      collaterizationRate: number // 10(%)
    }
  }

  bondParams?: {
    duration: number
    fee: number
    marketPubkey: string
    whitelistEntry: {
      publicKey: string
      fraktMarket: string
      whitelistType: WhitelistType
      whitelistedAddress: string
    }
    fraktMarket: string
    oracleFloor: string
    durations: Array<number> //? days
  }
}

export enum WhitelistType {
  NFT = 'nft',
  CREATOR = 'creator',
  MERKLE_TREE = 'merkleTree',
}

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

export type Pair = BondOfferV2
