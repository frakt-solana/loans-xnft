import { useMemo } from 'react'
import { createLoansService } from '@frakt-protocol/frakt-sdk/lib/loans/loansService'

import {
  DEFAULT_BACKEND_DOMAIN,
  LOANS_FEE_ADMIN_PUBKEY,
  LOANS_PROGRAM_PUBKEY,
} from '../constants'

export const useLoansService = () => {
  return useMemo(
    () =>
      createLoansService({
        apiDomain: DEFAULT_BACKEND_DOMAIN,
        programPublicKey: LOANS_PROGRAM_PUBKEY,
        adminPublicKey: LOANS_FEE_ADMIN_PUBKEY,
      }),
    []
  )
}
