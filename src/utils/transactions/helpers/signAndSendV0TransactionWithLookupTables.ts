import { web3 } from 'fbonds-core'
import { TxnsAndSigners } from './signAndSendAllTransactionsInSequence'
import { STANDART_LOOKUP_TABLE } from '../../bonds'

export interface InstructionsAndSigners {
  instructions: web3.TransactionInstruction[]
  signers?: web3.Signer[]
  lookupTablePublicKeys: {
    tablePubkey: web3.PublicKey
    addresses: web3.PublicKey[]
  }[]
}

type SignAndSendV0TransactionWithLookupTables = (props: {
  createLookupTableTxns: web3.Transaction[]
  extendLookupTableTxns: web3.Transaction[]

  v0InstructionsAndSigners: InstructionsAndSigners[]
  fastTrackInstructionsAndSigners: InstructionsAndSigners[]

  connection: web3.Connection
  wallet: any
  commitment?: web3.Commitment
  onBeforeApprove?: () => void
  onAfterSend?: () => void
  onSuccess?: () => void
  onError?: (error: any) => void
}) => Promise<boolean>

export const signAndSendV0TransactionWithLookupTables: SignAndSendV0TransactionWithLookupTables =
  async ({
    createLookupTableTxns,
    extendLookupTableTxns,
    v0InstructionsAndSigners,
    fastTrackInstructionsAndSigners,
    connection,
    wallet,
    commitment = 'confirmed',
    onBeforeApprove,
    onAfterSend,
    onSuccess,
    onError,
  }) => {
    try {
      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash()
      const fastTrackV0Transactions = await Promise.all(
        fastTrackInstructionsAndSigners.map(async (ixAndSigner) => {
          console.log(
            'STANDART_LOOKUP_TABLE: ',
            STANDART_LOOKUP_TABLE.toBase58()
          )
          const lookupTable = (
            await connection.getAddressLookupTable(STANDART_LOOKUP_TABLE)
          ).value

          const transactionsMessageV0 = new web3.VersionedTransaction(
            new web3.TransactionMessage({
              payerKey: wallet.publicKey,
              recentBlockhash: blockhash,
              instructions: ixAndSigner.instructions,
            }).compileToV0Message([lookupTable])
          )
          console.log('Goes here to txn v0? 2')

          transactionsMessageV0.sign([...ixAndSigner.signers])
          console.log('Goes here to txn v0? 3')

          return transactionsMessageV0
        })
      )
      const txnsAndSigners: TxnsAndSigners[][] = [
        createLookupTableTxns.map((transaction) => ({
          transaction,
          signers: [],
        })),
        extendLookupTableTxns.map((transaction) => ({
          transaction,
          signers: [],
        })),
      ]
      //? Filter empty arrays from two-dimensional array
      const txnsAndSignersFiltered = txnsAndSigners.filter(
        (arr) => !!arr.length
      )

      onBeforeApprove?.()

      const addressesPerTxn = 20

      const supposedBigIntDeactivationSlot = BigInt('18446744073518870550')
      const slotCorrection = txnsAndSigners.length + 2
      console.log('slotCorrection: ', slotCorrection)
      const lastSlot = (await connection.getSlot()) + slotCorrection

      const v0Transactions = await Promise.all(
        v0InstructionsAndSigners.map(async (ixAndSigner) => {
          console.log(
            'ixAndSigner.lookupTablePublicKeys: ',
            ixAndSigner.lookupTablePublicKeys
          )
          const lookupTables: web3.AddressLookupTableAccount[] =
            ixAndSigner.lookupTablePublicKeys.map(
              (tableData) =>
                new web3.AddressLookupTableAccount({
                  key: tableData.tablePubkey,
                  state: {
                    addresses: tableData.addresses,
                    authority: wallet.publicKey,
                    deactivationSlot:
                      supposedBigIntDeactivationSlot + BigInt(lastSlot),
                    lastExtendedSlot: lastSlot,
                    lastExtendedSlotStartIndex:
                      Math.floor(tableData.addresses.length / addressesPerTxn) *
                      addressesPerTxn,
                  },
                })
            )

          const transactionsMessageV0 = new web3.VersionedTransaction(
            new web3.TransactionMessage({
              payerKey: wallet.publicKey,
              recentBlockhash: blockhash,
              instructions: ixAndSigner.instructions,
            }).compileToV0Message([...lookupTables])
          )

          transactionsMessageV0.sign([...ixAndSigner.signers])
          return transactionsMessageV0
        })
      )

      const deactivateLookupTableTxns = v0InstructionsAndSigners
        .map((ixAndSigners) => ixAndSigners.lookupTablePublicKeys)
        .flat()
        .map((lookupTableData) =>
          web3.AddressLookupTableProgram.deactivateLookupTable({
            authority: wallet.publicKey,
            lookupTable: lookupTableData.tablePubkey,
          })
        )
        .map((instructions) => new web3.Transaction().add(instructions))
        .map((transaction) => {
          transaction.recentBlockhash = blockhash
          transaction.feePayer = wallet.publicKey
          return transaction
        })

      const v0MainAndCloseTableTxns = [
        ...v0Transactions,
        ...deactivateLookupTableTxns,
      ]

      const transactionsFlatArr = [
        ...fastTrackV0Transactions,
        ...txnsAndSignersFiltered
          .flat()
          .map(({ transaction, signers = [] }) => {
            transaction.recentBlockhash = blockhash
            transaction.feePayer = wallet.publicKey

            if (signers.length) {
              transaction.sign(...signers)
            }

            return transaction
          }),
        ...v0MainAndCloseTableTxns,
      ]

      const signedTransactions = await wallet.signAllTransactions([
        ...transactionsFlatArr,
      ])

      const txnsAndSignersWithV0Txns = [
        [...fastTrackV0Transactions, ...txnsAndSigners],
        v0MainAndCloseTableTxns,
      ]
      let currentTxIndex = 0
      for (let i = 0; i < txnsAndSignersWithV0Txns.length; i++) {
        if (txnsAndSignersWithV0Txns[i].length === 0) continue
        for (let r = 0; r < txnsAndSignersWithV0Txns[i].length; r++) {
          console.log('currentTxIndex: ', currentTxIndex)
          const txn = signedTransactions[currentTxIndex]
          if (!txn) continue
          const tx = await connection.sendRawTransaction(txn.serialize(), {
            skipPreflight: false,
            preflightCommitment: 'processed',
          })
          currentTxIndex += 1
        }
        if (txnsAndSignersWithV0Txns[i].length > 0)
          await new Promise((r) => setTimeout(r, 8000))
      }

      onAfterSend?.()
      onSuccess?.()

      return true
    } catch (error) {
      onError?.(error)
      return false
    }
  }
