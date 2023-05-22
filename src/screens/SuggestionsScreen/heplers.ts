import { BondOfferV2 } from 'fbonds-core/lib/fbond-protocol/types'
import { web3 } from '@frakt-protocol/frakt-sdk'
import {
  BOND_DECIMAL_DELTA,
  getBestOrdersByBorrowValue,
} from 'fbonds-core/lib/fbond-protocol/utils/cartManagerV2'
import { Market, Pair, BondOrderParams, BondCartOrder, Order } from './types'
import {
  BASE_POINTS,
  BONDS_PROTOCOL_FEE_IN_BASE_POINTS,
} from '../../utils/bonds'

const getBondOrderParams = ({
  market,
  pairs,
  maxLoanValue,
}: {
  market: Market
  pairs: BondOfferV2[]
  maxLoanValue: number
}): BondOrderParams => {
  const { takenOrders } = getBestOrdersByBorrowValue({
    borrowValue: maxLoanValue,
    collectionFloor: market?.oracleFloor?.floor,
    bondOffers: pairs.filter((pair) => pairLoanDurationFilter({ pair })),
  })

  const bondOrderParams = {
    market,
    orderParams: takenOrders.map((order) => {
      const affectedPair = pairs.find(
        (pair) => pair.publicKey === order.pairPubkey
      )

      return convertTakenOrderToOrderParams({
        pair: affectedPair,
        takenOrder: order,
      })
    }),
  }

  return bondOrderParams
}

const filterPairs = (pairs: BondOfferV2[], walletPubkey: web3.PublicKey) => {
  return pairs
    .filter(({ currentSpotPrice }) => currentSpotPrice <= BOND_DECIMAL_DELTA)
    .map(patchPairWithProtocolFee)
    .filter(({ assetReceiver }) => assetReceiver !== walletPubkey?.toBase58())
}

export { getBondOrderParams, filterPairs }

type PatchPairWithProtocolFee = (pair: Pair) => Pair
export const patchPairWithProtocolFee: PatchPairWithProtocolFee = (pair) => {
  return {
    ...pair,
    currentSpotPrice:
      pair.currentSpotPrice -
      (pair.currentSpotPrice * BONDS_PROTOCOL_FEE_IN_BASE_POINTS) / BASE_POINTS,
    baseSpotPrice:
      pair.baseSpotPrice -
      (pair.baseSpotPrice * BONDS_PROTOCOL_FEE_IN_BASE_POINTS) / BASE_POINTS,
  }
}

type ConvertTakenOrderToOrderParams = (params: {
  pair: Pair
  takenOrder: Order
}) => BondCartOrder
export const convertTakenOrderToOrderParams: ConvertTakenOrderToOrderParams = ({
  pair,
  takenOrder,
}) => ({
  orderSize: takenOrder.orderSize,
  spotPrice: takenOrder.pricePerShare,
  pairPubkey: takenOrder.pairPubkey,
  assetReceiver: pair.assetReceiver,
  durationFilter: pair.validation.durationFilter,
  bondFeature: pair.validation.bondFeatures,
})

type PairLoanDurationFilter = (props: {
  pair: Pair
  duration?: number
}) => boolean
export const pairLoanDurationFilter: PairLoanDurationFilter = ({
  pair,
  duration = 7,
}) => duration * (24 * 60 * 60) <= pair?.validation?.durationFilter
