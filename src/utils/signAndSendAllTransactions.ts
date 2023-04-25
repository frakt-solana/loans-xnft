import { Wallet } from '@frakt-protocol/frakt-sdk/lib/common/classes/nodewallet'
import { web3 } from '@frakt-protocol/frakt-sdk'

interface TxnAndSigners {
  transaction: web3.Transaction
  signers?: web3.Signer[]
}

export type SignAndSendAllTransactions = (props: {
  txnAndSignersArray: TxnAndSigners[]
  connection: web3.Connection
  wallet: Wallet
  commitment?: web3.Commitment
  onBeforeApprove?: () => void
  onAfterSend?: () => void
}) => Promise<
  PromiseSettledResult<web3.RpcResponseAndContext<web3.SignatureResult>>[]
>
export const signAndSendAllTransactions: SignAndSendAllTransactions = async ({
  txnAndSignersArray,
  connection,
  wallet,
  commitment = 'finalized',
  onBeforeApprove,
  onAfterSend,
}) => {
  onBeforeApprove?.()

  const { blockhash, lastValidBlockHeight } =
    await connection.getLatestBlockhash()

  const transactions = txnAndSignersArray.map(
    ({ transaction, signers = [] }) => {
      transaction.recentBlockhash = blockhash
      transaction.feePayer = wallet.publicKey

      if (signers.length) {
        transaction.sign(...signers)
      }

      return transaction
    }
  )

  const signedTransactions = await wallet.signAllTransactions(transactions)

  const txnSignatures = await Promise.all(
    signedTransactions.map((txn) =>
      connection.sendRawTransaction(txn.serialize(), {
        skipPreflight: false,
      })
    )
  )

  onAfterSend?.()

  return await Promise.allSettled(
    txnSignatures.map((signature) =>
      connection.confirmTransaction(
        {
          signature,
          blockhash,
          lastValidBlockHeight,
        },
        commitment
      )
    )
  )
}
