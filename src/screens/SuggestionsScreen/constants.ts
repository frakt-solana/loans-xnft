import { BulkTypes } from '@frakt-protocol/frakt-sdk/lib/loans/loansService'

export declare type BadgesInfos = {
  [key in BulkTypes]?: BadgesInfo[]
}

export interface BadgesInfo {
  title: string
  text: string
  color: string
}

export const badgesInfo = {
  best: {
    title: 'Best',
    text: 'Most appropriate to chosen SOL amount',
    color: '#9cff1f',
  },
  cheapest: {
    title: 'Cheapest',
    text: 'Minimal fees paid',
    color: '#fff61f',
  },
  safest: {
    title: 'Safest',
    text: 'Loans with lowest loan to value ratio',
    color: '#1fc9ff',
  },
  max: {
    title: 'Best',
    text: 'Most appropriate to chosen SOL amount',
    color: '#9cff1f',
  },
}
