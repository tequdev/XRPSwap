import { xrpToDrops } from 'xrpl'
import { Amount, IssuedCurrency } from 'xrpl/dist/npm/models/common'

import { CurrencyAmount } from '@/@types/xrpl'

export const convertCurrencyCode = (currency: string): string => {
  if (currency && currency.length > 3) {
    return Buffer.from(currency, 'hex').toString('utf-8').replace(/\0/g, '')
  } else {
    return currency
  }
}

export const parseAmountValue = (amount: Amount): string => {
  if (typeof amount === 'string') {
    return amount
  }
  return amount.value
}

export const parseToXrpAmount = (amount: Amount): Amount => {
  if (typeof amount === 'string') {
    if (amount === '-1') {
      return amount
    }
    return xrpToDrops(amount)
  }
  return amount
}

export const parseCurrencyToAmount = (currency: CurrencyAmount): Amount => {
  if (currency.currency === 'XRP') {
    return currency.value.toString()
  }
  return {
    issuer: (currency as IssuedCurrency).issuer,
    currency: currency.currency,
    value: currency.value.toString(),
  } as { value: string; currency: string; issuer: string }
}
