import { useEffect, useState } from "react";

import { BorrowNft, fetchWalletBorrowNfts } from "../api";
import { useSolanaWallet } from "./useWallet";
import { usePublicKeys } from "./xnft-hooks";
import { PublicKey } from "@solana/web3.js";
import { TESTpublicKey } from "../constants";

export const useWalletNFTs = () => {
  const { publicKey } = useSolanaWallet();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [nfts, setNfts] = useState<BorrowNft[]>([]);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const nfts = await fetchWalletBorrowNfts({
          walletPublicKey: TESTpublicKey,
        });

        setNfts(nfts);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return { nfts, isLoading };
};
