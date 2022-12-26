import { AMMInfoResponse, PathFindResponse } from 'xrpl'
import { Amount, IssuedCurrency } from 'xrpl/dist/npm/models/common'

export type AMMInfo = AMMInfoResponse['result']

export type CurrencyInfo = IssuedCurrency & { name: string; icon?: string; balance: number }

type PathOption = PathFindResponse['result']['alternatives'][number] & { destination_amount: Amount }
