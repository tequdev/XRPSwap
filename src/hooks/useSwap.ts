import { useAccount, useSignAndSubmitTransaction } from '@xrpl-wallet-standard/react'
import { useCallback, useContext } from 'react'
import type { Amount } from 'xrpl/dist/npm/models/common'
import { xrpToDrops } from 'xrpl/dist/npm/utils'

import { CurrencyAmount } from '@/@types/xrpl'
import { SwapContext } from '@/app/context/swapContext'

export const useSwap = () => {
  const { bestRoute, currencies } = useContext(SwapContext)
  const account = useAccount()
  const signAndSubmitTransaction = useSignAndSubmitTransaction()

  const convertCurrencyValueToString = (currency: CurrencyAmount, multipleBy: number = 1): Amount => {
    if (currency.currency === 'XRP') {
      return xrpToDrops(currency.value * multipleBy)
    }
    return { issuer: currency.issuer, currency: currency.currency, value: (currency.value * multipleBy).toString() }
  }

  const swap = useCallback(async () => {
    if (!account) return Promise.resolve(null)
    const payload = {
      TransactionType: 'Payment',
      Account: account.address,
      Destination: account.address,
      Amount: convertCurrencyValueToString(currencies.to),
      SendMax: convertCurrencyValueToString(currencies.from),
      Paths: bestRoute?.paths_computed,
      // tfPartialPayment: https://xrpl.org/payment.html#payment-flags
      Flags: 131072,
    } as const
    return await signAndSubmitTransaction(payload, 'xrpl:mainnet')
  }, [bestRoute?.paths_computed, currencies.from, currencies.to, account, signAndSubmitTransaction])

  return { swap }
}
