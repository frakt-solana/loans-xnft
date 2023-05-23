import { web3 } from 'fbonds-core'

export const STANDART_LOOKUP_TABLE = new web3.PublicKey(
  '8Hd6eCqRPfguSkRQn1qhNeKUXCLPkhAJimFkLiWERTEm'
)

export const BONDS_PROGRAM_PUBKEY = new web3.PublicKey(
  '4tdmkuY6EStxbS6Y8s5ueznL3VPMSugrvQuDeAHGZhSt'
)
export const BONDS_ADMIN_PUBKEY = new web3.PublicKey(
  '9J4yDqU6wBkdhP5bmJhukhsEzBkaAXiBmii52kTdxpQq'
)

export const MAX_ACCOUNTS_IN_FAST_TRACK = 33

export const BOND_DECIMAL_DELTA = 1e4
export const BOND_SOL_DECIMAIL_DELTA = 1e5

export const BOND_MAX_RETURN_AMOUNT_FILTER = 1000 * 1e9 //? 1000 SOL
export const BOND_MAX_RETURN_AMOUNT_PROTECTION_BASE_POINTS = 20000 //? 200%
export const BOND_MAX_RETURN_AMOUNT_PROTECTION_LTV_MULTIPLIER = 3 //? 200%

export const BASE_POINTS = 1e4
export const PRECISION_CORRECTION_LAMPORTS = 10000 //? 200%
export const BONDS_PROTOCOL_FEE_IN_BASE_POINTS = 50
