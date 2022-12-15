import { DEFAULT_BACKEND_DOMAIN } from './constants'
import { createFetchBulkSuggestion, createFetchWalletNfts } from './requests'
import { createProposeLoan, createProposeLoans } from './transactions'
import {
  FetchBulkSuggestion,
  FetchWalletNfts,
  ProposeLoan,
  ProposeLoans,
} from './types'

type CreateLoansService = (props: {
  apiDomain?: string
  programPublicKey: string
  adminPublicKey: string
  onAfterSend?: () => void,
}) => {
  fetchWalletNfts: FetchWalletNfts
  fetchBulkSuggestion: FetchBulkSuggestion
  proposeLoans: ProposeLoans
  proposeLoan: ProposeLoan
}
export const createLoansService: CreateLoansService = ({
  apiDomain = DEFAULT_BACKEND_DOMAIN,
  programPublicKey,
  adminPublicKey,
  onAfterSend
}) => {
  return {
    fetchWalletNfts: createFetchWalletNfts(apiDomain),
    fetchBulkSuggestion: createFetchBulkSuggestion(apiDomain),
    proposeLoans: createProposeLoans({ programPublicKey, adminPublicKey, onAfterSend }),
    proposeLoan: createProposeLoan({ programPublicKey, adminPublicKey }),
  }
}
