import { useMemo } from 'react'

import { LOANS_FEE_ADMIN_PUBKEY, LOANS_PROGRAM_PUBKEY } from '../constants'
import { createLoansService } from '../loansService'

export const useLoansService = () => {
  return useMemo(
    () =>
      createLoansService({
        programPublicKey: LOANS_PROGRAM_PUBKEY,
        adminPublicKey: LOANS_FEE_ADMIN_PUBKEY,
      }),
    []
  )
}
