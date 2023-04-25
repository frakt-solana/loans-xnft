import { Wallet } from '@frakt-protocol/frakt-sdk/lib/common/classes/nodewallet'
import { proposeLoanIx } from '@frakt-protocol/frakt-sdk/lib/loans'
import { BorrowNftBulk } from '@frakt-protocol/frakt-sdk/lib/loans/loansService'
import { BN, web3 } from '@project-serum/anchor'
import { chunk } from 'lodash'

import { signAndSendAllTransactions } from './signAndSendAllTransactions'

interface TxnAndSigners {
  transaction: web3.Transaction
  signers?: web3.Signer[]
}

const PROPOSE_LOAN_IXS_PER_TXN = 3

type CreateProposeLoansTxns = (props: {
  programPublicKey: web3.PublicKey
  adminPublicKey: web3.PublicKey
  connection: web3.Connection
  walletPublicKey: web3.PublicKey
  bulkNfts: BorrowNftBulk[]
}) => Promise<TxnAndSigners[]>
const createProposeLoansTxns: CreateProposeLoansTxns = async ({
  programPublicKey,
  adminPublicKey,
  connection,
  walletPublicKey,
  bulkNfts,
}) => {
  const ixnsAndSigners = await Promise.all(
    bulkNfts.map(async (bulkNft) => {
      const { mint, valuation, isPriceBased, priceBased, solLoanValue } =
        bulkNft

      const valuationNumber = parseFloat(valuation)

      const suggestedLoanValue = priceBased?.suggestedLoanValue || 0
      const suggestedLtvPersent = (suggestedLoanValue / valuationNumber) * 100

      const rawLoanToValue = (solLoanValue / valuationNumber) * 100

      const proposedNftPrice = valuationNumber * 10 ** 9

      const loanToValue = rawLoanToValue || suggestedLtvPersent

      const { ixs, loan } = await proposeLoanIx({
        programId: programPublicKey,
        connection,
        user: walletPublicKey,
        nftMint: new web3.PublicKey(mint),
        proposedNftPrice: new BN(proposedNftPrice),
        isPriceBased: !!isPriceBased,
        loanToValue: new BN(loanToValue * 100),
        admin: adminPublicKey,
      })

      return {
        instructions: ixs,
        signer: loan,
      }
    })
  )

  const txnsAndSigners = chunk(ixnsAndSigners, PROPOSE_LOAN_IXS_PER_TXN).map(
    (ixnsAndSigners) => ({
      transaction: new web3.Transaction().add(
        ...ixnsAndSigners.map(({ instructions }) => instructions)
      ),
      signers: ixnsAndSigners.map(({ signer }) => signer),
    })
  )

  return txnsAndSigners
}

type CreateProposeLoans = (props: {
  programPublicKey: string
  adminPublicKey: string
  bulkNfts: BorrowNftBulk[]
  connection: web3.Connection
  wallet: Wallet
  onAfterSend?: () => void
}) => Promise<any>
export const createProposeLoans: CreateProposeLoans = async ({
  programPublicKey,
  adminPublicKey,
  bulkNfts,
  connection,
  wallet,
  onAfterSend,
}) => {
  const txnAndSignersArray = await createProposeLoansTxns({
    programPublicKey: new web3.PublicKey(programPublicKey),
    adminPublicKey: new web3.PublicKey(adminPublicKey),
    connection,
    walletPublicKey: wallet.publicKey,
    bulkNfts,
  })

  return await signAndSendAllTransactions({
    txnAndSignersArray,
    connection,
    wallet,
    onAfterSend,
  })
}
