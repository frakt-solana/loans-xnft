import { useMemo } from 'react'
import { createLoansService } from '@frakt-protocol/frakt-sdk/lib/loans/loansService'

import { LOANS_FEE_ADMIN_PUBKEY, LOANS_PROGRAM_PUBKEY } from '../constants'
import { DEFAULT_BACKEND_DOMAIN } from './../loansService/constants'

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
