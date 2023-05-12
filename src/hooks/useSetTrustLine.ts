import { useCallback, useContext } from 'react'
import { IssuedCurrencyAmount } from 'xrpl/dist/npm/models/common'

import { XummContext } from '@/app/context/xummContext'

export const useSetTrustLine = () => {
  const { state, sdk, isConnected } = useContext(XummContext)

  const setTrustLine = useCallback(
    async (trustLineAmount: IssuedCurrencyAmount) => {
      if (!isConnected) return Promise.resolve(null)
      const payload = {
        TransactionType: 'TrustSet',
        Account: state!.account,
        LimitAmount: trustLineAmount,
      } as const
      return sdk?.create(payload).then((payload) => payload)
    },
    [isConnected, sdk, state]
  )

  return { setTrustLine }
}
