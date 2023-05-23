import { Bond, BondCartOrder, Pair } from './../../screens/SuggestionsScreen/types';
import {
  BondFeatures,
  FraktBondState,
} from 'fbonds-core/lib/fbond-protocol/types'


import { groupBy } from 'ramda'

export const calcBondRedeemLamports = (bond: Bond) => {
  const { fbond, stats } = bond
  return (
    stats.amountOfUserBonds *
    (fbond.actualReturnedAmount / fbond.fbondTokenSupply)
  )
}

export const isBondAvailableToRedeem = (bond: Bond) => {
  const { fbond } = bond

  return (
    fbond.fraktBondState === FraktBondState.Repaid ||
    fbond.fraktBondState === FraktBondState.Liquidated
  )
}

type PairLoanDurationFilter = (props: {
  pair: Pair
  duration?: number
}) => boolean
export const pairLoanDurationFilter: PairLoanDurationFilter = ({
  pair,
  duration = 7, //? Days
  // }) => duration * (24 * 60 * 60) <= pair?.validation?.durationFilter; //TODO: Allow to take loans with shorter duration
}) => duration * (24 * 60 * 60) <= pair?.validation?.durationFilter

type PairLtvFilter = (props: { pair: Pair; ltvBasePoints: number }) => boolean
export const pairLtvFilter: PairLtvFilter = ({
  pair,
  ltvBasePoints = 1000, //? 1000 === 10%
}) => ltvBasePoints <= pair?.validation?.loanToValueFilter

type MergeBondOrderParamsByPair = (props: {
  bondOrderParams: BondCartOrder[]
}) => BondCartOrder[]
export const mergeBondOrderParamsByPair: MergeBondOrderParamsByPair = ({
  bondOrderParams,
}) => {
  const groupedPairOrderParams = Object.values(
    groupBy((orderParam) => orderParam.pairPubkey, bondOrderParams)
  )

  const mergedPairsOrderParams = groupedPairOrderParams.map((orderParams) =>
    orderParams.reduce((acc, orderParam) => ({
      ...acc,
      orderSize: acc.orderSize + orderParam.orderSize,
      spotPrice:
        (acc.orderSize * acc.spotPrice +
          orderParam.orderSize * orderParam.spotPrice) /
        (acc.orderSize + orderParam.orderSize),
    }))
  )

  return mergedPairsOrderParams
}

export const isBondFeaturesAutomated = (bondFeature: BondFeatures) =>
  bondFeature === BondFeatures.Autocompound ||
  bondFeature === BondFeatures.AutoreceiveSol ||
  bondFeature === BondFeatures.AutoCompoundAndReceiveNft ||
  bondFeature === BondFeatures.AutoReceiveAndReceiveNft
    ? true
    : false

export const isAutocompoundBondFeature = (bondFeature: BondFeatures) =>
  bondFeature === BondFeatures.Autocompound ||
  bondFeature === BondFeatures.AutoCompoundAndReceiveNft
    ? true
    : false

export const isLiquidatedBondFeature = (bondFeature: BondFeatures) =>
  bondFeature === BondFeatures.None ||
  bondFeature === BondFeatures.Autocompound ||
  bondFeature === BondFeatures.AutoreceiveSol
