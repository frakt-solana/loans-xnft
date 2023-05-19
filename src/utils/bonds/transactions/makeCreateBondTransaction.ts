import { web3 } from 'fbonds-core'

import {
  BONDS_ADMIN_PUBKEY,
  BONDS_PROGRAM_PUBKEY,
  BOND_DECIMAL_DELTA,
  PRECISION_CORRECTION_LAMPORTS,
} from '../constants'
import { mergeBondOrderParamsByPair } from '../utils'
import { chunk, uniqBy } from 'lodash'

import { createBondAndSellToOffers } from 'fbonds-core/lib/fbond-protocol/functions/fbond-factory'
import { InstructionsAndSigners } from '../../transactions'
import { BondCartOrder } from '../../../screens/SuggestionsScreen/types'
import { sendTxnPlaceHolder } from '../..'

type MakeCreateBondMultiOrdersTransaction = (params: {
  marketPubkey: string
  fraktMarketPubkey: string
  oracleFloorPubkey: string
  whitelistEntryPubkey: string
  // bondOrder: BondOrder;
  bondOrderParams: BondCartOrder[]
  nftMint: string

  connection: web3.Connection
  wallet: any
}) => Promise<{
  createLookupTableTxn: web3.Transaction
  extendLookupTableTxns: web3.Transaction[]
  createAndSellBondsIxsAndSigners: InstructionsAndSigners
}>

export const makeCreateBondMultiOrdersTransaction: MakeCreateBondMultiOrdersTransaction =
  async ({
    marketPubkey,
    fraktMarketPubkey,
    oracleFloorPubkey,
    whitelistEntryPubkey,
    bondOrderParams,
    nftMint,
    connection,
    wallet,
  }) => {
    const amountToReturn =
      Math.trunc(
        bondOrderParams.reduce((sum, order) => sum + order.orderSize, 0)
      ) * BOND_DECIMAL_DELTA

    const durationFilter = bondOrderParams.reduce(
      (smallestDurationParam, orderParams) =>
        smallestDurationParam.durationFilter < orderParams.durationFilter
          ? smallestDurationParam
          : orderParams
    ).durationFilter

    const mergedPairsOrderParams = mergeBondOrderParamsByPair({
      bondOrderParams,
    })

    const sellBondParamsAndAccounts = mergedPairsOrderParams.map(
      (orderParam) => ({
        minAmountToGet: Math.max(
          Math.floor(
            orderParam.orderSize * orderParam.spotPrice -
              PRECISION_CORRECTION_LAMPORTS -
              Math.floor(Math.random() * 10000)
          ),
          0
        ),
        amountToSell: Math.floor(orderParam.orderSize),
        bondOfferV2: new web3.PublicKey(orderParam.pairPubkey),
        assetReceiver: new web3.PublicKey(orderParam.assetReceiver),
      })
    )
    console.log('sellBondParamsAndAccounts: ', sellBondParamsAndAccounts)

    const sellingBondsIxsAndSignersWithLookupAccounts =
      await createBondAndSellToOffers({
        accounts: {
          tokenMint: new web3.PublicKey(nftMint),
          fraktMarket: new web3.PublicKey(fraktMarketPubkey),
          oracleFloor: new web3.PublicKey(oracleFloorPubkey),
          whitelistEntry: new web3.PublicKey(whitelistEntryPubkey),
          hadoMarket: new web3.PublicKey(marketPubkey),
          userPubkey: wallet.publicKey,
          protocolFeeReceiver: new web3.PublicKey(BONDS_ADMIN_PUBKEY),
        },
        addComputeUnits: true,
        args: {
          sellBondParamsAndAccounts,
          amountToDeposit: 1,
          amountToReturn: amountToReturn,
          bondDuration: durationFilter,
        },
        connection,
        programId: BONDS_PROGRAM_PUBKEY,
        sendTxn: sendTxnPlaceHolder,
      })
    const slot = await connection.getSlot()

    console.log('INITIAL PASSED SLOT: ', slot)
    const combinedAddressesForLookupTable = uniqBy(
      [
        // ...addressesForLookupTable,
        ...sellingBondsIxsAndSignersWithLookupAccounts.addressesForLookupTable,
      ],
      (publicKey) => publicKey.toBase58()
    )
    console.log(
      'combinedAddressesForLookupTable: ',
      combinedAddressesForLookupTable.length
    )
    const [lookupTableInst, lookupTableAddress] =
      web3.AddressLookupTableProgram.createLookupTable({
        authority: wallet.publicKey,
        payer: wallet.publicKey,
        recentSlot: slot - 2,
      })
    const extendInstructions = chunk(combinedAddressesForLookupTable, 20).map(
      (chunkOfAddressesForLookupTable) =>
        web3.AddressLookupTableProgram.extendLookupTable({
          payer: wallet.publicKey,
          authority: wallet.publicKey,
          lookupTable: lookupTableAddress,
          addresses: chunkOfAddressesForLookupTable,
        })
    )
    const createLookupTableTxn = new web3.Transaction().add(
      lookupTableInst,
      extendInstructions[0]
    )
    const restExtendInstructions = extendInstructions.slice(
      1,
      extendInstructions.length
    )

    const restExtendTransactions = restExtendInstructions.map((extendIx) =>
      new web3.Transaction().add(extendIx)
    )

    return {
      createLookupTableTxn: createLookupTableTxn,
      extendLookupTableTxns: restExtendTransactions,
      createAndSellBondsIxsAndSigners: {
        instructions: [
          // ...createBondIxns,
          ...sellingBondsIxsAndSignersWithLookupAccounts.instructions,
        ],
        signers: [
          // ...createBondSigners,
          ...sellingBondsIxsAndSignersWithLookupAccounts.signers,
        ],
        lookupTablePublicKeys: [
          {
            tablePubkey: lookupTableAddress,
            addresses: combinedAddressesForLookupTable,
          },
        ],
      },
    }
  }
