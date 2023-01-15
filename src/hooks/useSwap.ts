import { useCallback, useContext } from 'react'
import { xrpToDrops } from 'xrpl'
import { Amount } from 'xrpl/dist/npm/models/common'

import { CurrencyAmount } from '@/@types/xrpl'
import { AuthContext } from '@/app/context/authContext'
import { SwapContext } from '@/app/context/swapContext'

export const useSwap = () => {
  const { bestRoute, currencies } = useContext(SwapContext)
  const { state } = useContext(AuthContext)

  const convertCurrencyValueToString = (currency: CurrencyAmount, multipleBy: number = 1): Amount => {
    if (currency.currency === 'XRP') {
      return xrpToDrops(currency.value * multipleBy)
    }
    return { issuer: currency.issuer, currency: currency.currency, value: (currency.value * multipleBy).toString() }
  }

  const swap = useCallback(async () => {
    if (!state) return Promise.resolve(null)
    const payload = {
      TransactionType: 'Payment',
      Account: state.me.account,
      Destination: state.me.account,
      Amount: convertCurrencyValueToString(currencies.to),
      SendMax: convertCurrencyValueToString(currencies.from),
      Paths: bestRoute?.paths_computed,
      // tfPartialPayment: https://xrpl.org/payment.html#payment-flags
      Flags: 131072,
    } as const
    return state.sdk.payload.create(payload).then((payload) => payload)
  }, [bestRoute?.paths_computed, currencies.from, currencies.to, state])

  return { swap }
}
