import { useCallback, useContext } from 'react'
import { Amount, Currency as XRPLCurrency, IssuedCurrency } from 'xrpl/dist/npm/models/common'

import { AuthContext } from '@/context/authContext'
import { SwapContext } from '@/context/swapContext'

type Currency = XRPLCurrency & { value: number }

export const useSwap = () => {
  const { bestRoute, currencies } = useContext(SwapContext)
  const { state } = useContext(AuthContext)

  const convertCurrencyValueToString = (currency: Currency): Amount => {
    if (currency.currency === 'XRP') {
      return currency.value.toString()
    }
    return { ...(currency as IssuedCurrency), value: currency.value.toString() }
  }

  const swap = useCallback(async () => {
    if (!state) return Promise.resolve(null)
    const payload = {
      TransactionType: 'Payment',
      Account: state.me.account,
      Destination: state.me.account,
      Amount: convertCurrencyValueToString(currencies[1]),
      SendMax: convertCurrencyValueToString(currencies[0]),
      Paths: bestRoute?.paths_computed,
    } as const
    return state.sdk.payload.create(payload).then((payload) => payload)
  }, [bestRoute, currencies, state])

  return { swap }
}
