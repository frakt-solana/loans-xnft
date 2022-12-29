import { Wallet } from '@frakt-protocol/frakt-sdk/lib/common/classes/nodewallet'

export const useSolanaWallet = () => {
  return (window as any)?.xnft?.solana as Wallet
}
