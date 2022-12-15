import { filter, map, sum } from 'lodash'
import { BorrowNftBulk } from './../loansService/types'

export const getTotalValue = (bulk: BorrowNftBulk[]): number => {
  const maxLoanValue = (nft: BorrowNftBulk) => Number(nft?.maxLoanValue)
  const suggestedLoanValue = (nft: BorrowNftBulk) =>
    nft?.priceBased?.suggestedLoanValue

  const priceBasedLoans = filter(bulk, { isPriceBased: true })
  const timeBasedLoans = filter(bulk, { isPriceBased: false })

  const priceBasedLoansValue =
    sum(map(priceBasedLoans, suggestedLoanValue)) || 0

  const timeBasedLoansValue = sum(map(timeBasedLoans, maxLoanValue)) || 0

  return priceBasedLoansValue + timeBasedLoansValue
}