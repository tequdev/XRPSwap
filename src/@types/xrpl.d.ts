import { PathFindResponse } from 'xrpl'
import { Amount, IssuedCurrency } from 'xrpl/dist/npm/models/common'

export type CurrencyInfo = IssuedCurrency & { name: string; icon?: string; balance: number }

type PathOption = PathFindResponse['result']['alternatives'][number] & { destination_amount: Amount }

export type CurrencyAmount = IssuedCurrency & { name: string; value: number }

export type TokensMarketData = {
  issuer: string
  currency: string
  name: string
  volume: number
  market_cap: number
  last_trade_at: string
  price: number
  trades: number
  supply: number
  logo?: string
}
