import type { Amount, Currency, IssuedCurrency } from 'xrpl/dist/npm/models/common'
import { convertStringToHex, xrpToDrops } from 'xrpl/dist/npm/utils'

import { CurrencyAmount } from '@/@types/xrpl'

export const parseCurrencyName = (currency: Currency | Amount) => {
  return typeof currency === 'string' || currency.currency === 'XRP'
    ? 'XRP'
    : // @ts-ignore
      convertCurrencyCode(currency.currency) + '.' + currency.issuer?.slice(0, 8) + '...'
}

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

export const parseCurrencyCode = (currencyName: string) => {
  if (currencyName === '') {
    return currencyName
  }
  if (currencyName.length === 3) {
    return currencyName
  }
  const code = convertStringToHex(currencyName).padEnd(40, '0')
  return code
}
