import { sum, map, filter } from 'ramda'

export const getTotalValue = (bulk): number => {
  const priceBased = (nft) => nft?.isPriceBased
  const timeBased = (nft) => !nft?.isPriceBased
  const maxLoanValue = ({ maxLoanValue }) => maxLoanValue
  const suggestedLoanValue = (nft) => nft?.priceBased.suggestedLoanValue

  const priceBasedLoans = filter(priceBased, bulk)
  const timeBasedLoans = filter(timeBased, bulk)

  const priceBasedLoansValue =
    sum(map(suggestedLoanValue, priceBasedLoans)) || 0

  const timeBasedLoansValue = sum(map(maxLoanValue, timeBasedLoans)) || 0

  return priceBasedLoansValue + timeBasedLoansValue
}
