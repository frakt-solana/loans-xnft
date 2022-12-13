import { Wallet } from '../loansService'

export const useSolanaWallet = () => {
  return (window as any)?.xnft?.solana as Wallet
}
