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
}) => Promise<{
  fetchWalletNfts: FetchWalletNfts
  fetchBulgSuggestion: FetchBulkSuggestion
  proposeLoans: ProposeLoans
  proposeLoan: ProposeLoan
}>
export const createLoansService: CreateLoansService = async ({
  apiDomain = DEFAULT_BACKEND_DOMAIN,
  programPublicKey,
  adminPublicKey,
}) => {
  return {
    fetchWalletNfts: createFetchWalletNfts(apiDomain),
    fetchBulgSuggestion: createFetchBulkSuggestion(apiDomain),
    proposeLoans: createProposeLoans({ programPublicKey, adminPublicKey }),
    proposeLoan: createProposeLoan({ programPublicKey, adminPublicKey }),
  }
}
