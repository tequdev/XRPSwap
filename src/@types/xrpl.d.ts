import { AMMInfoResponse, PathFindResponse } from 'xrpl'
import { Amount, IssuedCurrency } from 'xrpl/dist/npm/models/common'

export type AMMInfo = AMMInfoResponse['result']

export type IssuedCurrencyInfo = IssuedCurrency & { name: string; icon?: string }

type PathOption = PathFindResponse['result']['alternatives'][number] & { destination_amount: Amount }
