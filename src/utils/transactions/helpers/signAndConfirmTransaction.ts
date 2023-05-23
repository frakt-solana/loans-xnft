import { web3 } from '@frakt-protocol/frakt-sdk'

interface SignAndConfirmTransactionProps {
  transaction: web3.Transaction
  signers?: web3.Signer[]
  connection: web3.Connection
  wallet: any
  commitment?: web3.Commitment
  onAfterSend?: () => void
  onBeforeApprove?: () => void
}

type SignAndConfirmTransaction = (
  props: SignAndConfirmTransactionProps
) => Promise<void>

export const signAndConfirmTransaction: SignAndConfirmTransaction = async ({
  transaction,
  signers = [],
  connection,
  wallet,
  onAfterSend,
  commitment = 'finalized',
  onBeforeApprove,
}) => {
  onBeforeApprove?.()

  const { blockhash, lastValidBlockHeight } =
    await connection.getLatestBlockhash()

  transaction.recentBlockhash = blockhash
  transaction.feePayer = wallet.publicKey

  if (signers.length) {
    transaction.sign(...signers)
  }

  const signedTransaction = await wallet.signTransaction(transaction)
  const txid = await connection.sendRawTransaction(
    signedTransaction.serialize(),
    { skipPreflight: false, preflightCommitment: 'processed' }
  )

  onAfterSend?.()

  // await connection.confirmTransaction(
  //   {
  //     signature: txid,
  //     blockhash,
  //     lastValidBlockHeight,
  //   },
  //   commitment,
  // );

  await new Promise((r) => setTimeout(r, 4000))
}
