import { useCallback, useContext } from 'react'
import type { Amount } from 'xrpl/dist/npm/models/common'
import { xrpToDrops } from 'xrpl/dist/npm/utils'

import { CurrencyAmount } from '@/@types/xrpl'
import { SwapContext } from '@/app/context/swapContext'
import { XummContext } from '@/app/context/xummContext'

export const useSwap = () => {
  const { bestRoute, currencies } = useContext(SwapContext)
  const { state, sdk, isConnected } = useContext(XummContext)

  const convertCurrencyValueToString = (currency: CurrencyAmount, multipleBy: number = 1): Amount => {
    if (currency.currency === 'XRP') {
      return xrpToDrops(currency.value * multipleBy)
    }
    return { issuer: currency.issuer, currency: currency.currency, value: (currency.value * multipleBy).toString() }
  }

  const swap = useCallback(async () => {
    if (!isConnected) return Promise.resolve(null)
    const payload = {
      txjson: {
        TransactionType: 'Payment',
        Account: state!.account,
        Destination: state!.account,
        Amount: convertCurrencyValueToString(currencies.to),
        SendMax: convertCurrencyValueToString(currencies.from),
        Paths: bestRoute?.paths_computed,
        // tfPartialPayment: https://xrpl.org/payment.html#payment-flags
        Flags: 131072,
      },
      options: {
        expire: 15,
      },
    } as const
    return sdk?.create(payload).then((payload) => payload)
  }, [bestRoute?.paths_computed, currencies.from, currencies.to, isConnected, sdk, state])

  return { swap }
}
