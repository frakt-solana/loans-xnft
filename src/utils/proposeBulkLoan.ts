import { web3, loans, BN, TokenInfo } from "@frakt-protocol/frakt-sdk";
import { chunk } from "lodash";

const LOANS_PROGRAM_PUBKEY = "A66HabVL3DzNzeJgcHYtRRNW1ZRMKwBfrdSR4kLsZ9DJ";
const LOANS_FEE_ADMIN_PUBKEY = "9aTtUqAnuSMndCpjcPosRNf3fCkrTQAV8C8GERf3tZi3";

export const SOL_TOKEN: TokenInfo = {
  chainId: 101,
  address: "So11111111111111111111111111111111111111112",
  name: "SOL",
  decimals: 9,
  symbol: "SOL",
  logoURI:
    "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
  extensions: {
    coingeckoId: "solana",
  },
};

export interface IxnsData {
  instructions: web3.TransactionInstruction[];
  signers: web3.Signer[];
}

interface TxnData {
  transaction: web3.Transaction;
  signers: web3.Signer[];
}

export const mergeIxsIntoTxn = (ixs: IxnsData[]): TxnData => {
  const transaction = new web3.Transaction();

  transaction.add(...ixs.map(({ instructions }) => instructions).flat());

  const signers = ixs.map(({ signers }) => signers).flat();

  return {
    transaction,
    signers,
  };
};

type ProposeLoan = (props: {
  connection: web3.Connection;
  wallet: any;
  selectedBulk: any[];
}) => Promise<boolean>;

const IX_PER_TXN = 3;

export const proposeBulkLoan: ProposeLoan = async ({
  connection,
  wallet,
  selectedBulk,
}): Promise<boolean> => {
  const transactions: any[] = [];

  try {
    for (let index = 0; index < selectedBulk.length; index++) {
      const { mint, valuation, isPriceBased, priceBased, solLoanValue } =
        selectedBulk[index];

      const valuationNumber = parseFloat(valuation);

      const suggestedLoanValue = priceBased?.suggestedLoanValue;
      const suggestedLtvPersent = (suggestedLoanValue / valuationNumber) * 100;

      const rawLoanToValue = (solLoanValue / valuationNumber) * 100;

      const proposedNftPrice = valuationNumber * 10 ** SOL_TOKEN.decimals;

      const loanToValue = rawLoanToValue || suggestedLtvPersent;

      const { ix, loan } = await loans.proposeLoanIx({
        programId: new web3.PublicKey(LOANS_PROGRAM_PUBKEY),
        connection,
        user: wallet.publicKey,
        nftMint: new web3.PublicKey(mint),
        proposedNftPrice: new BN(proposedNftPrice),
        isPriceBased,
        loanToValue: new BN(loanToValue * 100),
        admin: new web3.PublicKey(LOANS_FEE_ADMIN_PUBKEY),
      });

      transactions.push({ instructions: ix, signers: [loan] });
    }

    const ixsDataChunks = chunk(transactions, IX_PER_TXN);

    const txnData = ixsDataChunks.map((ixsAndSigners) =>
      mergeIxsIntoTxn(ixsAndSigners)
    );

    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash();

    txnData.forEach(({ transaction }) => {
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;
    });

    const txn = await txnData.map(({ transaction, signers }) => {
      if (signers) {
        transaction.sign(...signers);
      }
      return transaction;
    });

    const signedTransactions = await wallet.signAllTransactions(txn);

    const txids = await Promise.all(
      signedTransactions.map((signedTransaction) =>
        connection.sendRawTransaction(signedTransaction.serialize())
      )
    );

    await Promise.all(
      txids.map((txid) =>
        connection.confirmTransaction(
          { signature: txid, blockhash, lastValidBlockHeight },
          "confirmed"
        )
      )
    );

    return true;
  } catch (error) {
    return false;
  }
};
